'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Route transition. A template (not a layout) remounts on every navigation, which is
 * what makes the enter animation replay.
 *
 * Enter-only: an exit animation would hold the old page on screen while the new one is
 * already interactive, and App Router gives no reliable hook to wait for it. Kept short
 * so navigation never feels gated behind an effect.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.12 : 0.45, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
