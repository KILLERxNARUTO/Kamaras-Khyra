'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';

/**
 * Every photographic slot on the site goes through here.
 *
 * If the real asset exists it is shown. If not, a mock photo from the available
 * before-after image pool is shown instead of an empty panel — so the UI always
 * looks fully composed. Real client photography can be dropped into /public/assets
 * with matching filenames and it will automatically take over.
 */

// Pool of real available assets to use as mocks when a target src is missing.
const MOCK_POOL = [
  '/assets/before-after/before-after-1-after.jpg',
  '/assets/before-after/before-after-2-after.jpg',
  '/assets/before-after/before-after-3-after.jpg',
  '/assets/before-after/before-after-4-after.jpg',
  '/assets/before-after/before-after-5-after.jpg',
  '/assets/before-after/before-after-6-after.jpg',
  '/assets/before-after/before-after-7-after.jpg',
  '/assets/before-after/before-after-8-after.jpg',
  '/assets/hero/hero-image-1.jpg',
  '/assets/hero/hero-image-2.jpg',
  '/assets/hero/hero-image-3.jpg',
  '/assets/story/philosophy-story.jpg',
  '/assets/story/clinic-interior.jpg',
];

/** Deterministically pick a mock image from the pool based on the src path so the same
 *  slot always shows the same mock (no layout jitter between renders). */
function pickMock(src: string): string {
  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    hash = (hash * 31 + src.charCodeAt(i)) >>> 0;
  }
  return MOCK_POOL[hash % MOCK_POOL.length];
}

export default function PlaceholderMedia({
  src,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
}: {
  src: string;
  alt: string;
  /** @deprecated - label is no longer shown; kept for API compatibility */
  label?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const [activeSrc, setActiveSrc] = useState(src);
  const [usedMock, setUsedMock] = useState(false);

  const handleError = () => {
    if (!usedMock) {
      setUsedMock(true);
      setActiveSrc(pickMock(src));
    }
  };

  return (
    <div className={`relative overflow-hidden bg-forest-green/20 ${className}`}>
      <img
        src={activeSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={handleError}
        className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
