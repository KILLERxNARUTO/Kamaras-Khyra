'use client';

import { useEffect, useMemo, useState } from 'react';
import { addMonths, format, isSameMonth, isToday, startOfMonth, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CLINIC, getSlots, isBookableDay, isSameDate, monthGrid } from '@/lib/slots';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SlotPicker({
  date,
  slot,
  onChange,
}: {
  date: Date | null;
  slot: string | null;
  onChange: (date: Date, slot: string | null) => void;
}) {
  const [month, setMonth] = useState(() => startOfMonth(date ?? new Date()));
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!date) {
      setBookedSlots([]);
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    setLoadingSlots(true);
    fetch(`/api/book?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookedSlots)) {
          setBookedSlots(data.bookedSlots);
        } else {
          setBookedSlots([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch booked slots:', err);
        setBookedSlots([]);
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [date]);

  const days = useMemo(() => monthGrid(month), [month]);
  const slots = useMemo(() => (date ? getSlots(date, bookedSlots) : []), [date, bookedSlots]);

  return (
    <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-14 bg-rich-black">
      <div className="w-full max-w-80">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonth(subMonths(month, 1))}
            aria-label="Previous month"
            className="rounded-full border border-sage/30 p-2 text-cream hover:border-antique-gold hover:text-antique-gold transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p aria-live="polite" className="font-serif text-lg font-bold text-cream">
            {format(month, 'MMMM yyyy')}
          </p>
          <button
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
            aria-label="Next month"
            className="rounded-full border border-sage/30 p-2 text-cream hover:border-antique-gold hover:text-antique-gold transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="pb-2 text-[0.65rem] uppercase tracking-[0.1em] text-antique-gold font-bold">
              {d}
            </span>
          ))}

          {days.map((day) => {
            const outside = !isSameMonth(day, month);
            const bookable = isBookableDay(day);
            const selected = isSameDate(day, date);

            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={!bookable}
                aria-pressed={selected}
                aria-label={format(day, 'EEEE d MMMM')}
                onClick={() => onChange(day, null)}
                className={`aspect-square rounded-full text-sm font-bold transition-colors duration-200 ${
                  selected
                    ? 'bg-antique-gold text-near-black'
                    : bookable
                      ? 'text-cream hover:bg-forest-green hover:text-antique-gold'
                      : 'cursor-not-allowed text-cream/20 line-through'
                } ${outside ? 'opacity-40' : ''} ${
                  isToday(day) && !selected ? 'ring-1 ring-antique-gold ring-inset' : ''
                }`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-xs leading-relaxed text-cream/60">
          Closed Sundays. Appointments require at least {CLINIC.leadTimeMinutes / 60} hours’ notice.
        </p>
      </div>

      <div>
        <h3 className="font-serif text-lg font-bold text-cream">
          {date ? `Times on ${format(date, 'EEEE d MMMM')}` : 'Choose a date first'}
        </h3>
        <div className="rule-gold mt-4 max-w-20" />

        {loadingSlots && (
          <p className="mt-6 text-sm text-antique-gold/80 animate-pulse">Checking slot availability...</p>
        )}

        {date && !loadingSlots && slots.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {slots.map((s) => {
              const active = slot === s.value;
              const isTaken = bookedSlots.includes(s.value);
              return (
                <button
                  key={s.value}
                  type="button"
                  disabled={!s.available}
                  aria-pressed={active}
                  onClick={() => onChange(date, s.value)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                    active
                      ? 'border-antique-gold bg-antique-gold text-near-black shadow-md'
                      : s.available
                        ? 'border-sage/30 bg-forest-green/50 text-cream hover:border-antique-gold hover:text-antique-gold'
                        : 'cursor-not-allowed border-sage/15 bg-forest-green/10 text-cream/30 line-through'
                  }`}
                >
                  {s.label} {isTaken ? ' (Booked)' : ''}
                </button>
              );
            })}
          </div>
        )}

        {date && slots.length === 0 && (
          <p className="mt-6 text-sm text-cream/70">The clinic is closed on this day.</p>
        )}

        <p className="mt-8 max-w-md text-xs leading-relaxed text-cream/60">
          Times shown reflect standard clinic hours. We call to confirm every appointment before it is final.
        </p>
      </div>
    </div>
  );
}
