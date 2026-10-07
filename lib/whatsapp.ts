import { site } from '@/data/site';

/**
 * Normalizes phone numbers to standard numeric strings (without '+', spaces, or dashes).
 * Default country code fallback for 10-digit Indian numbers is '91'.
 */
export function formatWhatsAppPhone(phone: string, defaultCountryCode = '91'): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return `${defaultCountryCode}${digits}`;
  }
  return digits;
}

/**
 * Creates direct `https://wa.me/<PHONE>?text=<ENCODED_MESSAGE>` link.
 */
export function createWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = formatWhatsAppPhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface BookingWhatsAppDetails {
  bookingRef?: string;
  customerName: string;
  phone: string;
  serviceName: string;
  date: string;
  time?: string;
  notes?: string;
}

/**
 * Dynamic message templates for customer-initiated WhatsApp interactions.
 */
export const WhatsAppTemplates = {
  generalInquiry(name?: string): string {
    return [
      `Hello ${site.name},`,
      name ? `My name is ${name}.` : '',
      `I would like to inquire about your doctor-assisted medi-facial consultations and treatment availability.`,
    ]
      .filter(Boolean)
      .join('\n\n');
  },

  serviceDetails(serviceName: string, category?: string): string {
    return [
      `Hello ${site.name},`,
      `I am interested in learning more about the *${serviceName}*${category ? ` (${category})` : ''} procedure.`,
      `Could you please share details regarding session duration, pre-care steps, and available slots?`,
    ].join('\n\n');
  },

  appointmentRequest(details: BookingWhatsAppDetails): string {
    const lines = [
      `✨ *APPOINTMENT INQUIRY - ${site.name}*`,
      `--------------------------------`,
      `*Client:* ${details.customerName}`,
      `*Phone:* ${details.phone}`,
      `*Service:* ${details.serviceName}`,
      `*Date:* ${details.date}`,
      details.time ? `*Time:* ${details.time}` : '',
      details.bookingRef ? `*Booking Ref:* ${details.bookingRef}` : '',
      details.notes ? `*Notes:* ${details.notes}` : '',
      `--------------------------------`,
      `Hello Doctor, I would like to confirm my consultation booking!`,
    ];
    return lines.filter(Boolean).join('\n');
  },

  customMessage(message: string): string {
    return message.trim();
  },
};
