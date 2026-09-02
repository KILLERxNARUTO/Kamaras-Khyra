'use client';

import { useRouter } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import { lineKey, useCart } from '@/lib/cart';
import type { Treatment } from '@/data/treatments';

/**
 * Service booking button for treatment cards.
 * Redirects directly to booking page for the selected clinical service.
 */
export default function QuickAddButton({ treatment }: { treatment: Treatment }) {
  const router = useRouter();
  const add = useCart((s) => s.add);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add({
          slug: treatment.slug,
          name: treatment.name,
          price: treatment.price,
          sessions: 1,
        });
        router.push('/booking');
      }}
      aria-label={`Book ${treatment.name}`}
      className="absolute right-3.5 top-3.5 z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-lg backdrop-blur-md transition-all duration-300 focus-visible:opacity-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-antique-gold text-near-black hover:bg-gold-light hover:scale-105 shadow-[0_4px_16px_rgba(245,207,71,0.35)]"
    >
      <CalendarDays className="h-3.5 w-3.5 stroke-[2.5]" />
      Book Service
    </button>
  );
}
