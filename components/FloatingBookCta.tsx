'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { useScrollPast } from '@/lib/useScrollPast';

/**
 * Persistent "Book" affordance that fades in once the nav CTA is well out of mind.
 *
 * Desktop only, deliberately: on mobile the treatment pages already own the bottom of
 * the screen with their own sticky add-to-cart bar, and two competing fixed CTAs is one
 * too many. Hidden on the pages where booking is already the whole point.
 */
const HIDDEN_ON = ['/booking', '/cart'];

export default function FloatingBookCta() {
  const pathname = usePathname();
  const scrolled = useScrollPast(700);
  const reduced = useReducedMotion();

  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));
  const show = scrolled && !hidden;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.96 }}
          transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed bottom-8 right-8 z-40 hidden md:block"
        >
          <MagneticButton
            href="/booking"
            className="inline-flex items-center gap-2.5 rounded-full bg-forest-green px-7 py-4 text-sm text-cream shadow-[0_14px_40px_-16px_rgba(20,20,15,0.7)] transition-colors duration-200 hover:bg-antique-gold hover:text-near-black"
          >
            <CalendarDays className="h-4 w-4" />
            Book an appointment
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
