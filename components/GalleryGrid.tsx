'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { beforeAfterPreview } from '@/data/site';
import { getTreatment } from '@/data/treatments';
import BeforeAfterSlider from './BeforeAfterSlider';
import Reveal from './Reveal';

type CategoryFilter = 'All' | 'Skincare' | 'Haircare';

/**
 * Results gallery, filterable by Skincare & Haircare categories.
 */
export default function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  const visible = useMemo(
    () =>
      activeCategory === 'All'
        ? beforeAfterPreview
        : beforeAfterPreview.filter((p) => p.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="shell pt-28 md:pt-36 pb-24 md:pb-32 bg-rich-black">
      <Reveal>
        <p className="text-xs font-bold text-antique-gold uppercase tracking-[0.25em]">Results</p>
        <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-[1.1] text-cream sm:text-4xl md:text-5xl">
          Before, after, and honestly in between
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
          Every image is a Kamars Khyra client, photographed in clinic under the same lighting, and published only with written consent. No retouching, no stock photography.
        </p>
      </Reveal>

      {/* Filter tabs */}
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-sage/20 pb-5">
        {(['All', 'Skincare', 'Haircare'] as CategoryFilter[]).map((cat) => (
          <FilterTab
            key={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'All' ? 'All Results' : `${cat} Results`}
          </FilterTab>
        ))}
      </div>

      {/* Grid of Results */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((pair, i) => {
          const treatment = pair.treatmentSlug ? getTreatment(pair.treatmentSlug) : null;

          return (
            <Reveal key={pair.id} delay={(i % 3) * 0.12}>
              <div className="group overflow-hidden rounded-sm bg-forest-green/80 p-4 border border-sage/20 transition-all duration-300 hover:border-antique-gold/40">
                <BeforeAfterSlider
                  before={pair.before}
                  after={pair.after}
                  label={pair.title}
                  className="aspect-[4/5] w-full rounded-sm"
                />

                <div className="mt-4 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-antique-gold">
                      {pair.category}
                    </span>
                    {treatment && (
                      <Link
                        href={`/treatments/${treatment.slug}`}
                        className="text-[11px] text-cream/60 hover:text-antique-gold transition-colors underline underline-offset-2"
                      >
                        View Treatment ↗
                      </Link>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-cream">{pair.title}</h3>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative pb-2 text-sm font-medium transition-colors duration-250 ${
        active ? 'text-antique-gold font-bold' : 'text-cream/60 hover:text-cream'
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-[1.4rem] left-0 h-0.5 bg-antique-gold transition-all duration-250 ${
          active ? 'w-full' : 'w-0'
        }`}
      />
    </button>
  );
}
