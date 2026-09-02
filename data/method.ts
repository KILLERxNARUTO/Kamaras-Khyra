/**
 * Copy for the homepage method sequence and session walkthrough.
 * Content sourced from the Kamars Khyra portfolio.pdf client deck.
 */

/** Sticky-scroll panels: the image pins while these step through it. */
export const methodPanels = [
  {
    id: 'analysis',
    eyebrow: 'Step one',
    title: 'We read your skin before we touch it',
    body: 'Every treatment is individually designed after a detailed skin analysis by trained professionals and assisted by Dr. Nazreen when required. What your skin needs today may differ from what it needed last month.',
    image: '/assets/treatments/Aqua 360 hydra facial explaination.jpeg',
  },
  {
    id: 'formulation',
    eyebrow: 'Step two',
    title: '100% Vegan & Ethical Formulations',
    body: 'Every product and tool is chosen with 100% vegan and ethical skincare principles throughout. No animal-derived actives, no exceptions — comfort, privacy and trust at every step.',
    image: '/assets/treatments/Barrier Restore HydraFacial.jpeg',
  },
  {
    id: 'results',
    eyebrow: 'Step three',
    title: 'Visible yet natural results',
    body: 'We focus on long-term skin health, not aggressive or shortcut procedures. Science-backed and visible results — built without compromising values.',
    image: '/assets/treatments/Radiance glow HydraFacial.jpeg',
  },
] as const;

/** Numbered walkthrough of a visit. */
export const sessionSteps = [
  {
    numeral: '01',
    title: 'Arrive',
    body: 'Come with clean skin if you can. Bring anything you are currently using on your face.',
  },
  {
    numeral: '02',
    title: 'Skin Analysis',
    body: 'A detailed skin analysis by trained professionals, assisted by Dr. Nazreen when required — reading your current barrier condition and what your skin needs today.',
  },
  {
    numeral: '03',
    title: 'Your Treatment',
    body: 'The protocol is set from that analysis, personalised to your skin type, concern and condition on the day.',
  },
  {
    numeral: '04',
    title: 'Aftercare',
    body: 'You leave knowing what to use, what to avoid, and when to come back.',
  },
] as const;

/** Rolling band above the philosophy section. All claims are from the brief. */
export const marqueeClaims = [
  'Doctor-Assisted',
  '100% Vegan',
  'Ethically Formulated',
  'Science-Backed',
  'Personalised After Skin Analysis',
  'Beauty Meets Expertise',
  'By Dr. Nazreen',
  'Poonamallee, Chennai',
] as const;
