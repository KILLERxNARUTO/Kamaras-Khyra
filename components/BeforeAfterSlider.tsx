'use client';

import { useCallback, useRef, useState } from 'react';
import PlaceholderMedia from './PlaceholderMedia';

/**
 * Draggable before/after reveal component.
 *
 * Prominent bright gold BEFORE / AFTER badges on dark glass backgrounds for max legibility.
 */
export default function BeforeAfterSlider({
  before,
  after,
  label,
  className = '',
}: {
  before: string;
  after: string;
  label: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <div
      ref={frame}
      className={`relative select-none overflow-hidden bg-rich-black border border-sage/20 ${className}`}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) setFromClientX(e.clientX);
      }}
    >
      <PlaceholderMedia src={after} alt={`${label} — after`} className="absolute inset-0 h-full w-full" />

      <div
        className="absolute inset-0 h-full w-full"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden
      >
        <PlaceholderMedia src={before} alt={`${label} — before`} className="absolute inset-0 h-full w-full" />
      </div>

      {/* BEFORE / AFTER Labels — Text only */}
      <span className="pointer-events-none absolute left-4 top-4 z-20 font-sans text-xs font-extrabold uppercase tracking-[0.25em] text-antique-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
        BEFORE
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-20 font-sans text-xs font-extrabold uppercase tracking-[0.25em] text-antique-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
        AFTER
      </span>

      {/* Divider */}
      <div
        className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-antique-gold shadow-[0_0_10px_rgba(245,207,71,0.5)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-antique-gold bg-[#060e0a] shadow-[0_0_18px_rgba(245,207,71,0.45)]">
          <svg viewBox="0 0 16 16" className="h-4 w-4 text-antique-gold" aria-hidden>
            <path d="M6 3 2 8l4 5M10 3l4 5-4 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`${label}: reveal before and after`}
        className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
