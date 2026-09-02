'use client';

import { create } from 'zustand';

/**
 * Ephemeral UI state that several unrelated components need to agree on — the cart
 * drawer opened from the nav, from a treatment card's quick-add, and from the floating
 * CTA. Not persisted: none of it should survive a reload.
 */
interface UiState {
  cartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

export const useUi = create<UiState>((set) => ({
  cartDrawerOpen: false,
  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
}));
