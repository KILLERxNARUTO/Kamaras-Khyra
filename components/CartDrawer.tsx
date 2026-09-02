'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarClock, X } from 'lucide-react';
import { cartTotals, lineKey, useCart } from '@/lib/cart';
import { useUi } from '@/lib/ui-store';
import { formatPrice } from '@/lib/format';

/**
 * Slide-out cart, opened from the nav, a card's quick-add, or the floating CTA.
 * The /cart page still exists for anyone who lands there directly — the drawer is the
 * fast path, not a replacement.
 *
 * Like every other cart surface: no shipping, no address, no delivery estimate.
 */
export default function CartDrawer() {
  const open = useUi((s) => s.cartDrawerOpen);
  const close = useUi((s) => s.closeCartDrawer);
  const lines = useCart((s) => s.lines);
  const remove = useCart((s) => s.remove);
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const { total, unpricedCount } = cartTotals(lines);

  // Escape closes; the page behind must not scroll while the drawer is over it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    panel.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-near-black/40 backdrop-blur-[2px]"
          />

          <motion.div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Your selection"
            initial={{ x: reduced ? 0 : '100%', opacity: reduced ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduced ? 0 : '100%', opacity: reduced ? 0 : 1 }}
            transition={{ duration: reduced ? 0.15 : 0.42, ease: [0.22, 0.61, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-cream shadow-[-20px_0_60px_-30px_rgba(20,20,15,0.5)] outline-none"
          >
            <div className="flex items-center justify-between border-b border-sage/25 px-6 py-5">
              <h2 className="font-serif text-xl text-forest-green">Your selection</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close cart"
                className="rounded-full p-2 text-near-black/50 transition-colors hover:bg-off-white hover:text-forest-green"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                <p className="text-sm text-near-black/65">Nothing selected yet.</p>
                <Link
                  href="/treatments"
                  onClick={close}
                  className="rounded-full bg-antique-gold px-7 py-3 text-sm font-medium text-near-black transition-colors hover:bg-near-black hover:text-antique-gold"
                >
                  Browse treatments
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-sage/20 overflow-y-auto px-6">
                  {lines.map((line) => (
                    <li key={lineKey(line)} className="flex items-start justify-between gap-4 py-5">
                      <div className="min-w-0">
                        <Link
                          href={`/treatments/${line.slug}`}
                          onClick={close}
                          className="font-serif text-base text-forest-green underline-offset-4 hover:underline"
                        >
                          {line.name}
                        </Link>
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-near-black/55">
                          <CalendarClock className="h-3 w-3 text-sage" aria-hidden />
                          {line.sessions > 1
                            ? `Course of ${line.sessions} · times set at booking`
                            : 'Time set at booking'}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm text-gold-deep">{formatPrice(line.price)}</span>
                        <button
                          type="button"
                          onClick={() => remove(lineKey(line))}
                          aria-label={`Remove ${line.name}`}
                          className="rounded-full p-1 text-near-black/35 transition-colors hover:text-forest-green"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-sage/25 px-6 py-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-near-black/65">Subtotal</span>
                    <span className="font-medium text-gold-deep">
                      {total > 0 ? formatPrice(total) : '—'}
                    </span>
                  </div>
                  {unpricedCount > 0 && (
                    <p className="mt-3 text-xs leading-relaxed text-near-black/55">
                      {unpricedCount === 1 ? 'One treatment is' : `${unpricedCount} treatments are`}{' '}
                      priced in clinic after your skin analysis.
                    </p>
                  )}
                  <Link
                    href="/booking"
                    onClick={close}
                    className="mt-5 block rounded-full bg-antique-gold px-8 py-3.5 text-center text-sm font-medium text-near-black transition-colors hover:bg-near-black hover:text-antique-gold"
                  >
                    Proceed to booking
                  </Link>
                  <Link
                    href="/cart"
                    onClick={close}
                    className="mt-3 block text-center text-xs uppercase tracking-[0.18em] text-near-black/50 transition-colors hover:text-forest-green"
                  >
                    View full cart
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
