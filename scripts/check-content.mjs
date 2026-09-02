/**
 * Content gate — runs before every build (`npm run build`) and on demand
 * (`npm run check:content`).
 *
 * The client's deck has not supplied pricing, benefits, durations or photography yet.
 * Rather than letting invented values slip into a build, those gaps live as nulls in
 * /data and are reported here. This WARNS, it does not fail: an incomplete site still
 * needs to be buildable and previewable. Set CONTENT_STRICT=1 to make it exit non-zero
 * (useful as a pre-launch gate once the client content has landed).
 */

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.env.CONTENT_STRICT === '1';

const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

let data;
try {
  const treatmentsMod = await import('../data/treatments.ts');
  const siteMod = await import('../data/site.ts');
  data = { ...treatmentsMod, ...siteMod };
} catch (error) {
  console.warn(yellow('! content check skipped — could not load /data'));
  console.warn(dim(`  ${error.message}`));
  process.exit(0);
}

const { treatments = [], treatmentAssets = {}, heroSlides = [], beforeAfterPreview = [], methodPanels = [], actives = [], reviews = [] } =
  data;

const warnings = [];

// --- Treatment content -------------------------------------------------------
const missingPrice = treatments.filter((t) => t.price === null);
const missingDuration = treatments.filter((t) => t.durationMinutes === null);
const missingBenefits = treatments.filter((t) => t.benefits.length === 0);
const missingHowItWorks = treatments.filter((t) => t.howItWorks === null);
const untagged = treatments.filter((t) => t.concerns.length === 0);
const inferred = treatments.filter((t) => t.concernsInferred);

if (missingPrice.length) {
  warnings.push([
    `${missingPrice.length}/${treatments.length} treatments have no price`,
    'They render as "Price on request". Do not substitute a placeholder number.',
    missingPrice.map((t) => t.slug),
  ]);
}
if (missingBenefits.length) {
  warnings.push([
    `${missingBenefits.length}/${treatments.length} treatments have no benefits copy`,
    'Benefits are medical claims — they must come from the client deck verbatim.',
    missingBenefits.map((t) => t.slug),
  ]);
}
if (missingHowItWorks.length) {
  warnings.push([
    `${missingHowItWorks.length}/${treatments.length} treatments have no "how it works" copy`,
    'The detail section falls back to a "pending" panel until this lands.',
    missingHowItWorks.map((t) => t.slug),
  ]);
}
if (missingDuration.length) {
  warnings.push([
    `${missingDuration.length}/${treatments.length} treatments have no duration`,
    'Duration is hidden on cards and detail pages while null.',
    missingDuration.map((t) => t.slug),
  ]);
}
if (untagged.length) {
  warnings.push([
    `${untagged.length} treatments are not tagged with a concern`,
    'They only appear under the "All" filter on /treatments.',
    untagged.map((t) => t.slug),
  ]);
}
if (inferred.length) {
  warnings.push([
    `${inferred.length} treatments have concern tags inferred from their name`,
    'Confirm these categories with the clinic.',
    inferred.map((t) => t.slug),
  ]);
}

const missingProtocol = treatments.filter((t) => !t.protocol?.length);
const missingAftercare = treatments.filter((t) => !t.aftercare?.length);
const missingFaq = treatments.filter((t) => !t.faq?.length);
const missingTimeline = treatments.filter((t) => !t.timeline);
const missingCourses = treatments.filter((t) => !t.courses?.length);

if (missingProtocol.length) {
  warnings.push([
    `${missingProtocol.length}/${treatments.length} treatments have no protocol steps`,
    'The Protocol tab shows a pending panel until the clinic supplies these.',
    missingProtocol.map((t) => t.slug),
  ]);
}
if (missingAftercare.length) {
  warnings.push([
    `${missingAftercare.length}/${treatments.length} treatments have no aftercare copy`,
    'Aftercare is clinical instruction — it is never drafted in-house.',
    missingAftercare.map((t) => t.slug),
  ]);
}
if (missingTimeline.length) {
  warnings.push([
    `${missingTimeline.length}/${treatments.length} treatments have no before/during/after timeline`,
    'Includes downtime, which clients plan their week around. Clinic copy only.',
    missingTimeline.map((t) => t.slug),
  ]);
}
if (missingFaq.length) {
  warnings.push([
    `${missingFaq.length}/${treatments.length} treatments have no FAQ entries`,
    'Use the questions the clinic is actually asked, with their answers.',
    missingFaq.map((t) => t.slug),
  ]);
}
if (missingCourses.length === treatments.length) {
  warnings.push([
    'No treatment has course pricing',
    'Course selection is hidden site-wide until the clinic confirms whether courses are sold.',
    ['data/treatments.ts → courses'],
  ]);
}

// --- Sections that render pending states -------------------------------------
if (actives.length === 0) {
  warnings.push([
    'The ingredient story has no actives',
    'Renders placeholder slots. What an active does is an efficacy claim — clinic copy only.',
    ['data/actives.ts'],
  ]);
}
if (reviews.length === 0) {
  warnings.push([
    'No reviews published',
    'The review wall shows an honest empty state. Never seed this with samples.',
    ['data/reviews.ts'],
  ]);
}

// --- Photography -------------------------------------------------------------
const assetPaths = [
  ...heroSlides.flatMap((s) => [s.image, s.video]),
  ...treatments.flatMap((t) => [
    treatmentAssets.card(t.slug),
    treatmentAssets.hero(t.slug),
    treatmentAssets.results(t.slug).replace('.jpg', '-before.jpg'),
    treatmentAssets.results(t.slug).replace('.jpg', '-after.jpg'),
  ]),
  ...beforeAfterPreview.flatMap((p) => [p.before, p.after]),
  ...methodPanels.map((p) => p.image),
  ...actives.map((a) => a.image),
  '/assets/story/philosophy-story.jpg',
  ...[1, 2, 3].map((n) => `/assets/team/team-photo-${n}.jpg`),
];

const missingAssets = assetPaths.filter((p) => !existsSync(join(root, 'public', p)));
if (missingAssets.length) {
  warnings.push([
    `${missingAssets.length}/${assetPaths.length} image/video slots have no file yet`,
    'Each renders a labelled placeholder panel. Drop files at these exact paths — no renaming needed.',
    missingAssets,
  ]);
}

// --- Report ------------------------------------------------------------------
if (warnings.length === 0) {
  console.log('\x1b[32m✓\x1b[0m content check: all treatment content and assets present\n');
  process.exit(0);
}

console.log(`\n${bold('Content check — client material still outstanding')}\n`);
for (const [headline, detail, items] of warnings) {
  console.log(`${yellow('!')} ${headline}`);
  console.log(`  ${dim(detail)}`);
  const preview = items.slice(0, 4).join(', ');
  const more = items.length > 4 ? `, +${items.length - 4} more` : '';
  console.log(`  ${dim(preview + more)}\n`);
}
console.log(
  dim(`${warnings.length} warning group(s). Build continues — set CONTENT_STRICT=1 to fail instead.\n`),
);

process.exit(strict ? 1 : 0);
