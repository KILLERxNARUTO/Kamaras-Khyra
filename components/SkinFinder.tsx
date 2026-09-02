'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { treatments, type Concern } from '@/data/treatments';
import TreatmentCard from './TreatmentCard';
import Reveal from './Reveal';

/**
 * Skin finder — a short questionnaire that narrows the menu to a starting point.
 *
 * It is a filter over the concern tags, NOT a diagnosis: the result is framed as a
 * suggestion the doctor confirms in clinic, and the copy says so on the results screen.
 * Because concern tags are still inferred from treatment names, the fallback when
 * nothing matches is the full menu rather than a confident wrong answer.
 */

interface Question {
  id: string;
  prompt: string;
  options: { label: string; concerns: Concern[] }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'concern',
    prompt: 'What is your skin asking for right now?',
    options: [
      { label: 'Deep hydro-cleansing & facial resurfacing', concerns: ['Signature Medi-Facials'] },
      { label: 'Advanced resurfacing, Dermaplanning & glass skin', concerns: ['Advanced Medi-Treatments'] },
    ],
  },
  {
    id: 'barrier',
    prompt: 'How does your skin react to new products?',
    options: [
      { label: 'Easily — it stings or flushes', concerns: ['Signature Medi-Facials'] },
      { label: 'Occasionally, if I overdo it', concerns: ['Advanced Medi-Treatments'] },
      { label: 'Rarely — it tolerates most things', concerns: [] },
    ],
  },
  {
    id: 'occasion',
    prompt: 'Is this for an occasion, or ongoing care?',
    options: [
      { label: 'An event in the next few weeks', concerns: ['Signature Medi-Facials', 'Advanced Medi-Treatments'] },
      { label: 'Ongoing clinical skincare routine', concerns: ['Signature Medi-Facials'] },
    ],
  },
];

export default function SkinFinder() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Concern[]>([]);

  const done = step >= QUESTIONS.length;

  const answer = (concerns: Concern[]) => {
    setPicked((prev) => [...prev, ...concerns]);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setPicked([]);
    setStep(0);
  };

  // Rank by how many of the chosen concerns a treatment covers.
  const ranked = treatments
    .map((t) => ({ treatment: t, score: t.concerns.filter((c) => picked.includes(c)).length }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.treatment);

  return (
    <section className="bg-forest-green py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="text-[0.6875rem] uppercase tracking-[0.22em] text-antique-gold">
            Skin finder
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-cream sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            Three questions, and we will point you at a sensible first treatment. Your doctor
            confirms the actual protocol after a skin analysis in clinic.
          </p>
        </Reveal>

        <div className="mt-12">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: reduced ? 0 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduced ? 0 : -30 }}
                transition={{ duration: reduced ? 0.15 : 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-cream/45">
                  Question {step + 1} of {QUESTIONS.length}
                </p>
                <h3 className="mt-4 max-w-xl font-serif text-2xl text-cream sm:text-3xl">
                  {QUESTIONS[step].prompt}
                </h3>

                <div className="mt-9 flex flex-wrap gap-3">
                  {QUESTIONS[step].options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => answer(option.concerns)}
                      className="rounded-full border border-cream/30 px-6 py-3.5 text-sm text-cream transition-colors duration-200 hover:border-antique-gold hover:bg-antique-gold hover:text-near-black"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="mt-10 flex gap-1.5">
                  {QUESTIONS.map((q, i) => (
                    <span
                      key={q.id}
                      className={`h-0.5 w-10 rounded-full transition-colors duration-300 ${
                        i <= step ? 'bg-antique-gold' : 'bg-cream/20'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0.15 : 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-antique-gold">
                      A place to start
                    </p>
                    <h3 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">
                      {ranked.length > 0
                        ? 'Worth talking to us about'
                        : 'Let’s look at the full menu'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cream/60 transition-colors hover:text-cream"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Start again
                  </button>
                </div>

                {ranked.length > 0 ? (
                  /* Cards sit on their own cream ground — treatment photography never
                     goes directly onto the forest-green band. */
                  <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {ranked.map((treatment) => (
                      <TreatmentCard key={treatment.slug} treatment={treatment} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 max-w-lg text-sm leading-relaxed text-cream/70">
                    Nothing in the menu is tagged for that combination yet. The whole treatment
                    list is a good place to look, and a call will get you further faster.
                  </p>
                )}

                <p className="mt-9 max-w-xl text-xs leading-relaxed text-cream/50">
                  This is a starting point, not a diagnosis. Your treatment is decided in clinic
                  after a doctor-assisted skin analysis.
                </p>

                <Link
                  href="/treatments"
                  className="mt-7 inline-block rounded-full bg-antique-gold px-8 py-3.5 text-sm font-medium text-near-black transition-colors hover:bg-cream hover:text-near-black"
                >
                  See all treatments
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
