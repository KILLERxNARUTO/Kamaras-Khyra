import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { treatmentAssets, type Treatment } from '@/data/treatments';
import { formatDuration, formatPrice } from '@/lib/format';
import PlaceholderMedia from './PlaceholderMedia';
import QuickAddButton from './QuickAddButton';

/**
 * Shared by the homepage carousel, the /treatments grid, the skin finder and the
 * "pairs well with" rail.
 *
 * Hover: card lifts (1.03 + shadow), image zooms to 1.08 over 400ms, quick-add fades in.
 */
export default function TreatmentCard({
  treatment,
  showImage = true,
}: {
  treatment: Treatment;
  showImage?: boolean;
}) {
  const duration = formatDuration(treatment.durationMinutes);

  return (
    <div className="group relative h-full">
      {/* Book Service button — always visible on touch, hover on desktop */}
      <QuickAddButton treatment={treatment} />

      <Link
        href={`/treatments/${treatment.slug}`}
        className="block h-full overflow-hidden rounded-sm bg-forest-green transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_18px_45px_-20px_rgba(184,150,62,0.25)] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 flex flex-col justify-between"
      >
        {showImage && (
          <PlaceholderMedia
            src={treatmentAssets.card(treatment.slug)}
            alt={treatment.name}
            className="aspect-[4/5] w-full"
            imgClassName="transition-transform duration-400 ease-out group-hover:scale-[1.08] motion-reduce:group-hover:scale-100"
          />
        )}

        <div className="p-6">
          <h3 className="font-serif text-xl leading-snug text-cream">{treatment.name}</h3>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="font-medium text-antique-gold">{formatPrice(treatment.price)}</span>
            {duration && (
              <>
                <span className="h-3 w-px bg-sage/30" aria-hidden />
                <span className="text-cream/50">{duration}</span>
              </>
            )}
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.18em] text-antique-gold">
            Explore
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </div>
  );
}
