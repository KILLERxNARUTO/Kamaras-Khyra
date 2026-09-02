/** Clinic details and page copy sourced from client deck. */

export const site = {
  name: 'Kamars Khyra',
  tagline: 'Doctor-Assisted Medi-Facial Services',
  doctor: 'Dr. Nazreen',
  fullName: 'Kamars Khyra Hair, Skin and Brows Wellness Center',
  address: {
    line1: '2/16, Sheesha Nagar',
    line2: 'Poonamallee',
    city: 'Chennai, Tamil Nadu',
    postcode: '600056',
    fullQuery: 'Kamars khyra Hair ,skin and brows wellness center, 2/16, Sheesha Nagar, Poonamallee, Chennai, Tamil Nadu 600056',
  },
  phone: '+91 73050 63062',
  /** tel: href form. */
  phoneHref: '+917305063062',
  email: null as string | null,
  social: {
    instagram: 'https://www.instagram.com/kamarskhyra?igsh=bXg1cDZvZXkzeDN6',
    facebook: null as string | null,
  },
} as const;

export const trustPillars = [
  {
    numeral: '01',
    title: 'Doctor-Assisted Services',
    body: 'Every facial service is individually designed after a detailed clinical skin analysis by trained professionals, assisted directly by Dr. Nazreen.',
    icon: 'doctor',
  },
  {
    numeral: '02',
    title: '100% Vegan & Ethical',
    body: '100% vegan formulations and ethical medical skincare principles. Pure, conscious treatment protocols with privacy and comfort at every step.',
    icon: 'vegan',
  },
  {
    numeral: '03',
    title: 'Clinical Results',
    body: 'Personalised treatment protocols targeting acne, pigmentation, barrier repair, and deep hydration with visible clinical improvements.',
    icon: 'results',
  },
] as const;

export const philosophy = {
  welcome:
    'Welcome to Kamars Khyra, where advanced dermatological science meets pure, conscious skincare. Founded by Dr. Nazreen, our Poonamallee clinic is dedicated exclusively to doctor-assisted medi-facial services.',
  quote:
    'We do not sell over-the-counter retail products. Our focus is 100% on high-performance clinical facial services tailored precisely to your skin.',
  motive: 'Why Choose Our Clinical Medi-Facial Services?',
  motivePoints: [
    'Doctor-assisted skin assessment before every procedure',
    'Customised multi-step clinical medi-facial protocols',
    '100% vegan, cruelty-free, and ethically formulated actives',
    'Private, serene clinic environment in Poonamallee, Chennai',
  ],
  vision:
    'Our vision is to elevate clinical skincare through personalized medi-facial procedures that deliver lasting health, glow, and structural skin barrier recovery.',
  visionBenefits: [
    'Targeted acne, scarring, and hyperpigmentation therapy',
    'Non-invasive, deep-layer hydration and oxygenation',
    'Medically supervised treatments safe for sensitive skin',
  ],
} as const;

export const beforeAfterPreview = [
  {
    id: 'acne-repair-1',
    category: 'Skincare',
    title: 'Acne-Treat Medi Hydra Facial',
    before: '/assets/before-after/acne-before.jpg',
    after: '/assets/before-after/acne-after.jpg',
    treatmentSlug: 'acne-treat-medi-hydra-facial',
  },
  {
    id: 'barrier-repair-1',
    category: 'Skincare',
    title: 'Aqua 360 Medi Hydra Facial',
    before: '/assets/before-after/hydration-before.jpg',
    after: '/assets/before-after/hydration-after.jpg',
    treatmentSlug: 'aqua-360-medi-hydra-facial',
  },
  {
    id: 'radiance-glow-1',
    category: 'Skincare',
    title: 'Radiance Glow Medi Hydra Facial',
    before: '/assets/before-after/radiance-before.jpg',
    after: '/assets/before-after/radiance-after.jpg',
    treatmentSlug: 'radiance-glow-medi-hydra-facial',
  },
  {
    id: 'hair-revive-1',
    category: 'Haircare',
    title: 'Scalp Revive Medi Treatment',
    before: '/assets/before-after/hair-before.jpg',
    after: '/assets/before-after/hair-after.jpg',
    treatmentSlug: 'collagen-boost-medi-hydra-facial',
  },
] as const;
