# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Kamars Khyra — an original, editorial-style booking website for a doctor-assisted, vegan/ethical medi-facial clinic in Chennai. Treatments are presented and added to cart like e-commerce products (price, "Add to Cart"), but nothing ships. Checkout ends in an **appointment booking** (date/time slot + clinic address), not a shipment.

The full design/content spec is `kamars-khyra-build-brief.md` at the project root — read it before generating pages or components.

## Commands
```bash
npm run dev            # dev server (Turbopack)
npm run build          # content check, then production build
npm run lint           # eslint (flat config; `next lint` no longer exists in Next 16)
npm run typecheck      # tsc --noEmit
npm run check:content  # list outstanding client content/assets
CONTENT_STRICT=1 npm run check:content   # same, but exits 1 — use as a pre-launch gate
```
There is no test runner yet; `lint` + `typecheck` + `build` are the current gates.

## Design Non-Negotiables
- This is an **original design**. Do not reference, inspect, or attempt to replicate the code, animation timing, or visual layout of any specific existing commercial website (including any site mentioned in chat history or past sessions). Build interactions fresh from the spec in the build brief.
- Before/after and skin photography must only ever sit on **cream/off-white** grounds — never forest-green or near-black. Dark backgrounds distort perceived skin tone.
- Forest green carries the nav bar, footer, and section-break bands.
- No shipping/tracking/address UI anywhere in the cart or checkout flow.

### The two golds (contrast)
`--color-antique-gold` (#B8963E) is **2.4:1 on cream — it fails WCAG AA at every size**, so it is a fill/border/icon colour only (and is fine as text on forest green, 4.7:1). Gold *text* on cream uses `--color-gold-deep` (#806320, 5.2:1). Both are defined in `app/globals.css`; measured ratios are documented there. Never set `text-antique-gold` on a cream or off-white ground.

## Architecture
**Data-driven, not per-page.** `data/treatments.ts` is the single source for all 13 treatments (cards, detail pages, cart lines, `generateStaticParams`). `data/site.ts` holds clinic details and homepage section copy. Adding a treatment means adding a data entry — never a new hand-built page.

**Missing content is modelled, not faked.** The client has supplied treatment *names* only. Prices, durations, benefits and mechanism copy are `null`/empty and typed as nullable, so the UI is forced to handle absence: `formatPrice(null)` → "Price on request", empty benefits → a "detail pending" panel. `scripts/check-content.mjs` walks `/data` (Node strips the TS types natively) and reports every gap; it runs before each build and warns without failing.

**Asset slots resolve themselves.** Every photographic slot goes through `components/PlaceholderMedia.tsx`, which renders the real `<img>` and falls back to a labelled placeholder panel on error. Paths follow the brief's `[PLACEHOLDER: ...]` names (`public/assets/README.md` documents each one), so dropping the client's files at those paths is the entire integration step — no code change.

**Cart → booking.** `lib/cart.ts` (Zustand + `persist`) holds one line per treatment *per course length* — identity is `lineKey(line)` = `slug#sessions`, never the slug alone. There is no quantity and no address. Read `hydrated` before rendering cart-dependent UI or the server and client markup diverge. `components/BookingStepper.tsx` runs the five steps; the final submit is local only (no backend), so it snapshots the lines, clears the cart, and offers an `.ics` from `lib/ics.ts`. `lib/ui-store.ts` holds ephemeral cross-component UI state (the cart drawer, opened from the nav, quick-add and floating CTA).

**Reading external state.** `react-hooks/set-state-in-effect` is enforced, so browser state is read through `useSyncExternalStore`, not mirrored into state from an effect: `lib/useScrollPast.ts` exports `useScrollPast` (scroll position → boolean) and `useSessionFlag` (sessionStorage, used by the intro reveal and announcement bar). Follow that pattern for anything new.

**Availability is deliberately honest.** `lib/slots.ts` does calendar arithmetic only — it greys out closed days, past times and the lead-time window, and never invents "booked" slots. When a backend exists, pass real bookings into `getSlots(date, taken)`.

**Motion.** `components/Reveal.tsx` is the shared scroll-entrance (fade-up 20px at 20% visibility; pass `delay` for the 150ms stagger). `app/template.tsx` gives every route an enter transition (enter-only — App Router has no reliable hook to hold a page for an exit animation). Every animated component reads `useReducedMotion`, and `globals.css` neutralises CSS transitions under `prefers-reduced-motion`. The marquee and intro reveal don't just shorten under that setting — they stop or don't render at all.

**Where the homepage sections live.** `app/page.tsx` orders the bands and alternates ground colour (cream / off-white / forest green); each section owns its own background. Copy for the sticky method sequence, session walkthrough and marquee is in `data/method.ts`; ingredient story in `data/actives.ts`; reviews in `data/reviews.ts`. The last two are **empty by design** and render honest pending/empty states — see Content Rules.

## Content Rules
- Treatment names, benefits, and "how it works" copy come from the client's own material — do not rewrite, embellish, or add unsupported medical/efficacy claims.
- Never invent a price. Leave `price: null`; the content check surfaces it.
- No stock or scraped before/after imagery. Leave the placeholder panels in place.
- `concerns` tags in `data/treatments.ts` are currently **inferred from treatment names** (`concernsInferred: true`) and need client confirmation. The skin finder quiz and "pairs well with" rail both filter on these tags, so both are framed as starting points the doctor confirms — not recommendations.
- `data/reviews.ts` and `data/actives.ts` are empty **on purpose**. Never seed either with samples: a fabricated review is invented testimony for a medical business, and what an active does to skin is an efficacy claim. Both sections render honest empty states.
- `protocol`, `aftercare`, `timeline` and `courses` on a treatment are optional and unset. Aftercare and downtime are clinical instruction — the tabs and timeline show a pending panel rather than a best guess.
- Legal pages (`/legal/[policy]`) are intentional stubs — cancellation/terms/privacy must be the clinic's own legal copy, not drafted here.

## Open Decisions (confirm before building the affected feature)
- **Payment gateway** — booking step 4 currently states that online payment is not enabled. No card form is built; do not add one before the gateway (Razorpay is the likely India default) and deposit policy are confirmed.
- **Booking backend** — nothing is transmitted on submit; the confirmation is local. Needs a store/CRM before launch.
- **Daily capacity caps** per treatment (would extend `lib/slots.ts` beyond calendar logic).
- **Pricing, durations, benefits, "how it works"** for all 13 treatments; clinic hours; social URLs; Google Maps pin; clinic email (the contact form composes a WhatsApp message because there is no inbox yet).

## Stack Gotchas
- **Tailwind v4** — tokens live in the `@theme` block in `app/globals.css`. There is no `tailwind.config.js`; don't create one.
- **lucide-react v1 ships no brand icons** — Instagram/Facebook glyphs are hand-drawn in `components/SocialIcons.tsx`.
- **eslint-config-next 16** exports flat config directly (`eslint-config-next/core-web-vitals`); `FlatCompat` breaks on it.
- The `react-hooks/set-state-in-effect` rule is enforced. Mirror external stores (Embla, etc.) with `useSyncExternalStore` rather than syncing them into state from an effect — see `components/FeaturedTreatments.tsx`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
