'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * True once the page has scrolled past `threshold` pixels.
 *
 * Read through useSyncExternalStore rather than mirrored into state from an effect:
 * the scroll position is an external store, the snapshot is a boolean, and components
 * only re-render when the boolean flips rather than on every scroll frame.
 */
export function useScrollPast(threshold: number): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange, { passive: true });
    return () => {
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}

/**
 * A one-per-session flag backed by sessionStorage — used by the intro reveal and the
 * announcement bar so neither reappears on every route change.
 */
export function useSessionFlag(key: string): [boolean, () => void] {
  const subscribe = useCallback(
    (onChange: () => void) => {
      window.addEventListener(`sessionflag:${key}`, onChange);
      return () => window.removeEventListener(`sessionflag:${key}`, onChange);
    },
    [key],
  );

  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.sessionStorage.getItem(key) === '1';
      } catch {
        // Private-mode / blocked storage: treat as unset rather than throwing.
        return false;
      }
    },
    () => false,
  );

  const set = useCallback(() => {
    try {
      window.sessionStorage.setItem(key, '1');
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(`sessionflag:${key}`));
  }, [key]);

  return [value, set];
}
