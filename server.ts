import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import whatsappRoutes, { renderQrPage } from './routes/whatsapp';
import { baileysWhatsApp } from './services/baileysWhatsApp';
import { addBooking, isSlotBooked, getBookedSlotsForDate } from './lib/bookingStore';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Baileys WhatsApp bot on server launch
baileysWhatsApp.initialize().catch((err) => {
  console.error('[SERVER] Baileys initialization error:', err);
});

// WhatsApp Bot API Routes & QR interface
app.use('/api/whatsapp', whatsappRoutes);
app.get('/whatsapp-qr', renderQrPage);
app.get('/api/whatsapp/view-qr', renderQrPage);

/**
 * Normalizes phone numbers
 */
function sanitizePhoneNumber(phone: string) {
  let cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Health check
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    whatsappBot: baileysWhatsApp.getStatus().status,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Unified booking handler
 * Accepts appointment requests, saves to database/store, and dispatches automated WhatsApp alert
 */
async function handleBookingSubmission(req: Request, res: Response) {
  try {
    const { name, customerName, phone, service, serviceName, date, time, rawDate, slot, notes } = req.body;

    const resolvedName = customerName || name;
    const resolvedService = serviceName || service;
    const resolvedTime = time || slot;

    if (!resolvedName || !phone || !resolvedService || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customerName, phone, serviceName, and date are required.',
      });
    }

    const cleanedCustomerPhone = sanitizePhoneNumber(phone);

    // Double-booking collision check if rawDate & slot are provided
    if (rawDate && slot) {
      if (isSlotBooked(rawDate, slot)) {
        return res.status(409).json({
          success: false,
          error: 'This time slot has already been reserved. Please select another slot.',
        });
      }
    }

    const bookingRef = `BK-${Date.now().toString(36).substring(2, 8).toUpperCase()}`;

    // Persist to store if rawDate & slot are available
    if (rawDate && slot) {
      addBooking({
        id: bookingRef,
        name: resolvedName,
        phone: cleanedCustomerPhone,
        service: resolvedService,
        dateStr: rawDate,
        slot,
        appointmentFormatted: date,
        notes,
        createdAt: new Date().toISOString(),
      });
    }

    console.log(`\n========================================`);
    console.log(`[NEW BOOKING RECEIVED] ID: ${bookingRef}`);
    console.log(`Customer: ${resolvedName} (+${cleanedCustomerPhone})`);
    console.log(`Service: ${resolvedService} | Date: ${date} ${resolvedTime ? `@ ${resolvedTime}` : ''}`);
    console.log(`========================================\n`);

    // Dispatch automated owner notification via Baileys (with CallMeBot fallback)
    const alertDispatches = await baileysWhatsApp.dispatchBookingAlert({
      customerName: resolvedName,
      phone: cleanedCustomerPhone,
      serviceName: resolvedService,
      date,
      time: resolvedTime,
      bookingRef,
      notes,
    });

    const directWhatsAppUrl = `https://wa.me/${process.env.OWNER_PHONE || '917305063062'}?text=${encodeURIComponent(
      `Hi Kamars Khyra, I would like to confirm booking ${bookingRef} for ${resolvedName} (${date})`
    )}`;

    return res.status(200).json({
      success: true,
      bookingRef,
      bookingId: bookingRef,
      message: 'Booking saved and WhatsApp owner notification dispatched.',
      dispatches: alertDispatches,
      directWhatsAppUrl,
    });
  } catch (error: any) {
    console.error('[BOOKING CONTROLLER ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while processing booking.',
      details: error.message,
    });
  }
}

// POST /api/bookings (Spec requirement)
app.post('/api/bookings', handleBookingSubmission);

// POST /api/book (Backward compatibility with existing UI components)
app.post('/api/book', handleBookingSubmission);

// GET /api/book (Slot availability query for calendar picker)
app.get('/api/book', (req: Request, res: Response) => {
  const date = req.query.date as string;
  if (!date) {
    return res.json({ success: true, bookedSlots: [] });
  }
  const bookedSlots = getBookedSlotsForDate(date);
  return res.json({ success: true, date, bookedSlots });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Kamars Khyra WhatsApp Server running on port ${PORT}`);
  console.log(`📲 Scan WhatsApp QR at: http://localhost:${PORT}/whatsapp-qr`);
  console.log(`📡 Status Endpoint:    http://localhost:${PORT}/api/whatsapp/status`);
  console.log(`📅 Bookings Endpoint:   POST http://localhost:${PORT}/api/bookings`);
  console.log(`======================================================\n`);
});
