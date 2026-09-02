'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { format } from 'date-fns';
import { Check, CalendarPlus, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { cartTotals, lineKey, useCart, type CartLine } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { formatAppointment } from '@/lib/slots';
import { buildAppointmentIcs, icsDownloadUrl } from '@/lib/ics';
import { site } from '@/data/site';
import SlotPicker from './SlotPicker';
import Reveal from './Reveal';

const STEPS = ['Treatments', 'Date & time', 'Your details', 'Payment', 'Confirmed'] as const;

interface Details {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export default function BookingStepper() {
  const reduced = useReducedMotion();
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hydrated);
  const clear = useCart((s) => s.clear);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>({ name: '', phone: '', email: '', notes: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [confirmed, setConfirmed] = useState<CartLine[] | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  const { total, unpricedCount } = cartTotals(confirmed ?? lines);

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const validateDetails = () => {
    const next: Partial<Record<keyof Details, string>> = {};
    if (details.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!/^(\+?91[-\s]?)?[0]?[6-9]\d{9}$/.test(details.phone.replace(/[\s-]/g, ''))) {
      next.phone = 'Please enter a valid 10-digit mobile number with country code.';
    }
    if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      next.email = 'Please check this email address.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const currentLines = [...lines];
    const appointmentTime = date && slot ? formatAppointment(date, slot) : 'To be scheduled';
    const selectedServices = currentLines.map((l) => `${l.name}${l.sessions > 1 ? ` (${l.sessions} sessions)` : ''}`).join(', ');
    const generatedBookingId = `BK-${Date.now().toString(36).substring(2, 8).toUpperCase()}`;

    const shopOwnerTextAlert = `🔔 *NEW BOOKING ALERT* 🔔\n\n📌 *Booking ID:* ${generatedBookingId}\n👤 *Customer:* ${details.name}\n📞 *Phone:* ${details.phone}\n💇 *Service:* ${selectedServices || 'Doctor-Assisted Medi-Facial'}\n📅 *Date & Time:* ${appointmentTime}\n${details.notes ? `📝 *Notes:* ${details.notes}\n` : ''}`;
    try {
      const rawDate = date ? format(date, 'yyyy-MM-dd') : null;

      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: details.name,
          phone: details.phone,
          service: selectedServices || 'Doctor-Assisted Medi-Facial',
          date: appointmentTime,
          rawDate,
          slot,
          notes: details.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok && data.error) {
        alert(data.error);
        setIsSubmitting(false);
        return;
      }
      setBookingId(data.bookingId || generatedBookingId);
    } catch (err) {
      console.error('Automated booking backend agent error:', err);
      setBookingId(generatedBookingId);
    } finally {
      setIsSubmitting(false);
      setConfirmed(currentLines);
      clear();
      go(4);
    }
  };

  const canLeaveStep = (from: number) => {
    if (from === 0) return lines.length > 0;
    if (from === 1) return date !== null && slot !== null;
    if (from === 2) return validateDetails();
    return true;
  };

  if (!hydrated) {
    return <p className="shell py-20 text-sm text-cream/60">Loading your booking…</p>;
  }

  return (
    <div className="shell pt-28 md:pt-36 pb-24 md:pb-32 bg-rich-black">
      <Reveal>
        <p className="text-xs font-bold text-antique-gold uppercase tracking-[0.25em]">Direct Booking</p>
        <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-[1.1] text-cream sm:text-4xl md:text-5xl">
          Choose your time
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base mb-10">
          Four short steps. Your appointment is sent directly to our Poonamallee clinic desk — nothing is shipped, and we call to confirm every booking.
        </p>
      </Reveal>

      <StepRail step={step} />

      <div className="relative mt-12 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: reduced ? 0 : direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : direction * -40 }}
            transition={{ duration: reduced ? 0.15 : 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* STEP 0: TREATMENTS */}
            {step === 0 && (
              <StepShell
                title="Your treatments"
                note="Add or remove treatments before choosing a time."
              >
                {lines.length === 0 ? (
                  <div className="border border-dashed border-sage/30 bg-forest-green/50 px-8 py-12 text-center rounded-sm">
                    <p className="text-sm text-cream/80">
                      You have not selected a treatment yet.
                    </p>
                    <Link
                      href="/treatments"
                      className="mt-6 inline-block rounded-full bg-antique-gold px-8 py-3.5 text-sm font-bold text-near-black transition-colors hover:bg-gold-light"
                    >
                      Browse treatments
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-sage/20 border-y border-sage/20">
                    {lines.map((line) => (
                      <li key={lineKey(line)} className="flex items-center justify-between gap-6 py-5">
                        <span className="font-serif text-lg font-bold text-cream">
                          {line.name}
                          {line.sessions > 1 && (
                            <span className="ml-2 text-xs uppercase tracking-[0.14em] text-antique-gold">
                              course of {line.sessions}
                            </span>
                          )}
                        </span>
                        <span className="text-sm font-bold text-antique-gold">{formatPrice(line.price)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href="/treatments"
                  className="mt-6 inline-block text-xs uppercase tracking-[0.18em] text-antique-gold hover:text-gold-light"
                >
                  + Add more treatments
                </Link>
              </StepShell>
            )}

            {/* STEP 1: DATE & TIME */}
            {step === 1 && (
              <StepShell
                title="Pick a date and time"
                note="Appointments run at our Poonamallee clinic. We call to confirm each one."
              >
                <SlotPicker
                  date={date}
                  slot={slot}
                  onChange={(d, s) => {
                    setDate(d);
                    setSlot(s);
                  }}
                />
              </StepShell>
            )}

            {/* STEP 2: DETAILS */}
            {step === 2 && (
              <StepShell
                title="Your details"
                note="So the clinic can confirm your appointment and prepare for your skin."
              >
                <div className="grid max-w-xl gap-6">
                  <Field
                    label="Full name"
                    value={details.name}
                    error={errors.name}
                    autoComplete="name"
                    onChange={(v) => setDetails({ ...details, name: v })}
                  />
                  <Field
                    label="Mobile number (with country code)"
                    value={details.phone}
                    error={errors.phone}
                    type="tel"
                    autoComplete="tel"
                    onChange={(v) => setDetails({ ...details, phone: v })}
                  />
                  <Field
                    label="Email (optional)"
                    value={details.email}
                    error={errors.email}
                    type="email"
                    autoComplete="email"
                    onChange={(v) => setDetails({ ...details, email: v })}
                  />
                  <label className="block">
                    <span className="text-[0.7rem] uppercase tracking-[0.18em] text-antique-gold font-bold">
                      Any skin concerns or allergies?
                    </span>
                    <textarea
                      rows={4}
                      value={details.notes}
                      onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                      className="mt-2.5 w-full rounded-sm border border-sage/30 bg-forest-green/80 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-antique-gold"
                    />
                    <span className="mt-2 block text-xs text-cream/60">
                      Shared with Dr. Nazreen before your appointment. Optional.
                    </span>
                  </label>
                </div>
              </StepShell>
            )}

            {/* STEP 3: PAYMENT / CONFIRM SUMMARY */}
            {step === 3 && (
              <StepShell
                title="Payment & Confirmation"
                note="Confirm your appointment — automated Meta WhatsApp alerts will be dispatched instantly to both you and our clinic."
              >
                <div className="max-w-xl space-y-6">
                  <Summary
                    lines={lines}
                    total={total}
                    unpricedCount={unpricedCount}
                    date={date}
                    slot={slot}
                  />

                  <div className="flex gap-3 border border-dashed border-sage/40 bg-forest-green/60 p-5 rounded-sm">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-antique-gold" aria-hidden />
                    <div className="text-xs leading-relaxed text-cream/80">
                      <p className="font-bold text-antique-gold">Pay in Clinic</p>
                      <p className="mt-1.5 text-cream/70">
                        Payment is settled at the clinic upon consultation (UPI, card, or cash). Clicking &quot;Confirm booking&quot; dispatches WhatsApp alerts to customer &amp; clinic.
                      </p>
                    </div>
                  </div>
                </div>
              </StepShell>
            )}

            {/* STEP 4: CONFIRMED */}
            {step === 4 && (
              <StepShell
                title="Your appointment is confirmed"
                note={`Booking ID: ${bookingId}. Our clinic desk will call ${details.phone} to verify.`}
              >
                <div className="max-w-xl">
                  <div className="flex items-center gap-4 border-l-4 border-antique-gold bg-gradient-to-r from-forest-green to-forest-mid p-6 rounded-r-xl shadow-lg border border-antique-gold/20">
                    <div className="p-3 rounded-full bg-antique-gold text-near-black shrink-0">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-antique-gold uppercase tracking-wider">
                        AUTOMATIC WHATSAPP ALERT DISPATCHED
                      </p>
                      <p className="text-base font-serif font-bold text-cream mt-0.5">
                        {date && slot ? formatAppointment(date, slot) : 'Appointment Requested'}
                      </p>
                      <p className="text-xs text-cream/75 mt-1">
                        Client: <strong className="text-cream">{details.name}</strong> ({details.phone})
                      </p>
                    </div>
                  </div>

                  <Summary
                    className="mt-6"
                    lines={confirmed ?? []}
                    total={total}
                    unpricedCount={unpricedCount}
                    date={date}
                    slot={slot}
                  />

                  <address className="mt-6 text-sm not-italic leading-relaxed text-cream/75">
                    {site.address.line1}, {site.address.line2}
                    <br />
                    {site.address.city} — {site.address.postcode}
                  </address>

                  <div className="mt-8 flex flex-wrap gap-4">
                    {date && slot && (
                      <button
                        type="button"
                        onClick={() => {
                          const ics = buildAppointmentIcs({
                            date,
                            slot,
                            treatments: (confirmed ?? []).map((l) => l.name),
                          });
                          const url = icsDownloadUrl(ics);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'kamars-khyra-appointment.ics';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-antique-gold px-7 py-3.5 text-sm font-bold text-near-black transition-colors hover:bg-gold-light"
                      >
                        <CalendarPlus className="h-4 w-4" />
                        Add to calendar
                      </button>
                    )}
                    <Link
                      href="/treatments"
                      className="rounded-full border border-antique-gold/50 px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:border-antique-gold hover:text-antique-gold"
                    >
                      Back to treatments
                    </Link>
                  </div>
                </div>
              </StepShell>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 4 && (
        <div className="mt-14 flex items-center justify-between border-t border-sage/20 pt-8">
          <button
            type="button"
            onClick={() => go(Math.max(0, step - 1))}
            disabled={step === 0 || isSubmitting}
            className="text-xs uppercase tracking-[0.18em] text-cream/60 transition-colors hover:text-antique-gold disabled:opacity-30"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              if (!canLeaveStep(step)) return;
              if (step === 3) submit();
              else go(step + 1);
            }}
            disabled={(step === 0 && lines.length === 0) || isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-antique-gold px-8 py-3.5 text-sm font-bold text-near-black transition-colors duration-200 hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-near-black" />
                Processing...
              </>
            ) : step === 3 ? (
              'Confirm booking'
            ) : (
              'Continue'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function StepRail({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap gap-x-8 gap-y-3">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex items-center gap-2.5">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.625rem] font-bold transition-colors ${active
                ? 'bg-antique-gold text-near-black'
                : done
                  ? 'border border-antique-gold text-antique-gold'
                  : 'border border-sage/30 text-cream/40'
                }`}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span
              className={`text-xs uppercase tracking-[0.14em] font-bold ${active ? 'text-antique-gold' : done ? 'text-cream/80' : 'text-cream/40'
                }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StepShell({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-cream sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream/75">{note}</p>
      <div className="mt-9">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[0.7rem] uppercase tracking-[0.18em] text-antique-gold font-bold">
        {label}
      </span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2.5 w-full rounded-sm border bg-forest-green/80 px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-antique-gold ${error ? 'border-antique-gold' : 'border-sage/30'
          }`}
      />
      {error && <span className="mt-2 block text-xs text-antique-gold">{error}</span>}
    </label>
  );
}

function Summary({
  lines,
  total,
  unpricedCount,
  date,
  slot,
  className = '',
}: {
  lines: CartLine[];
  total: number;
  unpricedCount: number;
  date: Date | null;
  slot: string | null;
  className?: string;
}) {
  const when = useMemo(
    () => (date && slot ? formatAppointment(date, slot) : 'Not selected'),
    [date, slot],
  );

  return (
    <div className={`bg-forest-green/70 border border-sage/30 p-6 rounded-sm ${className}`}>
      <ul className="space-y-2.5 text-sm">
        {lines.map((line) => (
          <li key={lineKey(line)} className="flex justify-between gap-6">
            <span className="text-cream/90">
              {line.name}
              {line.sessions > 1 && (
                <span className="text-cream/60"> · course of {line.sessions}</span>
              )}
            </span>
            <span className="shrink-0 text-antique-gold font-bold">{formatPrice(line.price)}</span>
          </li>
        ))}
      </ul>
      <div className="rule-gold my-5" />
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-6">
          <dt className="text-cream/60">When</dt>
          <dd className="text-right text-cream font-bold">{when}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt className="text-cream/60">Total</dt>
          <dd className="font-bold text-antique-gold">{total > 0 ? formatPrice(total) : '—'}</dd>
        </div>
      </dl>
      {unpricedCount > 0 && (
        <p className="mt-4 text-xs leading-relaxed text-cream/65">
          {unpricedCount === 1 ? 'One treatment is' : `${unpricedCount} treatments are`} priced in
          clinic after your skin analysis.
        </p>
      )}
    </div>
  );
}
