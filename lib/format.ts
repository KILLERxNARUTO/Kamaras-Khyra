const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Prices are only ever rendered through here. A null price means the client has not
 * supplied one yet — it must never fall back to a made-up number.
 */
export function formatPrice(price: number | null): string {
  return price === null ? 'Price on request' : inr.format(price);
}

export function formatDuration(minutes: number | null): string | null {
  if (minutes === null) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}
