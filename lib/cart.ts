'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cart state. Treatments behave like products up to checkout, but nothing ships —
 * a line item is one appointment to be scheduled in /booking. There are deliberately
 * no shipping, address or tracking fields anywhere in this store.
 */

export interface CartLine {
  slug: string;
  name: string;
  /** Total for the line (a course is priced as a whole, not per session). */
  price: number | null;
  /** 1 for a single appointment, >1 when booked as a course. */
  sessions: number;
}

/** A treatment can sit in the cart once per course length, so identity includes it. */
export function lineKey(line: Pick<CartLine, 'slug' | 'sessions'>): string {
  return `${line.slug}#${line.sessions}`;
}

interface CartState {
  lines: CartLine[];
  /** False until localStorage has been read, so SSR and first client render match. */
  hydrated: boolean;
  setHydrated: () => void;
  add: (line: CartLine) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      // Adding the same treatment at the same course length twice is a no-op —
      // appointments are not a quantity.
      add: (line) =>
        set((state) =>
          state.lines.some((l) => lineKey(l) === lineKey(line))
            ? state
            : { lines: [...state.lines, line] },
        ),
      remove: (key) => set((state) => ({ lines: state.lines.filter((l) => lineKey(l) !== key) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: 'kk-cart',
      version: 1,
      // v0 lines predate course booking and are all single appointments.
      migrate: (persisted, version) => {
        const state = persisted as { lines?: Partial<CartLine>[] };
        if (version === 0 && state?.lines) {
          state.lines = state.lines.map((l) => ({ ...l, sessions: l.sessions ?? 1 }));
        }
        return state as unknown as CartState;
      },
      partialize: (state) => ({ lines: state.lines }) as CartState,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

/** Total of the lines that have a price; unpriced lines are surfaced separately in the UI. */
export function cartTotals(lines: CartLine[]) {
  let total = 0;
  let unpricedCount = 0;
  for (const line of lines) {
    if (line.price === null) unpricedCount += 1;
    else total += line.price;
  }
  return { total, unpricedCount };
}
