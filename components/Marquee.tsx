'use client';

import { useReducedMotion } from 'framer-motion';
import { marqueeClaims } from '@/data/method';

/**
 * Rolling band of clinic claims. The track is duplicated so the loop is seamless; the
 * copy is aria-hidden so screen readers hear the list once, not twice.
 *
 * Under prefers-reduced-motion it stops moving and becomes a plain wrapped list —
 * a continuously animating band is exactly what that setting exists to stop.
 */
export default function Marquee() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <section className="border-y border-antique-gold/25 bg-forest-green py-5">
        <ul className="shell flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {marqueeClaims.map((claim) => (
            <li key={claim} className="text-xs uppercase tracking-[0.2em] text-cream/85">
              {claim}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      className="overflow-hidden border-y border-antique-gold/25 bg-forest-green py-5"
      aria-label="What the clinic stands for"
    >
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10 hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center gap-10" aria-hidden={copy === 1}>
            {marqueeClaims.map((claim) => (
              <li
                key={claim}
                className="flex items-center gap-10 whitespace-nowrap text-xs uppercase tracking-[0.2em] text-cream/85"
              >
                {claim}
                <span className="h-1 w-1 rounded-full bg-antique-gold" aria-hidden />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
