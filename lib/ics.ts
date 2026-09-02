import { addMinutes, format, parse } from 'date-fns';
import { site } from '@/data/site';

/**
 * Builds a downloadable .ics for the confirmation screen's "add to calendar" button.
 * Generated client-side — there is no calendar integration to call.
 */
export function buildAppointmentIcs({
  date,
  slot,
  treatments,
  durationMinutes = 60,
}: {
  date: Date;
  /** "HH:mm" */
  slot: string;
  treatments: string[];
  durationMinutes?: number;
}): string {
  const start = parse(slot, 'HH:mm', date);
  const end = addMinutes(start, durationMinutes);
  const stamp = (d: Date) => format(d, "yyyyMMdd'T'HHmmss");
  const location = `${site.address.line1}, ${site.address.line2}, ${site.address.city}-${site.address.postcode}`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kamars Khyra//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${crypto.randomUUID()}@kamarskhyra`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeIcs(`${site.name} — ${treatments.join(', ')}`)}`,
    `LOCATION:${escapeIcs(location)}`,
    `DESCRIPTION:${escapeIcs(`Appointment at ${site.name}. Questions: ${site.phone}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

function escapeIcs(value: string): string {
  return value.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
}

export function icsDownloadUrl(ics: string): string {
  return URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
}
