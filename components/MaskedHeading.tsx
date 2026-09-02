'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface MaskedHeadingProps {
  text: string;
  src?: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  fillScale?: number;
  parallax?: number;
  reveal?: 'wipe' | 'fade' | 'zoom';
  trigger?: 'view' | 'mount' | 'auto';
  className?: string;
}

/**
 * MaskedHeading renders high-impact text with an embedded image/video fill.
 * Includes a rich metallic gold gradient fallback ensuring 100% visibility.
 */
export default function MaskedHeading({
  text,
  src = '/assets/hero/hero-image-1.jpg',
  mediaType = 'image',
  poster,
  fillScale = 1.2,
  reveal = 'wipe',
  className = '',
}: MaskedHeadingProps) {
  const isVideo = mediaType === 'video';
  const bgImage = src || '/assets/hero/hero-image-1.jpg';

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <motion.div
        initial={
          reveal === 'wipe'
            ? { opacity: 0, y: 15 }
            : reveal === 'zoom'
              ? { opacity: 0, scale: 0.9 }
              : { opacity: 0 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative flex items-center justify-center text-center"
      >
        {isVideo && src ? (
          <div className="relative w-full text-center">
            <video
              src={src}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              style={{ transform: `scale(${fillScale})` }}
            />
            <h1
              className="font-serif font-black uppercase tracking-[0.1em] leading-none relative z-10 text-transparent bg-clip-text"
              style={{
                backgroundImage: `url(${poster || bgImage}), linear-gradient(135deg, #f5cf47 0%, #fdfbf7 50%, #b89635 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              {text}
            </h1>
          </div>
        ) : (
          <h1
            className="font-serif font-black uppercase tracking-[0.1em] leading-none relative z-10 text-transparent bg-clip-text"
            style={{
              backgroundImage: `url(${bgImage}), linear-gradient(135deg, #f5cf47 0%, #fdfbf7 50%, #b89635 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            {text}
          </h1>
        )}
      </motion.div>
    </div>
  );
}
