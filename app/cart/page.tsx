'use client';

import Link from 'next/link';
import { CalendarClock, X } from 'lucide-react';
import { cartTotals, lineKey, useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import PageHeader from '@/components/PageHeader';

/**
 * Cart. Deliberately has no shipping, address, delivery-estimate or tracking UI —
 * a line is an appointment to be scheduled, and the only way forward is /booking.
 */
export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const remove = useCart((s) => s.remove);
  const hydrated = useCart((s) => s.hydrated);
  const { total, unpricedCount } = cartTotals(lines);

  return (
    <>
      <PageHeader
        eyebrow="Your selection"
        title="Ready when you are"
        intro="Treatments are held here until you pick a date and time. Nothing is shipped — every booking is an appointment at our Poonamallee clinic."
      />

      <div className="shell pb-24 md:pb-32">
        {!hydrated ? (
          <p className="text-sm text-near-black/50">Loading your selection…</p>
        ) : lines.length === 0 ? (
          <div className="border border-dashed border-sage/40 bg-off-white px-8 py-16 text-center">
            <p className="font-serif text-2xl text-forest-green">Your cart is empty</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-near-black/70">
              Browse the treatment menu and add the ones you would like to book.
            </p>
            <Link
              href="/treatments"
              className="mt-8 inline-block rounded-full bg-antique-gold px-8 py-3.5 text-sm font-medium text-near-black transition-colors duration-200 hover:bg-near-black hover:text-antique-gold"
            >
              View treatments
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
            <ul className="divide-y divide-sage/20 border-y border-sage/20">
              {lines.map((line) => (
                <li key={lineKey(line)} className="flex items-start justify-between gap-6 py-6">
                  <div className="min-w-0">
                    <Link
                      href={`/treatments/${line.slug}`}
                      className="font-serif text-xl text-forest-green underline-offset-4 hover:underline"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-2 flex items-center gap-2 text-xs text-near-black/55">
                      <CalendarClock className="h-3.5 w-3.5 text-sage" aria-hidden />
                      {line.sessions > 1
                        ? `Course of ${line.sessions} · dates set at booking`
                        : 'Date & time selected at booking'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-5">
                    <span className="text-sm font-medium text-gold-deep">
                      {formatPrice(line.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(lineKey(line))}
                      aria-label={`Remove ${line.name}`}
                      className="rounded-full p-1.5 text-near-black/40 transition-colors hover:bg-cream hover:text-forest-green"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit bg-off-white p-8">
              <h2 className="font-serif text-xl">Summary</h2>
              <div className="rule-gold mt-5" />

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-near-black/65">Treatments</dt>
                  <dd>{lines.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-near-black/65">Subtotal</dt>
                  <dd className="font-medium text-gold-deep">
                    {total > 0 ? formatPrice(total) : '—'}
                  </dd>
                </div>
              </dl>

              {unpricedCount > 0 && (
                <p className="mt-5 border-l-2 border-antique-gold bg-cream/60 px-4 py-3 text-xs leading-relaxed text-near-black/70">
                  {unpricedCount === lines.length
                    ? 'Pricing for these treatments is confirmed in clinic after your skin analysis.'
                    : `${unpricedCount} treatment${unpricedCount === 1 ? '' : 's'} in your cart ${
                        unpricedCount === 1 ? 'is' : 'are'
                      } priced in clinic after your skin analysis.`}
                </p>
              )}

              <Link
                href="/booking"
                className="mt-8 block rounded-full bg-antique-gold px-8 py-3.5 text-center text-sm font-medium text-near-black transition-colors duration-200 hover:bg-near-black hover:text-antique-gold"
              >
                Proceed to booking
              </Link>
              <Link
                href="/treatments"
                className="mt-4 block text-center text-xs uppercase tracking-[0.18em] text-near-black/55 transition-colors hover:text-forest-green"
              >
                Add another treatment
              </Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
