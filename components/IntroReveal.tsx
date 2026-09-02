'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '@/data/site';
import BlurText from './BlurText';

const HOLD_DURATION_MS = 1800;

/**
 * Fullscreen intro loader.
 * Triggers on every page reload to display a luxury blended BlurText + MaskedHeading animation.
 */
export default function IntroReveal() {
  const [leaving, setLeaving] = useState(false);

  const finish = () => {
    setLeaving(true);
  };

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          aria-hidden
          onClick={finish}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-rich-black px-6 cursor-pointer select-none"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center max-w-5xl"
          >
            {/* Blended BlurText + MaskedHeading Loader Title */}
            <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black">
              <BlurText
                text={site.name}
                delay={150}
                animateBy="words"
                direction="top"
                masked={true}
                maskSrc="/assets/hero/hero-image-1.jpg"
                onAnimationComplete={() => {
                  window.setTimeout(finish, HOLD_DURATION_MS);
                }}
              />
            </div>

            {/* Expanding Gold Divider Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              className="mt-6 h-[2px] w-48 sm:w-64 bg-gradient-to-r from-transparent via-antique-gold to-transparent"
            />

            {/* Tagline */}
            <motion.p
              initial={{ filter: 'blur(8px)', opacity: 0, y: 12 }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-5 text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-antique-gold"
            >
              {site.tagline}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
