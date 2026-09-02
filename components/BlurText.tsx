'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  onAnimationComplete?: () => void;
  className?: string;
  masked?: boolean;
  maskSrc?: string;
}

/**
 * BlurText component that animates text (words or letters) with blur, opacity, and translate effects.
 * Supports optional masked background texture (MaskedHeading style).
 */
export default function BlurText({
  text,
  delay = 150,
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  className = '',
  masked = false,
  maskSrc = '/assets/hero/hero-image-1.jpg',
}: BlurTextProps) {
  const items = animateBy === 'words' ? text.split(' ') : text.split('');
  const initialY = direction === 'top' ? -28 : 28;

  const maskedStyle: React.CSSProperties = masked
    ? {
        backgroundImage: `url(${maskSrc}), linear-gradient(135deg, #f5cf47 0%, #fdfbf7 50%, #b89635 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }
    : {};

  return (
    <div className={`inline-flex flex-wrap justify-center items-center gap-[0.25em] ${className}`}>
      {items.map((item, index) => (
        <motion.span
          key={index + item}
          initial={{ filter: 'blur(14px)', opacity: 0, y: initialY }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{
            duration: 0.85,
            delay: (index * delay) / 1000,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          onAnimationComplete={() => {
            if (index === items.length - 1 && onAnimationComplete) {
              onAnimationComplete();
            }
          }}
          className={`inline-block font-serif font-black uppercase tracking-[0.1em] ${
            masked ? 'text-transparent bg-clip-text' : ''
          }`}
          style={maskedStyle}
        >
          {item}
          {animateBy === 'words' && index < items.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </div>
  );
}
