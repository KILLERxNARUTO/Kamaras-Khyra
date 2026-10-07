import { NextResponse } from 'next/server';
import { getBookedSlotsForDate, isSlotBooked, addBooking } from '@/lib/bookingStore';

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
const INTERMEDIATE_SENDER_PHONE = process.env.INTERMEDIATE_SENDER_PHONE || '918438165114';
const SHOP_PHONE_NUMBER = process.env.SHOP_PHONE_NUMBER || '918870590674';

function sanitizePhoneNumber(phone: string) {
  let cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return cleaned;
}

function cleanEnvVar(val?: string) {
  if (!val) return '';
  return val.replace(/^["']|["']$/g, '').trim();
}

async function sendWhatsAppMessage({
  to,
  templateName,
  parameters,
  textMessage,
}: {
  to: string;
  templateName?: string;
  parameters?: string[];
  textMessage?: string;
}) {
  const token = cleanEnvVar(process.env.META_ACCESS_TOKEN);
  const phoneId = cleanEnvVar(process.env.META_PHONE_NUMBER_ID);

  if (!token || !phoneId || token === 'YOUR_META_PERMANENT_ACCESS_TOKEN' || phoneId === 'YOUR_META_PHONE_NUMBER_ID') {
    console.warn('[META API WARNING] Credentials not provided or placeholder in .env file.');
    return { mock: true };
  }

  const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

  let payload: Record<string, unknown>;

  if (templateName && parameters) {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: parameters.map((p) => ({ type: 'text', text: String(p) })),
          },
        ],
      },
    };
  } else {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: textMessage },
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(`[META API ERROR] Target: ${to}`, data);
    if (data?.error?.code === 190) {
      console.error('🔑 [OAUTH EXCEPTION 190] Your Meta Access Token has expired or is invalid. Please generate a new System User Token from developers.facebook.com.');
    }
    throw new Error(data?.error?.message || 'Meta API failed');
  }

  return data;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ success: true, bookedSlots: [] });
    }

    const bookedSlots = getBookedSlotsForDate(date);
    return NextResponse.json({
      success: true,
      date,
      bookedSlots,
    });
  } catch (error: unknown) {
    const errObj = error as { message?: string };
    return NextResponse.json(
      { success: false, error: errObj.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, date, rawDate, slot, notes } = body;

    if (!name || !phone || !service || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (name, phone, service, date).' },
        { status: 400 }
      );
    }

    // Check double-booking if rawDate & slot provided
    if (rawDate && slot) {
      if (isSlotBooked(rawDate, slot)) {
        return NextResponse.json(
          { success: false, error: 'This time slot has already been reserved. Please select another slot.' },
          { status: 409 }
        );
      }
    }

    const cleanedCustomerPhone = sanitizePhoneNumber(phone);
    const cleanedShopPhone = sanitizePhoneNumber(SHOP_PHONE_NUMBER);

    if (!/^\d{10,15}$/.test(cleanedCustomerPhone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone format. Must be E.164 format (e.g. 918870590674).' },
        { status: 400 }
      );
    }

    const bookingId = `BK-${Date.now().toString(36).substring(2, 8).toUpperCase()}`;

    // Persist booking to store
    if (rawDate && slot) {
      const storeRes = addBooking({
        id: bookingId,
        name,
        phone: cleanedCustomerPhone,
        service,
        dateStr: rawDate,
        slot,
        appointmentFormatted: date,
        notes,
        createdAt: new Date().toISOString(),
      });

      if (!storeRes.success) {
        return NextResponse.json(
          { success: false, error: storeRes.error || 'Failed to reserve time slot.' },
          { status: 409 }
        );
      }
    }

    const customerTextAlert = `✨ *BOOKING CONFIRMED* ✨\n\nDear *${name}*,\nYour booking for *${service}* has been reserved!\n\n📌 *Booking ID:* ${bookingId}\n📅 *Date & Time:* ${date}\n${notes ? `📝 *Notes:* ${notes}\n` : ''}\nThank you for choosing Kamars Khyra!`;

    const shopOwnerTextAlert = `🔔 *NEW BOOKING ALERT* 🔔\n\n📌 *Booking ID:* ${bookingId}\n👤 *Customer:* ${name}\n📞 *Phone:* +${cleanedCustomerPhone}\n💇 *Service:* ${service}\n📅 *Date & Time:* ${date}\n${notes ? `📝 *Notes:* ${notes}\n` : ''}`;

    let isMock = false;
    if (!process.env.META_ACCESS_TOKEN || !process.env.META_PHONE_NUMBER_ID) {
      console.warn('⚠️ [META API NOTICE] META_ACCESS_TOKEN or META_PHONE_NUMBER_ID is missing in .env file.');
      isMock = true;
    }

    const [customerResult, shopResult] = await Promise.allSettled([
      sendWhatsAppMessage({
        to: cleanedCustomerPhone,
        templateName: process.env.META_CUSTOMER_TEMPLATE || 'booking_confirmation',
        parameters: [name, bookingId, service, date],
      }).catch(() =>
        sendWhatsAppMessage({ to: cleanedCustomerPhone, textMessage: customerTextAlert })
      ),

      sendWhatsAppMessage({
        to: cleanedShopPhone,
        templateName: process.env.META_SHOP_TEMPLATE || 'new_booking_alert',
        parameters: [name, cleanedCustomerPhone, service, date],
      }).catch(() =>
        sendWhatsAppMessage({ to: cleanedShopPhone, textMessage: shopOwnerTextAlert })
      ),
    ]);

    // Forward to self-hosted Baileys bot service if running
    const backendPort = process.env.PORT || 5000;
    try {
      await fetch(`http://127.0.0.1:${backendPort}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone: cleanedCustomerPhone,
          serviceName: service,
          date,
          time: slot,
          bookingRef: bookingId,
          notes,
        }),
      });
    } catch {
      // Baileys standalone server not currently active, handled gracefully
    }

    const customerStatus = customerResult.status === 'fulfilled' ? 'Sent' : 'Failed';
    const shopStatus = shopResult.status === 'fulfilled' ? 'Sent' : 'Failed';

    const directWhatsAppUrl = `https://wa.me/${cleanedShopPhone}?text=${encodeURIComponent(shopOwnerTextAlert)}`;

    return NextResponse.json({
      success: true,
      bookingId,
      isMock,
      message: isMock
        ? 'Booking registered. Meta Cloud API credentials not configured in .env file.'
        : 'Booking registered and WhatsApp dispatches executed.',
      dispatches: {
        customer: customerStatus,
        shopOwner: shopStatus,
      },
      directWhatsAppUrl,
    });
  } catch (error: unknown) {
    const errObj = error as { message?: string };
    console.error('[BOOKING ROUTE ERROR]', errObj);
    return NextResponse.json(
      { success: false, error: errObj.message || 'Server error' },
      { status: 500 }
    );
  }
}
