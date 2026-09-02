'use client';

import Link from 'next/link';
import { useCallback, useRef, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * A CTA that leans toward the cursor and springs back on leave.
 *
 * The pull is driven by motion values, not state, so tracking the pointer costs no
 * React renders. It is switched off entirely for coarse pointers (there is no hover on
 * touch, and the transform would fight the tap) and under prefers-reduced-motion.
 */

/** Strength of the lean, in px at the element's edge. */
const PULL = 7;

function useCoarsePointer(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia('(pointer: coarse)');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia('(pointer: coarse)').matches,
    () => true, // assume touch on the server: no transform in the first paint
  );
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  ariaLabel,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const disabled = reduced || coarse;

  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    // -1..1 from the centre, scaled to PULL.
    x.set(((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * PULL);
    y.set(((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * PULL);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const motionProps = {
    style: disabled ? undefined : { x: springX, y: springY },
    onPointerMove: onMove,
    onPointerLeave: reset,
    onBlur: reset,
    className,
    'aria-label': ariaLabel,
  };

  if (href) {
    return (
      <motion.span {...motionProps} ref={ref as React.Ref<HTMLSpanElement>} className="inline-block">
        <Link href={href} className={className} aria-label={ariaLabel}>
          {children}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      {...motionProps}
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
