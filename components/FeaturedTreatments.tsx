'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { treatments as allTreatments, type Treatment } from '@/data/treatments';
import Reveal from './Reveal';
import FlowingMenu, { type MenuItemData } from './FlowingMenu';

export default function FeaturedTreatments({ treatments: initialTreatments }: { treatments?: Treatment[] }) {
  const router = useRouter();

  const catalog = useMemo(
    () => (initialTreatments && initialTreatments.length > 0 ? initialTreatments : allTreatments),
    [initialTreatments],
  );

  const flowingMenuItems: MenuItemData[] = useMemo(
    () => [
      {
        id: 'ALL',
        text: 'All Services',
        subtitle: 'Explore our complete clinical catalog of procedures',
        count: catalog.length,
        link: '/treatments',
        image: '/assets/treatments/Aqua 360 hydra facial explaination.jpeg',
      },
      {
        id: 'Signature Medi-Facials',
        text: 'Signature Medi-Facials',
        subtitle: 'Deep-cleanse, hydrate and resurface with precision',
        count: allTreatments.filter((t) => t.category === 'Signature Medi-Facials').length,
        link: `/treatments?category=${encodeURIComponent('Signature Medi-Facials')}`,
        image: '/assets/treatments/Collagen.jpg',
      },
      {
        id: 'Advanced Medi-Treatments',
        text: 'Advanced Medi-Treatments',
        subtitle: 'Targeted clinical resurfacing & glass skin glow',
        count: allTreatments.filter((t) => t.category === 'Advanced Medi-Treatments').length,
        link: `/treatments?category=${encodeURIComponent('Advanced Medi-Treatments')}`,
        image: '/assets/treatments/glow dew.jpg',
      },
    ],
    [catalog],
  );

  const handleCategorySelect = (id: string) => {
    if (id === 'ALL') {
      router.push('/treatments');
    } else {
      router.push(`/treatments?category=${encodeURIComponent(id)}`);
    }
  };

  return (
    <section className="bg-forest-green py-20 md:py-28 text-cream">
      <div className="shell">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Our Clinical Menu</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
              Doctor-assisted medi-services tailored for you
            </h2>
          </div>
          <div>
            <Link
              href="/treatments"
              className="text-[0.6875rem] uppercase tracking-[0.18em] text-cream/70 underline decoration-antique-gold decoration-1 underline-offset-8 hover:text-antique-gold transition-colors"
            >
              View full treatments catalog →
            </Link>
          </div>
        </Reveal>

        {/* FLOWING MENU WITH NAVIGATION ON CLICK */}
        <Reveal delay={0.05} className="mt-10">
          <FlowingMenu
            items={flowingMenuItems}
            speed={15}
            marqueeBgColor="#f5cf47"
            marqueeTextColor="#0b1510"
            onSelect={handleCategorySelect}
          />
        </Reveal>
      </div>
    </section>
  );
}
