import { NextResponse } from 'next/server';
import { site } from '@/data/site';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, notes, date, slot, treatments } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required.' },
        { status: 400 }
      );
    }

    const bookingId = `KK-${Date.now().toString(36).toUpperCase()}`;
    const formattedTreatments = Array.isArray(treatments)
      ? treatments.map((t: string) => `• ${t}`).join('\n')
      : 'General Consultation';

    // 1. Plain text summary for SMS / WhatsApp API / Log
    const notificationText = `🔔 *NEW CLINIC BOOKING [${bookingId}]*
----------------------------------------
👤 *Client Name:* ${name}
📞 *Mobile Number:* ${phone}
📧 *Email:* ${email || 'Not provided'}

📅 *Appointment Slot:* ${date || 'N/A'} at ${slot || 'N/A'}
📋 *Treatments Requested:*
${formattedTreatments}

📝 *Client Notes / Skin Concerns:*
${notes || 'None'}
----------------------------------------
Clinic Location: Poonamallee, Chennai`;

    console.log(`[BACKEND AGENT] New booking ${bookingId} received:`);
    console.log(notificationText);

    // 2. Automated Webhook / WhatsApp API Dispatch (e.g. Twilio, UltraMsg, WATI, Make.com, Zapier)
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || process.env.BOOKING_NOTIFICATION_WEBHOOK;
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(whatsappToken ? { Authorization: `Bearer ${whatsappToken}` } : {}),
          },
          body: JSON.stringify({
            event: 'NEW_BOOKING',
            bookingId,
            shopPhone: site.phone,
            shopPhoneHref: site.phoneHref,
            message: notificationText,
            client: { name, phone, email, notes, date, slot, treatments },
          }),
        });
        console.log(`[BACKEND AGENT] Webhook dispatched successfully to ${webhookUrl}`);
      } catch (webhookErr) {
        console.error('[BACKEND AGENT] Webhook dispatch error:', webhookErr);
      }
    }

    // 3. Automated Email Notification Dispatch (Resend API)
    const resendApiKey = process.env.RESEND_API_KEY;
    const clinicEmail = process.env.CLINIC_NOTIFICATION_EMAIL || site.email;

    if (resendApiKey && clinicEmail) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Kamars Khyra Bookings <bookings@kamarskhyra.com>',
            to: [clinicEmail],
            subject: `New Booking [${bookingId}] - ${name} (${date || 'Requested'})`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #14140f; max-width: 600px;">
                <h2 style="color: #1f3a2e; border-bottom: 2px solid #f5cf47; padding-bottom: 10px;">
                  New Booking Alert — ${bookingId}
                </h2>
                <p><strong>Client Name:</strong> ${name}</p>
                <p><strong>Mobile Number:</strong> <a href="tel:${phone}">${phone}</a></p>
                <p><strong>Email:</strong> ${email || 'Not provided'}</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                <p><strong>Appointment Date & Time:</strong> ${date || 'N/A'} at ${slot || 'N/A'}</p>
                <p><strong>Treatments Requested:</strong></p>
                <ul style="background: #f8f5ef; padding: 15px 25px; border-radius: 8px;">
                  ${Array.isArray(treatments) ? treatments.map((t: string) => `<li>${t}</li>`).join('') : '<li>General Consultation</li>'}
                </ul>
                <p><strong>Skin Concerns / Notes:</strong> ${notes || 'None'}</p>
              </div>
            `,
          }),
        });
        console.log(`[BACKEND AGENT] Email notification sent to ${clinicEmail}`);
      } catch (emailErr) {
        console.error('[BACKEND AGENT] Email notification error:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Booking details dispatched automatically to shop administration.',
    });
  } catch (error) {
    console.error('[BACKEND AGENT] Booking processing failed:', error);
    return NextResponse.json(
      { error: 'Failed to process booking request.' },
      { status: 500 }
    );
  }
}
