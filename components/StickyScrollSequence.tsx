'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { methodPanels } from '@/data/method';
import PlaceholderMedia from './PlaceholderMedia';

/**
 * The image pins while the copy steps through it.
 *
 * Desktop: a sticky media column tracks scroll progress across the section and swaps
 * images at each panel boundary. Mobile: no pinning at all — each panel simply carries
 * its own image, because a pinned viewport-height frame on a small screen turns three
 * short paragraphs into three screens of scrolling with nothing to read.
 */
export default function StickyScrollSequence() {
  const container = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(methodPanels.length - 1, Math.floor(p * methodPanels.length));
    setActive((current) => (current === next ? current : next));
  });

  return (
    <section ref={container} className="relative bg-near-black">
      <div className="shell md:grid md:grid-cols-2 md:gap-16">
        {/* Pinned media — desktop only. */}
        <div className="hidden md:block">
          <div className="sticky top-28 h-[calc(100svh-9rem)] py-10">
            <div className="relative h-full w-full overflow-hidden rounded-sm">
              <AnimatePresence initial={false}>
                <motion.div
                  key={methodPanels[active].id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <PlaceholderMedia
                    src={methodPanels[active].image}
                    alt={methodPanels[active].title}
                    className="h-full w-full"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-5 left-5 flex gap-1.5">
                {methodPanels.map((panel, i) => (
                  <span
                    key={panel.id}
                    className={`h-0.5 rounded-full transition-all duration-500 ${
                      i === active ? 'w-8 bg-antique-gold' : 'w-4 bg-off-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          {methodPanels.map((panel, i) => (
            <div
              key={panel.id}
              className="flex min-h-[70svh] flex-col justify-center py-16 md:min-h-[100svh] md:py-24"
            >
              <PlaceholderMedia
                src={panel.image}
                alt={panel.title}
                className="mb-8 aspect-[4/3] w-full rounded-sm md:hidden"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <p className="eyebrow">{panel.eyebrow}</p>
                <h2 className="mt-5 max-w-md font-serif text-3xl leading-tight text-cream sm:text-4xl">
                  {panel.title}
                </h2>
                <div className="rule-gold mt-7 max-w-20" />
                <p className="mt-7 max-w-md text-sm leading-relaxed text-cream/65">
                  {panel.body}
                </p>
                <p className="mt-8 font-serif text-5xl text-antique-gold/20">0{i + 1}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
