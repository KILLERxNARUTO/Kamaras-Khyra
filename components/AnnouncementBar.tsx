'use client';

import { X } from 'lucide-react';
import { site } from '@/data/site';
import { useSessionFlag } from '@/lib/useScrollPast';

/**
 * Thin band above the nav. Dismissed for the rest of the browsing session, not forever —
 * a promo the visitor never sees again is worse than one they can close.
 *
 * TODO: the clinic has not supplied an announcement (offer, seasonal note, holiday
 * hours). The line below is drawn from the brief's own contact details until they do.
 */
export default function AnnouncementBar() {
  const [dismissed, dismiss] = useSessionFlag('kk-announcement-dismissed');

  if (dismissed) return null;

  return (
    <div className="bg-antique-gold text-near-black">
      <div className="shell relative flex items-center justify-center gap-4 py-2">
        <p className="text-center text-xs leading-relaxed">
          Beauty meets expertise — by Dr. Nazreen, Poonamallee ·{' '}
          <a href={`tel:${site.phoneHref}`} className="underline underline-offset-2">
            {site.phone}
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-4 rounded-full p-1 transition-colors hover:bg-near-black/10 sm:right-6"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
