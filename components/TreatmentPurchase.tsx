'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatDuration, formatPrice } from '@/lib/format';
import { site } from '@/data/site';
import type { Treatment } from '@/data/treatments';

/**
 * Service booking panel for individual clinical treatments.
 * Completely service-oriented: direct appointment scheduling or doctor inquiry on WhatsApp.
 */
export default function TreatmentPurchase({ treatment }: { treatment: Treatment }) {
  const router = useRouter();
  const add = useCart((s) => s.add);

  const [sessions, setSessions] = useState(1);
  const courses = treatment.courses ?? [];
  const selectedCourse = courses.find((c) => c.sessions === sessions) ?? null;
  const price = selectedCourse ? selectedCourse.price : treatment.price;

  const duration = formatDuration(treatment.durationMinutes);

  const handleBook = () => {
    add({
      slug: treatment.slug,
      name: treatment.name,
      price,
      sessions,
    });
    router.push('/booking');
  };

  const whatsappText = encodeURIComponent(
    `Hello Dr. Nazreen, I would like to inquire about booking the ${treatment.name} (${sessions > 1 ? `course of ${sessions}` : 'single session'}) at your Poonamallee clinic.`,
  );
  const whatsappHref = `https://wa.me/${site.phoneHref.replace(/\D/g, '')}?text=${whatsappText}`;

  return (
    <div>
      <p className="font-serif text-3xl font-bold text-antique-gold">{formatPrice(price)}</p>
      {duration && <p className="mt-2 text-sm text-cream/70">{duration} in clinic</p>}

      {courses.length > 0 ? (
        <div className="mt-7">
          <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-cream/60 font-bold">
            Select Protocol
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <CourseOption
              active={sessions === 1}
              onClick={() => setSessions(1)}
              label="Single Session"
              price={formatPrice(treatment.price)}
            />
            {courses.map((course) => (
              <CourseOption
                key={course.sessions}
                active={sessions === course.sessions}
                onClick={() => setSessions(course.sessions)}
                label={`Course of ${course.sessions}`}
                price={formatPrice(course.price)}
                note={course.note}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-6 text-xs leading-relaxed text-cream/60">
          Multi-session treatment protocols are customized in clinic after your skin analysis.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleBook}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-antique-gold px-8 py-3.5 text-sm font-bold text-near-black transition-colors duration-200 hover:bg-gold-light"
        >
          <CalendarDays className="h-4 w-4" />
          Book This Service
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-sage/30 bg-forest-green/60 px-8 py-3.5 text-sm font-bold text-cream transition-colors duration-200 hover:border-antique-gold hover:text-antique-gold"
        >
          <MessageCircle className="h-4 w-4" />
          Inquire on WhatsApp
        </a>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-cream/60">
        100% Doctor-assisted clinical medi-facial at Poonamallee, Chennai. Date and time selected in the next step.
      </p>
    </div>
  );
}

function CourseOption({
  active,
  onClick,
  label,
  price,
  note,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  price: string;
  note?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-sm border px-4 py-3 text-left transition-colors duration-200 ${
        active
          ? 'border-antique-gold bg-forest-green text-cream font-bold'
          : 'border-sage/30 text-cream/70 hover:border-cream/50'
      }`}
    >
      <span className="block text-sm">{label}</span>
      <span className={`mt-1 block text-xs ${active ? 'text-antique-gold' : 'text-cream/80'}`}>
        {price}
      </span>
      {note && (
        <span className={`mt-1 block text-[0.6875rem] ${active ? 'text-cream/70' : 'text-cream/50'}`}>
          {note}
        </span>
      )}
    </button>
  );
}
