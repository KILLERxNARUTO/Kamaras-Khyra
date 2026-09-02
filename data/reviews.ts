/**
 * Client reviews for Kamars Khyra — In Their Words.
 */

export interface Review {
  author: string;
  rating: number;
  body: string;
  date: string;
  treatment: string | null;
}

export const reviews: Review[] = [
  {
    author: 'Priya R.',
    rating: 5,
    body: 'Dr. Nazreen takes time to analyze your skin before starting any treatment. My skin felt deeply hydrated and glowing after the Aqua 360 facial. Absolutely loved the 100% vegan formulations!',
    date: '2026-01-15',
    treatment: 'aqua-360-medi-hydra-facial',
  },
  {
    author: 'Kavitha S.',
    rating: 5,
    body: 'I had severe acne congestion and barrier damage. The Acne-Treat Medi-Hydra facial calmed my skin significantly after just one session. Professional, ethical, and trustworthy care.',
    date: '2026-01-28',
    treatment: 'acne-treat-medi-hydra-facial',
  },
  {
    author: 'Anitha M.',
    rating: 5,
    body: 'The Korean Glass Skin treatment left my face radiant, dewy, and smooth without any irritation. Dr. Nazreen’s personalized protocol is top-notch!',
    date: '2026-02-04',
    treatment: 'hydra-lux-korean-glass-therapy',
  },
  {
    author: 'Deepika K.',
    rating: 5,
    body: 'The Zero Blemish treatment helped lighten acne marks and even out my skin tone beautifully. Knowing every product is 100% vegan makes it even better.',
    date: '2026-02-10',
    treatment: 'zero-blemish-medi-hydra-facial',
  },
];

export function reviewSummary(list: Review[] = reviews) {
  if (list.length === 0) return null;
  const total = list.reduce((sum, r) => sum + r.rating, 0);
  return {
    count: list.length,
    average: Math.round((total / list.length) * 10) / 10,
  };
}
