import { sessionSteps } from '@/data/method';
import Reveal from './Reveal';

/**
 * "Your session, step by step" — a numbered walkthrough of a visit, joined by a thin
 * gold rule on desktop. Copy lives in data/method.ts and still needs the clinic's
 * confirmation on the arrival/aftercare specifics.
 */
export default function SessionSteps() {
  return (
    <section className="bg-near-black py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Your session</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-cream sm:text-4xl">
            What actually happens when you come in
          </h2>
        </Reveal>

        <ol className="relative mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Connecting rule, desktop only — decorative. */}
          <span
            className="absolute left-0 right-0 top-3 hidden h-px bg-gradient-to-r from-antique-gold/50 via-antique-gold/30 to-transparent lg:block"
            aria-hidden
          />

          {sessionSteps.map((step, i) => (
            <Reveal key={step.numeral} delay={i * 0.12} as="li" className="relative">
              <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-antique-gold text-[0.625rem] font-semibold text-near-black">
                {i + 1}
              </span>
              <h3 className="mt-6 font-serif text-xl text-cream">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
