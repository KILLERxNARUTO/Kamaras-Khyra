import { Clock } from 'lucide-react';
import type { Treatment } from '@/data/treatments';
import Reveal from './Reveal';

const STAGES = ['before', 'during', 'after'] as const;

const STAGE_LABELS: Record<(typeof STAGES)[number], string> = {
  before: 'Before',
  during: 'During',
  after: 'After',
};

export default function ExpectTimeline({ treatment }: { treatment: Treatment }) {
  const timeline = treatment.timeline;

  return (
    <section className="bg-rich-black py-16 md:py-24 border-t border-sage/15">
      <div className="shell">
        <Reveal className="max-w-xl">
          <p className="text-xs font-bold text-antique-gold uppercase tracking-[0.25em]">What to expect</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-cream">Your appointment, end to end</h2>
          <div className="rule-gold mt-4 max-w-20" />
        </Reveal>

        {timeline ? (
          <>
            <ol className="relative mt-12 grid gap-10 md:grid-cols-3">
              <span
                className="absolute left-0 right-0 top-2.5 hidden h-px bg-gradient-to-r from-antique-gold/50 to-transparent md:block"
                aria-hidden
              />
              {STAGES.map((stage, i) => (
                <Reveal key={stage} delay={i * 0.12} as="li" className="relative">
                  <span className="relative block h-2 w-2 rounded-full bg-antique-gold" />
                  <h3 className="mt-6 font-serif text-xl font-bold text-cream">{STAGE_LABELS[stage]}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/75">
                    {timeline[stage]}
                  </p>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.3} className="mt-10">
              <p className="inline-flex items-center gap-2.5 border-l-2 border-antique-gold bg-forest-green/50 px-5 py-3 text-sm text-cream/85 rounded-r-sm">
                <Clock className="h-4 w-4 shrink-0 text-antique-gold" aria-hidden />
                <span>
                  <strong className="text-antique-gold">Downtime: </strong>
                  {timeline.downtime}
                </span>
              </p>
            </Reveal>
          </>
        ) : (
          <Reveal delay={0.1} className="mt-10">
            <div className="max-w-xl border border-dashed border-sage/30 bg-forest-green/40 p-7 rounded-sm">
              <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-antique-gold font-bold">
                Clinical Overview
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">
                What to expect before, during, and after this treatment is reviewed with you in detail by Dr. Nazreen during your clinical consultation.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
