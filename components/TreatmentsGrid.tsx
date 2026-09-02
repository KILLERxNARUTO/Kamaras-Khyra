'use client';

import { useMemo, useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES, treatments, type Concern, type Treatment } from '@/data/treatments';
import TreatmentCard from './TreatmentCard';
import Reveal from './Reveal';

function TreatmentsGridContent({ initialTreatments }: { initialTreatments: Treatment[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const sectionRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<Concern | 'ALL'>('ALL');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (categoryParam) {
      const matched = CATEGORIES.find(
        (c) => c.id.toLowerCase() === categoryParam.toLowerCase() || c.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matched) {
        setSelectedCategory(matched.id as Concern);
      }
    }
  }, [categoryParam]);

  // Combine fallback catalog if initial prop passed empty
  const catalog = useMemo(
    () => (initialTreatments && initialTreatments.length > 0 ? initialTreatments : treatments),
    [initialTreatments],
  );

  const activeCategoryInfo = useMemo(
    () => CATEGORIES.find((c) => c.id === selectedCategory),
    [selectedCategory],
  );

  const visibleTreatments = useMemo(
    () =>
      selectedCategory === 'ALL'
        ? catalog
        : catalog.filter((t) => t.category === selectedCategory || t.concerns.includes(selectedCategory)),
    [catalog, selectedCategory],
  );

  // Category navigation calculation
  const currentIndex = useMemo(
    () => CATEGORIES.findIndex((c) => c.id === selectedCategory),
    [selectedCategory]
  );

  const prevCategory = useMemo(() => {
    if (currentIndex <= 0) return CATEGORIES[CATEGORIES.length - 1];
    return CATEGORIES[currentIndex - 1];
  }, [currentIndex]);

  const nextCategory = useMemo(() => {
    if (currentIndex < 0 || currentIndex >= CATEGORIES.length - 1) return CATEGORIES[0];
    return CATEGORIES[currentIndex + 1];
  }, [currentIndex]);

  const switchCategory = (catId: Concern | 'ALL') => {
    setSelectedCategory(catId);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={sectionRef} className="shell pt-28 md:pt-36 pb-24 md:pb-32 bg-rich-black text-cream">
      {/* Page Header */}
      <Reveal>
        <p className="text-xs font-bold text-antique-gold uppercase tracking-[0.25em]">Clinical Treatment Menu</p>
        <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-[1.1] text-cream sm:text-4xl md:text-5xl">
          Doctor-Assisted Medi-Services
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
          Browse our signature hydrafacials, lash & brow architecture, scalp therapies, and doctor consultations.
        </p>
      </Reveal>

      {/* ACTIVE CATEGORY BANNER */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 p-6 sm:p-8 rounded-2xl border border-antique-gold/30 bg-gradient-to-r from-forest-green to-forest-mid/60 flex flex-wrap items-center justify-between gap-4 shadow-xl"
      >
        <div>
          <div className="flex items-center gap-3 text-antique-gold text-xs font-bold tracking-widest uppercase">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-antique-gold/10 border border-antique-gold/30">
              {currentIndex >= 0 ? `CATEGORY 0${currentIndex + 1}` : 'ALL SERVICES'}
            </span>
            <span>{selectedCategory === 'ALL' ? 'All Clinical Categories' : activeCategoryInfo?.name}</span>
          </div>
          <h2 className="mt-3 font-serif text-2xl font-bold text-cream sm:text-3xl">
            {selectedCategory === 'ALL'
              ? 'Complete Clinical Catalogue'
              : activeCategoryInfo?.subtitle}
          </h2>
          {activeCategoryInfo?.description && (
            <p className="mt-2 text-sm text-cream/75 max-w-2xl">
              {activeCategoryInfo.description}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-3xl font-serif font-bold text-antique-gold">
            {visibleTreatments.length}
          </span>
          <span className="block text-xs text-cream/60 uppercase tracking-wider mt-1">
            Procedures Listed
          </span>
        </div>
      </motion.div>

      {/* TREATMENTS CARDS GRID */}
      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {visibleTreatments.map((treatment) => (
            <motion.div
              key={treatment.slug}
              layout={!reduced}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: reduced ? 0.15 : 0.35, ease: 'easeOut' }}
            >
              <TreatmentCard treatment={treatment} showImage={true} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visibleTreatments.length === 0 && (
        <p className="mt-16 text-center text-sm text-cream/60">
          No services listed under this category yet.
        </p>
      )}

      {/* CATEGORY PAGINATION AT END OF PAGE */}
      <div className="mt-16 sm:mt-20 pt-8 border-t border-sage/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Previous Category Button */}
        <button
          type="button"
          onClick={() => switchCategory(prevCategory.id as Concern)}
          className="w-full sm:w-auto group inline-flex items-center justify-between sm:justify-start gap-4 px-6 py-4 rounded-xl border border-sage/20 bg-forest-mid/30 text-cream hover:border-antique-gold hover:bg-forest-mid/70 transition-all duration-300 shadow-md hover:shadow-antique-gold/10"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full border border-sage/30 bg-rich-black/40 text-antique-gold group-hover:-translate-x-1 transition-transform">
              <ChevronLeft className="w-4 h-4" />
            </span>
            <div className="text-left">
              <span className="block text-[0.65rem] font-mono text-cream/50 uppercase tracking-wider">
                Previous Category
              </span>
              <span className="font-serif text-base font-bold text-cream group-hover:text-antique-gold transition-colors">
                {prevCategory.name}
              </span>
            </div>
          </div>
        </button>

        {/* View All Option / Indicator */}
        {selectedCategory !== 'ALL' && (
          <button
            type="button"
            onClick={() => switchCategory('ALL')}
            className="text-xs font-mono font-bold tracking-widest text-cream/60 hover:text-antique-gold uppercase transition-colors px-4 py-2"
          >
            View All ({catalog.length}) →
          </button>
        )}

        {/* Next Category Button */}
        <button
          type="button"
          onClick={() => switchCategory(nextCategory.id as Concern)}
          className="w-full sm:w-auto group inline-flex items-center justify-between sm:justify-end gap-4 px-6 py-4 rounded-xl border border-sage/20 bg-forest-mid/30 text-cream hover:border-antique-gold hover:bg-forest-mid/70 transition-all duration-300 shadow-md hover:shadow-antique-gold/10"
        >
          <div className="flex items-center gap-3 text-right">
            <div className="text-right">
              <span className="block text-[0.65rem] font-mono text-cream/50 uppercase tracking-wider">
                Next Category
              </span>
              <span className="font-serif text-base font-bold text-cream group-hover:text-antique-gold transition-colors">
                {nextCategory.name}
              </span>
            </div>
            <span className="p-2 rounded-full border border-sage/30 bg-rich-black/40 text-antique-gold group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function TreatmentsGrid({ treatments: initialTreatments }: { treatments: Treatment[] }) {
  return (
    <Suspense fallback={<div className="shell py-36 text-center text-cream">Loading treatments menu...</div>}>
      <TreatmentsGridContent initialTreatments={initialTreatments} />
    </Suspense>
  );
}
