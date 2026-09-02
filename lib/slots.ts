import {
  addDays,
  addMinutes,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from 'date-fns';

/**
 * Appointment slot generation.
 *
 * IMPORTANT: this is calendar arithmetic only. It knows nothing about real bookings —
 * there is no backend yet, so the only slots shown as unavailable are ones that are
 * genuinely impossible (a closed day, a time already past, inside the lead time).
 * It deliberately does NOT invent "booked" slots, which would mislead a client into
 * thinking the calendar reflects the clinic's real diary.
 *
 * TODO: when the booking backend exists, pass real taken/capacity data into
 * `getSlots` via the `taken` argument and confirm whether per-treatment daily
 * capacity caps are needed (open decision in CLAUDE.md).
 */

export const CLINIC = {
  // TODO: confirm opening hours, slot length and weekly closed day(s) with the client.
  openMinutes: 10 * 60, // 10:00
  closeMinutes: 19 * 60, // 19:00 — last slot starts before this
  slotMinutes: 45,
  /** 0 = Sunday. */
  closedWeekdays: [0] as number[],
  /** Minimum notice before an appointment can be booked. */
  leadTimeMinutes: 120,
  /** How far ahead the calendar allows booking. */
  bookableDaysAhead: 60,
};

export interface Slot {
  /** 24h "HH:mm" — the stable value stored on the booking. */
  value: string;
  /** "10:00 am" — what the client sees. */
  label: string;
  available: boolean;
}

export function isClosed(date: Date): boolean {
  return CLINIC.closedWeekdays.includes(date.getDay());
}

export function isBookableDay(date: Date, now: Date = new Date()): boolean {
  const day = startOfDay(date);
  if (isBefore(day, startOfDay(now))) return false;
  if (isBefore(addDays(startOfDay(now), CLINIC.bookableDaysAhead), day)) return false;
  return !isClosed(day);
}

/**
 * @param taken "HH:mm" values already booked for this date — supplied by the backend
 *              once one exists. Empty until then.
 */
export function getSlots(date: Date, taken: string[] = [], now: Date = new Date()): Slot[] {
  if (isClosed(date)) return [];

  const slots: Slot[] = [];
  const earliest = addMinutes(now, CLINIC.leadTimeMinutes);

  for (let m = CLINIC.openMinutes; m + CLINIC.slotMinutes <= CLINIC.closeMinutes; m += CLINIC.slotMinutes) {
    const at = addMinutes(startOfDay(date), m);
    const value = format(at, 'HH:mm');
    slots.push({
      value,
      label: format(at, 'h:mm a').toLowerCase(),
      available: !isBefore(at, earliest) && !taken.includes(value),
    });
  }

  return slots;
}

/** Six-week grid covering the given month, padded to whole weeks (Monday-first). */
export function monthGrid(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });
}

export function isSameDate(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && isSameDay(a, b);
}

export function formatAppointment(date: Date, slot: string): string {
  return `${format(date, 'EEEE d MMMM yyyy')} at ${slot}`;
}
