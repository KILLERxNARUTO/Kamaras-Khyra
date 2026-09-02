import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { site } from '@/data/site';

/**
 * Legal pages are stubs on purpose: cancellation terms, T&Cs and a privacy policy are
 * the clinic's own legal copy. Placeholder legal text must never ship as if it were real,
 * so each page states plainly that the policy is pending and points to the clinic.
 */
const POLICIES = {
  cancellation: {
    title: 'Cancellation Policy',
    intro:
      'How far in advance you can reschedule or cancel an appointment, and any deposit terms that apply.',
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'The terms you agree to when booking a treatment with the clinic.',
  },
  privacy: {
    title: 'Privacy Policy',
    intro:
      'What we do with the details you share when booking — including the skin concerns and allergies noted at checkout.',
  },
} as const;

type Policy = keyof typeof POLICIES;
type Params = { params: Promise<{ policy: string }> };

export function generateStaticParams() {
  return Object.keys(POLICIES).map((policy) => ({ policy }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { policy } = await params;
  const entry = POLICIES[policy as Policy];
  return entry ? { title: entry.title, description: entry.intro } : {};
}

export default async function LegalPage({ params }: Params) {
  const { policy } = await params;
  const entry = POLICIES[policy as Policy];
  if (!entry) notFound();

  return (
    <>
      <PageHeader eyebrow="Legal" title={entry.title} intro={entry.intro} />
      <section className="shell pb-24 md:pb-32">
        <div className="max-w-xl border border-dashed border-sage/40 bg-off-white p-8">
          <p className="text-sm leading-relaxed text-near-black/70">
            This policy is being finalised with the clinic and will be published here before
            launch. For anything you need to know in the meantime, call us on{' '}
            <a href={`tel:${site.phoneHref}`} className="text-gold-deep underline underline-offset-4">
              {site.phone}
            </a>
            .
          </p>
          {/* TODO: replace with the clinic's own legal copy — do not draft this in-house. */}
        </div>
      </section>
    </>
  );
}
