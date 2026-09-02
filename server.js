const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variable validation
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
const INTERMEDIATE_SENDER_PHONE = process.env.INTERMEDIATE_SENDER_PHONE || '918438165114';
const SHOP_PHONE_NUMBER = process.env.SHOP_PHONE_NUMBER || '918870590674';

function cleanEnvVar(val) {
  if (!val) return '';
  return val.replace(/^["']|["']$/g, '').trim();
}

/**
 * Format phone number into clean E.164 format (digits only, e.g. 919345023531)
 */
function sanitizePhoneNumber(phone) {
  let cleaned = (phone || '').replace(/\D/g, '');
  // Default to India country code 91 if 10 digits entered
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Meta WhatsApp Cloud API Message Sender
 */
async function sendWhatsAppMessage({ to, templateName, parameters, textMessage }) {
  const token = cleanEnvVar(process.env.META_ACCESS_TOKEN);
  const phoneId = cleanEnvVar(process.env.META_PHONE_NUMBER_ID);

  if (!token || !phoneId || token === 'YOUR_META_PERMANENT_ACCESS_TOKEN' || phoneId === 'YOUR_META_PHONE_NUMBER_ID') {
    console.warn('[META API WARNING] Credentials missing or placeholder in environment variables.');
    return { mock: true };
  }

  const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

  let payload;

  if (templateName) {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: parameters.map((param) => ({
              type: 'text',
              text: String(param),
            })),
          },
        ],
      },
    };
  } else {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        preview_url: false,
        body: textMessage,
      },
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error(`[META API ERROR] Target: ${to}`, responseData);
    if (responseData?.error?.code === 190) {
      console.error('🔑 [OAUTH EXCEPTION 190] Your Meta Access Token has expired or is invalid. Please generate a new token from developers.facebook.com.');
    }
    throw new Error(
      responseData?.error?.message || `Meta API request failed with status ${response.status}`
    );
  }

  return responseData;
}

/**
 * POST /api/book
 * Booking handler with concurrent WhatsApp dispatches via Promise.allSettled
 */
app.post('/api/book', async (req, res) => {
  try {
    const { name, phone, service, date, notes } = req.body;

    // Server-side validation
    if (!name || !phone || !service || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, phone, service, and date are required.',
      });
    }

    const cleanedCustomerPhone = sanitizePhoneNumber(phone);
    const cleanedShopPhone = sanitizePhoneNumber(SHOP_PHONE_NUMBER);

    // E.164 pattern check (10 to 15 digits)
    if (!/^\d{10,15}$/.test(cleanedCustomerPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Please provide a valid number with country code (e.g. 919345023531).',
      });
    }

    // Generate unique Booking ID (e.g., BK-7X9A12)
    const bookingId = `BK-${Date.now().toString(36).substring(2, 8).toUpperCase()}`;

    console.log(`\n========================================`);
    console.log(`[NEW BOOKING REQUEST] ID: ${bookingId}`);
    console.log(`Customer: ${name} (${cleanedCustomerPhone})`);
    console.log(`Service: ${service} | Date: ${date}`);
    console.log(`Shop Owner Phone: ${cleanedShopPhone}`);
    console.log(`========================================\n`);

    // Prepare text fallback messages in case templates are not configured in sandbox
    const customerTextAlert = `✨ *BOOKING CONFIRMED* ✨\n\nDear *${name}*,\nYour booking for *${service}* has been successfully reserved!\n\n📌 *Booking ID:* ${bookingId}\n📅 *Date & Time:* ${date}\n${notes ? `📝 *Notes:* ${notes}\n` : ''}\nThank you for choosing Kamars Khyra!`;

    const shopOwnerTextAlert = `🔔 *NEW BOOKING ALERT* 🔔\n\n📌 *Booking ID:* ${bookingId}\n👤 *Customer:* ${name}\n📞 *Phone:* +${cleanedCustomerPhone}\n💇 *Service:* ${service}\n📅 *Date & Time:* ${date}\n${notes ? `📝 *Notes:* ${notes}\n` : ''}`;

    // Concurrently dispatch both messages using Promise.allSettled
    const [customerResult, shopResult] = await Promise.allSettled([
      // Dispatch 1: To Customer
      sendWhatsAppMessage({
        to: cleanedCustomerPhone,
        templateName: process.env.META_CUSTOMER_TEMPLATE || 'booking_confirmation',
        parameters: [name, bookingId, service, date],
      }).catch((err) => {
        // Fallback to direct text if template doesn't exist
        console.warn(`[CUSTOMER TEMPLATE FALLBACK] Trying text message for ${cleanedCustomerPhone}`);
        return sendWhatsAppMessage({
          to: cleanedCustomerPhone,
          textMessage: customerTextAlert,
        });
      }),

      // Dispatch 2: To Shop Owner
      sendWhatsAppMessage({
        to: cleanedShopPhone,
        templateName: process.env.META_SHOP_TEMPLATE || 'new_booking_alert',
        parameters: [name, cleanedCustomerPhone, service, date],
      }).catch((err) => {
        // Fallback to direct text for shop owner
        console.warn(`[SHOP TEMPLATE FALLBACK] Trying text message for ${cleanedShopPhone}`);
        return sendWhatsAppMessage({
          to: cleanedShopPhone,
          textMessage: shopOwnerTextAlert,
        });
      }),
    ]);

    const customerStatus = customerResult.status === 'fulfilled' ? 'Sent' : `Failed (${customerResult.reason?.message})`;
    const shopStatus = shopResult.status === 'fulfilled' ? 'Sent' : `Failed (${shopResult.reason?.message})`;

    console.log(`[DISPATCH STATUS] Customer WhatsApp: ${customerStatus}`);
    console.log(`[DISPATCH STATUS] Shop Owner WhatsApp: ${shopStatus}`);

    return res.status(200).json({
      success: true,
      bookingId,
      message: 'Booking completed successfully and WhatsApp notifications dispatched.',
      dispatches: {
        customer: customerStatus,
        shopOwner: shopStatus,
      },
    });
  } catch (error) {
    console.error('[BOOKING SERVER ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your booking.',
      details: error.message,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Meta WhatsApp Cloud API Booking Server running on port ${PORT}`);
  console.log(`📍 Endpoint: POST http://localhost:${PORT}/api/book`);
  console.log(`📱 Default Shop Phone: +${SHOP_PHONE_NUMBER}\n`);
});
