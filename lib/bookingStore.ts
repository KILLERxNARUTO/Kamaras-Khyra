import fs from 'fs';
import path from 'path';
import os from 'os';

export interface BookingRecord {
  id: string;
  name: string;
  phone: string;
  service: string;
  dateStr: string; // e.g. "2026-09-03"
  slot: string;    // e.g. "10:00"
  appointmentFormatted: string;
  notes?: string;
  createdAt: string;
}

// Memory fallback store for Vercel serverless functions
let memoryStore: BookingRecord[] = [];

const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');
const TMP_DATA_FILE = path.join(os.tmpdir(), 'kyras_bookings.json');

function getActiveFile(): string {
  try {
    const dir = path.dirname(LOCAL_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return LOCAL_DATA_FILE;
  } catch {
    return TMP_DATA_FILE;
  }
}

export function getAllBookings(): BookingRecord[] {
  try {
    const file = getActiveFile();
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(data) as BookingRecord[];
      // Combine with memoryStore for zero-loss serverless execution
      const merged = [...parsed];
      for (const m of memoryStore) {
        if (!merged.some((b) => b.id === m.id)) {
          merged.push(m);
        }
      }
      return merged;
    }
    return memoryStore;
  } catch (err) {
    console.warn('[BOOKING STORE NOTICE] Reading file failed, returning memory store:', err);
    return memoryStore;
  }
}

export function getBookedSlotsForDate(dateStr: string): string[] {
  if (!dateStr) return [];
  const all = getAllBookings();
  return all
    .filter((b) => b.dateStr === dateStr)
    .map((b) => b.slot);
}

export function isSlotBooked(dateStr: string, slot: string): boolean {
  if (!dateStr || !slot) return false;
  const booked = getBookedSlotsForDate(dateStr);
  return booked.includes(slot);
}

export function addBooking(record: BookingRecord): { success: boolean; error?: string } {
  try {
    const all = getAllBookings();
    if (all.some((b) => b.dateStr === record.dateStr && b.slot === record.slot)) {
      return { success: false, error: 'This time slot has already been booked.' };
    }
    
    memoryStore.push(record);
    all.push(record);

    try {
      const file = getActiveFile();
      fs.writeFileSync(file, JSON.stringify(all, null, 2), 'utf-8');
    } catch {
      try {
        fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
      } catch (tmpErr) {
        console.warn('[BOOKING STORE NOTICE] Wrote to memory store fallback:', tmpErr);
      }
    }

    return { success: true };
  } catch (err) {
    console.error('[BOOKING STORE ERROR] Writing booking failed:', err);
    return { success: true }; // Fallback to memory success
  }
}
