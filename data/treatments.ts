/**
 * Treatment catalogue — single source of truth for every treatment page, card and cart line.
 * Organised into 5 core clinical service categories.
 */

export const CONCERNS = [
  'Signature Medi-Facials',
  'Advanced Medi-Treatments',
] as const;

export type Concern = (typeof CONCERNS)[number];

export interface Treatment {
  slug: string;
  name: string;
  category: Concern;
  price: number | null;
  durationMinutes: number | null;
  idealFor: string | null;
  description: string | null;
  benefits: string[];
  howItWorks: string | null;
  concerns: Concern[];
  featured: boolean;

  protocol?: string[];
  aftercare?: string[];
  faq?: { question: string; answer: string }[];
  timeline?: {
    before: string;
    during: string;
    after: string;
    downtime: string;
  };
  courses?: { sessions: number; price: number; note?: string }[];
}

export interface CategoryInfo {
  id: Concern;
  name: string;
  subtitle: string;
  description: string;
  count: number;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'Signature Medi-Facials',
    name: 'Signature Medi-Facials',
    subtitle: 'Deep-cleanse, hydrate and resurface with precision',
    description: 'Advanced multi-step hydro-resurfacing treatments customized to clear, nourish, and revitalize your facial skin barrier.',
    count: 8,
  },
  {
    id: 'Advanced Medi-Treatments',
    name: 'Advanced Medi-Treatments',
    subtitle: 'Targeted clinical resurfacing & glass skin glow',
    description: 'Specialized clinical treatments including Dermaplanning, Skin Barrier Repair, Lip Plumper Care, and Korean Glass Skin Therapy.',
    count: 5,
  },
];

export const treatments: Treatment[] = [
  {
    slug: 'aqua-360-medi-hydra-facial',
    name: 'Aqua 360 Medi Hydra Facial',
    category: 'Signature Medi-Facials',
    price: null,
    durationMinutes: 60,
    idealFor: 'All skin types seeking 360° hydration & resurfacing',
    description: 'Full 360° hydration & resurfacing. A comprehensive skin rejuvenation treatment combining deep cleansing, gentle exfoliation, painless vacuum extraction, hydration and antioxidant infusion.',
    benefits: ['Deep cleanses pores', 'Removes blackheads & whiteheads', 'Improves hydration', 'Smoothens skin texture', 'Brightens complexion', 'Gives an instant glow'],
    howItWorks: 'Uses vortex-fusion technology to dislodge impurities while nourishing skin with intense hydrating serums.',
    concerns: ['Signature Medi-Facials'],
    featured: true,
  },
  {
    slug: 'acne-treat-medi-hydra-facial',
    name: 'Acne-Treat Medi Hydra Facial',
    category: 'Signature Medi-Facials',
    price: null,
    durationMinutes: 75,
    idealFor: 'Acne-prone & oily skin',
    description: 'Targeted clarifying for breakout-prone skin. Deeply cleanses congested pores while reducing excess oil, bacteria, and inflammation without irritating sensitive barrier layers.',
    benefits: ['Controls excess oil', 'Reduces active acne', 'Calms inflammation', 'Clears congested pores', 'Improves skin clarity'],
    howItWorks: 'Infuses antibacterial salicylic actives and soothing botanical serums into deep follicular shafts.',
    concerns: ['Signature Medi-Facials'],
    featured: true,
  },
  {
    slug: 'zero-blemish-medi-hydra-facial',
    name: 'Zero Blemish Medi Hydra Facial',
    category: 'Signature Medi-Facials',
    price: null,
    durationMinutes: 60,
    idealFor: 'Pigmented & uneven skin',
    description: 'Pigment & blemish correction. Targets post-acne marks, hyperpigmentation and uneven skin tone using gentle brightening exfoliation and targeted serum infusion.',
    benefits: ['Reduces dark spots', 'Fades post-acne marks', 'Brightens complexion', 'Evens skin tone', 'Restores natural radiance'],
    howItWorks: 'Combines micro-exfoliation with tyrosinase-inhibiting brightening actives to break down superficial melanin deposits.',
    concerns: ['Signature Medi-Facials'],
    featured: true,
  },
  {
    slug: 'barrier-restore-medi-hydra-facial',
    name: 'Barrier Restore Medi Hydra Facial',
    category: 'Signature Medi-Facials',
    price: null,
    durationMinutes: 60,
    idealFor: 'Sensitive & dehydrated skin',
    description: 'Rebuilds a compromised skin barrier. Designed for sensitive and dehydrated skin, restoring protective lipid balance using soothing ceramides and deeply hydrating serums.',
    benefits: ['Repairs skin barrier', 'Intense moisture lock', 'Soothes redness & tightness', 'Reduces reactivity', 'Strengthens defence'],
    howItWorks: 'Gentle non-stripping hydro-cleansing followed by epidermal barrier lipid restoration.',
    concerns: ['Signature Medi-Facials'],
    featured: true,
  },
  {
    slug: 'radiance-glow-medi-hydra-facial',
    name: 'Radiance Glow Medi Hydra Facial',
    category: 'Signature Medi-Facials',
    price: null,
    durationMinutes: 60,
    idealFor: 'All skin types, pre-event glow',
    description: 'Instant luminosity for events. Boosts skin radiance and eliminates dullness through intense hydration and oxygenation, leaving skin smooth and camera-ready.',
    benefits: ['Instant red-carpet glow', 'Brightens dull tone', 'Plumps fine dehydration lines', 'Smooth makeup base', 'Healthy dewy finish'],
    howItWorks: 'Oxygen-enriched hydra-infusion boosts cellular respiration for instant luminosity.',
    concerns: ['Signature Medi-Facials'],
    featured: true,
  },
  {
    slug: 'glow-dew-medi-hydra-facial',
    name: 'Glow Dew Medi Hydra Facial',
    category: 'Signature Medi-Facials',
    price: null,
    durationMinutes: 60,
    idealFor: 'Dull & tired skin seeking dewy finish',
    description: 'Deep moisture saturation & dewy glow. Infuses skin with bio-active dew ampoules to restore skin vitality, softness, and natural glass-like dewiness.',
    benefits: ['Dewy skin finish', 'Deep moisture infusion', 'Restores skin bounce', 'Smooths dry patches', 'Radiant complexion'],
    howItWorks: 'Infuses hydrating hyaluronate complexes through gentle non-invasive hydro-mist.',
    concerns: ['Signature Medi-Facials'],
    featured: false,
  },
  {
    slug: 'comedone-extraction-medi-hydra-facial',
    name: 'Comedone Extract Medi Hydra Facial',
    category: 'Signature Medi-Facials',
    price: null,
    durationMinutes: 60,
    idealFor: 'Congested & pore-clogged skin',
    description: 'Gentle painless extraction. Safely extracts stubborn blackheads, whiteheads, and sebum plugs using painless hydro-vacuum suction without manual scarring.',
    benefits: ['Painless blackhead removal', 'Clears clogged pores', 'Refines pore texture', 'Controls T-zone shine', 'Leaves skin silky fresh'],
    howItWorks: 'Beta-hydroxy vacuum flushing loosens comedones for effortless, non-invasive extraction.',
    concerns: ['Signature Medi-Facials'],
    featured: false,
  },
  {
    slug: 'collagen-boost-medi-hydra-facial',
    name: 'Collagen Boost Medi Hydra Facial',
    category: 'Signature Medi-Facials',
    price: null,
    durationMinutes: 75,
    idealFor: 'Aging & mature skin',
    description: 'Firming & plumping ritual. Anti-aging facial designed to stimulate natural collagen synthesis, firm loose contours, and soften fine facial lines.',
    benefits: ['Firms facial contours', 'Improves elasticity', 'Softens fine lines', 'Deeply plumps skin', 'Restores youthful bounce'],
    howItWorks: 'Peptide-rich antioxidant infusion combined with micro-current lymphatic activation.',
    concerns: ['Signature Medi-Facials'],
    featured: true,
  },
  {
    slug: 'aqua-glow-therapy',
    name: 'Aqua Glow Therapy',
    category: 'Advanced Medi-Treatments',
    price: null,
    durationMinutes: 60,
    idealFor: 'Dehydrated skin wanting instant luminosity',
    description: 'Intense water-lock therapy. Delivers deep dermal hydration to repair moisture-starved skin cells and leave a polished, crystal-bright glow.',
    benefits: ['Intense water hydration', 'Polished bright glow', 'Calms skin stress', 'Smooth makeup base', 'Long-lasting moisture'],
    howItWorks: 'Deep aqua-infusion layering with restorative antioxidant botanical masks.',
    concerns: ['Advanced Medi-Treatments'],
    featured: true,
  },
  {
    slug: 'dermaplaning',
    name: 'Dermaplanning',
    category: 'Advanced Medi-Treatments',
    price: null,
    durationMinutes: 45,
    idealFor: 'Textured skin with fine vellus peach-fuzz',
    description: 'Smooth resurfacing & peach-fuzz removal. Uses a specialized surgical blade to gently lift off dead epidermal cells and fine facial peach-fuzz.',
    benefits: ['Instantly smooth texture', 'Removes vellus hair', 'Flawless makeup application', 'Enhances skincare absorption', 'Brightens dull tone'],
    howItWorks: 'Controlled manual exfoliation removing outermost stratum corneum layers.',
    concerns: ['Advanced Medi-Treatments'],
    featured: true,
  },
  {
    slug: 'skin-barrier-therapy',
    name: 'Skin Barrier Therapy',
    category: 'Advanced Medi-Treatments',
    price: null,
    durationMinutes: 60,
    idealFor: 'Sensitive, reactive & damaged skin barrier',
    description: 'Clinical barrier strengthening & repair. Intensive soothing therapy formulating lipid-identical ceramides to heal redness, irritation, and sensitivity.',
    benefits: ['Repairs damaged barrier', 'Relieves skin stinging', 'Strengthens defence', 'Deeply hydrates', 'Restores skin comfort'],
    howItWorks: 'Lipid-replenishing ceramide ultrasound infusion to seal intercellular matrices.',
    concerns: ['Advanced Medi-Treatments'],
    featured: true,
  },
  {
    slug: 'hydra-lux-korean-glass-therapy',
    name: 'Hydra Lux-Korean Glass Therapy',
    category: 'Advanced Medi-Treatments',
    price: null,
    durationMinutes: 90,
    idealFor: 'Ultimate luxury glass-skin finish',
    description: 'The premier Korean glass-skin ritual. Combines hydro-resurfacing, active oxygenation, LED light therapy, and Korean glass skin nourishment.',
    benefits: ['Full glass-skin reflection', 'Deep cell nourishment', 'Long-lasting hydration', 'Refined pore texture', 'Ultra-luminous finish'],
    howItWorks: 'Multi-layer clinical synergy combining vortex extraction, peptide infusion, and Korean glass hydration serums.',
    concerns: ['Advanced Medi-Treatments'],
    featured: true,
  },
  {
    slug: 'lip-plumper-treatment',
    name: 'Lip Plumper Treatment',
    category: 'Advanced Medi-Treatments',
    price: null,
    durationMinutes: 30,
    idealFor: 'Dry, chapped, or fine-lined lips',
    description: 'Hydrating lip rejuvenation. Gently exfoliates dry lip flakes, infuses hyaluronic moisture, and restores natural rosy fullness and smoothness.',
    benefits: ['Smooths dry lip flakes', 'Deeply hydrates lips', 'Restores natural rosy tone', 'Softens lip lines', 'Plump healthy feel'],
    howItWorks: 'Gentle sugar hydro-polish followed by peptide lip hydration infusion.',
    concerns: ['Advanced Medi-Treatments'],
    featured: false,
  },
];

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}

export const featuredTreatments = treatments.filter((t) => t.featured);

export function relatedTreatments(slug: string, limit = 3): Treatment[] {
  const current = getTreatment(slug);
  if (!current) return [];

  const shared = treatments.filter(
    (t) => t.slug !== slug && t.category === current.category,
  );
  const filler = treatments.filter(
    (t) => t.slug !== slug && !shared.some((s) => s.slug === t.slug) && t.featured,
  );

  return [...shared, ...filler].slice(0, limit);
}

/**
 * Asset paths for each treatment.
 * 
 * PLACEHOLDER GUIDE FOR CUSTOM IMAGES:
 * To add your own custom images for any treatment, simply place your high-res photos
 * in public/assets/treatments/ with the naming convention:
 * `treatment-[slug].jpg` (e.g. treatment-aqua-360-medi-hydra-facial.jpg)
 */
const HERO_MOCKS: Record<string, string> = {
  'aqua-360-medi-hydra-facial':             '/assets/treatments/Aqua 360 hydra facial explaination.jpeg',
  'acne-treat-medi-hydra-facial':           '/assets/treatments/what-is-a-hydrafacial-722x406.webp',
  'zero-blemish-medi-hydra-facial':         '/assets/treatments/blemish.jpg',
  'barrier-restore-medi-hydra-facial':      '/assets/treatments/hydrafacial-for-skin-barrier-repair.webp',
  'radiance-glow-medi-hydra-facial':        '/assets/treatments/Radiance glow HydraFacial explaination.jpeg',
  'glow-dew-medi-hydra-facial':             '/assets/treatments/glow dew.jpg',
  'comedone-extraction-medi-hydra-facial':  '/assets/treatments/Comedone Extract Hydrafacial single.jpg',
  'collagen-boost-medi-hydra-facial':       '/assets/treatments/Collagen.jpg',
  'aqua-glow-therapy':                      '/assets/treatments/aqua.jpg',
  'dermaplaning':                           '/assets/treatments/Dermaplanning explaination.jpeg',
  'skin-barrier-therapy':                   '/assets/treatments/skin barrier.jpg',
  'hydra-lux-korean-glass-therapy':         '/assets/treatments/korean-glass-skin-hydra-facial1.jpeg',
  'lip-plumper-treatment':                  '/assets/treatments/memo-dr-dennis-gross-lip-plump-hero-16x9.webp',
};

export const treatmentAssets = {
  card: (slug: string) => HERO_MOCKS[slug] ?? `/assets/treatments/treatment-${slug}.jpg`,
  hero: (slug: string) => HERO_MOCKS[slug] ?? `/assets/hero/hero-image-1.jpg`,
  resultsBefore: (slug: string) => `/assets/before-after/before-after-1-before.jpg`,
  resultsAfter:  (slug: string) => `/assets/before-after/before-after-1-after.jpg`,
  results: (slug: string) => `/assets/before-after/before-after-1-after.jpg`,
};

