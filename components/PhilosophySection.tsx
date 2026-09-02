'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { philosophy } from '@/data/site';
import PlaceholderMedia from './PlaceholderMedia';
import Reveal from './Reveal';

/**
 * Editorial story block with Kamars Khyra's clinical philosophy.
 */
export default function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section ref={ref} className="relative overflow-hidden bg-rich-black py-20 md:py-28">
      <div className="shell relative grid items-center gap-12 md:grid-cols-2 md:gap-20">

        {/* ── Left: parallax image ───────────────────────── */}
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
          <motion.div
            style={reduced ? undefined : { y }}
            className="absolute -inset-y-[15%] inset-x-0"
          >
            <PlaceholderMedia
              src="/assets/story/philosophy-story.jpg"
              alt="Inside the Kamars Khyra clinic"
              className="h-full w-full"
            />
          </motion.div>
        </div>

        {/* ── Right: copy ───────────────────────────────── */}
        <div className="relative">
          {/* Ghost watermark */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-6 right-0 select-none font-serif text-[14vw] leading-none text-antique-gold/[0.06] md:text-[8vw]"
          >
            Motive
          </span>

          <Reveal>
            <p className="eyebrow text-antique-gold">Our Motive</p>

            <h2 className="mt-4 font-serif text-2xl font-bold leading-tight text-cream sm:text-3xl">
              Where Science, Purity & Personal Care Meet
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-cream/80">
              {philosophy.welcome}
            </p>

            <blockquote className="relative mt-6 border-l-2 border-antique-gold pl-5 font-serif text-lg leading-[1.5] text-antique-gold sm:text-xl">
              {philosophy.quote}
            </blockquote>

            <div className="rule-gold mt-8 max-w-24" />

            <p className="mt-6 text-sm font-bold leading-relaxed text-cream">
              {philosophy.motive}
            </p>

            <ul className="mt-4 space-y-2">
              {philosophy.motivePoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-cream/75">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="mt-8 inline-block text-[0.6875rem] uppercase tracking-[0.18em] text-antique-gold underline decoration-antique-gold decoration-1 underline-offset-8 transition-colors duration-200 hover:text-gold-light"
            >
              Our story
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
