# Kamars Khyra — Website Build Brief for Claude Code

## Project Summary
Build an original, editorial-style e-commerce website for **Kamars Khyra**, a doctor-assisted, vegan/ethical medi-facial clinic in Chennai. Treatments are sold like products (price, "Add to Cart," checkout) but nothing ships — checkout ends in an appointment booking (date/time slot + clinic address) instead of shipping.

Design direction: warm, elegant, editorial skincare-brand feel — clean typography, generous whitespace, subtle scroll animations, video/photo-led storytelling. Think high-end beauty e-commerce, NOT a clinical/sterile medical site.

---

## Tech Stack
- **Framework:** Next.js (React) + Tailwind CSS
- **Animations:** Framer Motion for scroll reveals, hover states, and page transitions
- **Carousel/slider:** Embla Carousel or Swiper.js
- **Cart/checkout state:** React Context or Zustand (client-side cart state; checkout ends in a booking form, not payment/shipping — see Checkout section)
- **Booking calendar:** react-day-picker or a simple custom slot-picker component
- **Deploy target:** Vercel-ready structure

---

## Color Palette
```
--color-cream:        #F8F5EF   /* primary background */
--color-forest-green: #1F3A2E   /* nav, footer, section dividers, headings */
--color-sage:         #6B8F71   /* secondary green accent, hover states */
--color-antique-gold: #B8963E   /* CTAs, price tags, dividers, icons */
--color-near-black:   #14140F   /* headline text, borders */
--color-off-white:    #FFFDF9   /* cards, alternate section bg */
```
Rules:
- Keep all before/after and skin photography on **cream/off-white backgrounds only** — never place skin photos on black or dark green, it distorts perceived skin tone.
- Gold is an accent only — used for CTA buttons, price text, thin dividers, and icons. Never as a large fill.
- Forest green carries the nav bar, footer, and section-break bands.
- Body text in near-black at 85% opacity for readability against cream.

Typography: pair an elegant serif (e.g., "Fraunces" or "Cormorant") for headings with a clean sans-serif (e.g., "Inter" or "Manrope") for body/UI text.

---

## Site Structure & Pages

### 1. Homepage (`/`)
**Hero section**
- Full-bleed rotating hero (3 slides) — video-first with static image fallback
- Each slide: `[PLACEHOLDER: hero-video-1.mp4 / hero-image-1.jpg]`, treatment name overlay, short benefit line, "Book Now" CTA
- Smooth crossfade transition between slides, auto-advance every 6s, manual arrows/dots
- Sticky nav appears with a background-blur/solid-fill effect on scroll (transparent over hero, solid forest-green once scrolled)

**Trust Pillars section** (3-column, numbered)
1. **Doctor-Assisted** — every treatment personalized after skin analysis
2. **100% Vegan & Ethical** — no compromise on values
3. **Science-Backed, Visible Results** — no aggressive shortcuts
- Each pillar: large numeral (01/02/03) in gold, icon `[PLACEHOLDER: icon-doctor.svg / icon-vegan.svg / icon-science.svg]`, heading, 2-line description
- Scroll-triggered fade-up animation, staggered by 150ms per column

**Featured Treatments carousel**
- Horizontal scroll/carousel, 3 visible at a time on desktop, 1 on mobile
- Each card: `[PLACEHOLDER: treatment-{slug}.jpg]`, treatment name, price, duration, "Explore" link
- Card hover: subtle scale (1.03) + shadow lift, image slight zoom (scale 1.08 on hover, 400ms ease)

**Philosophy / Modest-Care Story section**
- Full-width editorial section — large image or video on one side `[PLACEHOLDER: philosophy-story.jpg]`, story copy on the other
- Copy pulled from deck: "Our motive is to build strong, healthy skin using safe, ethical, science-backed skincare — without compromising values."
- Parallax-style subtle image movement on scroll (image moves slower than scroll speed, ~0.3x)

**Before & After gallery preview**
- Grid of 4-6 before/after slider or side-by-side pairs `[PLACEHOLDER: before-after-1.jpg ... before-after-6.jpg]`
- Note: use only licensed or client-consented photography — do not use scraped/stock before-after images
- Link to full gallery page

**Footer**
- Forest-green background, cream text
- Columns: Contact (address, phone — from deck: No.2/16, Sesha Nagar, Poonamallee, Chennai-600056 / +91-7305063062), Quick Links (Treatments, About, Book Now), Legal (Cancellation Policy, Terms, Privacy)
- Social icons `[PLACEHOLDER: social-instagram.svg / social-facebook.svg]`

---

### 2. Treatments Listing (`/treatments`)
- Filterable grid by concern: Acne, Pigmentation, Anti-Ageing, Hydration, Barrier Repair, Signature/Premium
- Same card component as homepage carousel
- Filter tabs use gold underline for active state, smooth 250ms transition

### 3. Treatment Detail (`/treatments/[slug]`)
Each of these 13 treatments needs its own page (content already extracted from client deck — use as-is, do not alter medical claims):
1. Aqua 360 Medi Hydra Facial
2. Acne-Treat Medi Hydra Facial
3. Zero Blemish Medi Hydra Facial
4. Barrier Restore Medi Hydra Facial
5. Radiance Glow Medi Hydra Facial
6. Glow Dew Medi Hydra Facial
7. Comedone Extraction Medi Hydra Facial
8. Collagen Boost Medi Hydra Facial
9. Aqua Glow Therapy
10. Dermaplaning
11. Skin Barrier Therapy
12. Hydra Lux — Korean Glass Therapy
13. Lip Plumper Treatment

Page layout per treatment:
- Hero image `[PLACEHOLDER: treatment-{slug}-hero.jpg]`
- Name, price, duration, "ideal for" tag
- Benefits list (bulleted, gold check-icon markers)
- "How it works" section where deck provides medical/mechanism detail
- Before/after strip specific to that treatment `[PLACEHOLDER: treatment-{slug}-results.jpg]`
- Sticky "Add to Cart / Book This Treatment" button (becomes fixed to bottom on mobile scroll)

### 4. Cart (`/cart`)
- Line items: treatment name, date placeholder ("select at checkout"), price
- No shipping fields anywhere in this flow
- "Proceed to Booking" CTA instead of "Proceed to Checkout"

### 5. Checkout / Booking Flow (`/booking`)
Multi-step, animated step-transition (slide left/right between steps):
1. **Selected treatments summary**
2. **Date & time slot picker** — calendar component, unavailable slots greyed out
3. **Client details** — name, phone, email, and a short intake note field ("any skin concerns or allergies?")
4. **Payment** — deposit or full prepayment via payment gateway `[PLACEHOLDER: integrate Razorpay or Stripe — confirm with client which gateway]`
5. **Confirmation screen** — booking summary + calendar-add button (no tracking number/shipping info)

### 6. About (`/about`)
- Our Motive, Our Vision — content directly from deck
- Team/doctor bios `[PLACEHOLDER: team-photo-1.jpg ...]`

### 7. Before & After Gallery (`/gallery`)
- Full grid, filterable by treatment type
- Before/after slider component (drag handle to reveal) — use licensed images only

### 8. Contact (`/contact`)
- Address, phone, embedded map `[PLACEHOLDER: Google Maps embed for Poonamallee, Chennai location]`
- Simple contact form

---

## Animation & Interaction Notes (build these, don't copy from any reference site)
- Nav: transparent-over-hero → solid forest-green on scroll (transition 300ms)
- Section entrances: fade-up + 20px translate, triggered at 20% viewport visibility, staggered for grouped elements
- Image hover states: 1.05-1.08x scale zoom, 400ms ease-out
- Buttons: gold fill with near-black text; hover inverts to near-black fill with gold text, 200ms transition
- Carousel: momentum-based drag on mobile, arrow/dot controls on desktop
- Before/after slider: draggable divider, smooth follow (no lag), touch-enabled

---

## Asset Placeholder Checklist (client to supply)
- [ ] 3x hero videos or high-res images (treatments in action)
- [ ] 13x treatment hero images (one per service)
- [ ] 13x treatment-specific before/after pairs (licensed/consented only)
- [ ] Philosophy/story section image or video
- [ ] Team/doctor photo(s)
- [ ] Logo (SVG, both light and dark versions for green/cream backgrounds)
- [ ] Favicon
- [ ] Social icons (or use an icon library — no placeholder needed if using Lucide/Heroicons)

---

## Explicit Instruction to Claude Code
Build this as an **original design** using the structure, palette, and content above. Do not reference, inspect, or attempt to replicate the code, animation timing, or visual layout of any specific existing commercial website — design the interactions fresh from the specification in this brief.
