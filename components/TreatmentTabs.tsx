'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Minus, Plus } from 'lucide-react';
import type { Treatment } from '@/data/treatments';
import { site } from '@/data/site';

type TabId = 'benefits' | 'protocol' | 'aftercare' | 'faq';

const TABS: { id: TabId; label: string }[] = [
  { id: 'benefits', label: 'Benefits' },
  { id: 'protocol', label: 'Protocol' },
  { id: 'aftercare', label: 'Aftercare' },
  { id: 'faq', label: 'FAQ' },
];

export default function TreatmentTabs({ treatment }: { treatment: Treatment }) {
  const [active, setActive] = useState<TabId>('benefits');
  const reduced = useReducedMotion();

  return (
    <div>
      <div
        role="tablist"
        aria-label="Treatment detail"
        className="flex flex-wrap gap-x-8 gap-y-3 border-b border-sage/20"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={`relative pb-4 text-sm font-bold transition-colors duration-250 ${
              active === tab.id ? 'text-antique-gold' : 'text-cream/60 hover:text-cream'
            }`}
          >
            {tab.label}
            {active === tab.id && (
              <motion.span
                layoutId="treatment-tab-underline"
                className="absolute -bottom-px left-0 right-0 h-0.5 bg-antique-gold"
                transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-9 min-h-56">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            id={`panel-${active}`}
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -6 }}
            transition={{ duration: reduced ? 0.12 : 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {active === 'benefits' &&
              (treatment.benefits.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {treatment.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-sm leading-relaxed text-cream/85 bg-forest-green/40 p-4 border border-sage/15 rounded-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-antique-gold" aria-hidden />
                      {benefit}
                    </li>
                  ))}
                </ul>
              ) : (
                <Pending what="Benefits" />
              ))}

            {active === 'protocol' &&
              (treatment.protocol?.length ? (
                <ol className="space-y-4">
                  {treatment.protocol.map((step, i) => (
                    <li key={step} className="flex gap-4 text-sm leading-relaxed text-cream/85 bg-forest-green/40 p-4 border border-sage/15 rounded-sm">
                      <span className="font-serif text-lg font-bold text-antique-gold">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              ) : (
                <Pending what="The step-by-step clinical protocol" />
              ))}

            {active === 'aftercare' &&
              (treatment.aftercare?.length ? (
                <ul className="space-y-4">
                  {treatment.aftercare.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-cream/85 bg-forest-green/40 p-4 border border-sage/15 rounded-sm">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <Pending what="Aftercare guidance" clinical />
              ))}

            {active === 'faq' &&
              (treatment.faq?.length ? (
                <dl className="divide-y divide-sage/20 border-y border-sage/20">
                  {treatment.faq.map((item) => (
                    <FaqRow key={item.question} question={item.question} answer={item.answer} />
                  ))}
                </dl>
              ) : (
                <Pending what="Frequently asked questions" />
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div>
      <dt>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-6 py-5 text-left"
        >
          <span className="font-serif text-lg font-bold text-cream">{question}</span>
          {open ? (
            <Minus className="h-4 w-4 shrink-0 text-antique-gold" aria-hidden />
          ) : (
            <Plus className="h-4 w-4 shrink-0 text-antique-gold" aria-hidden />
          )}
        </button>
      </dt>
      <AnimatePresence initial={false}>
        {open && (
          <motion.dd
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-cream/75">{answer}</p>
          </motion.dd>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pending({ what, clinical = false }: { what: string; clinical?: boolean }) {
  return (
    <div className="border border-dashed border-sage/30 bg-forest-green/40 p-7 rounded-sm">
      <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-antique-gold font-bold">Clinical Information</p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/75">
        {what} for this treatment {clinical ? 'is explained directly during your skin consultation' : 'is being finalized'}. To speak directly with the clinic, reach us on{' '}
        <a href={`tel:${site.phoneHref}`} className="text-antique-gold font-bold underline underline-offset-4 hover:text-gold-light">
          {site.phone}
        </a>
        .
      </p>
    </div>
  );
}
