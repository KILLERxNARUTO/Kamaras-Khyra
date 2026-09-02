import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTreatment, treatments, treatmentAssets } from '@/data/treatments';
import PlaceholderMedia from '@/components/PlaceholderMedia';
import TreatmentPurchase from '@/components/TreatmentPurchase';
import TreatmentTabs from '@/components/TreatmentTabs';
import ExpectTimeline from '@/components/ExpectTimeline';
import RelatedTreatments from '@/components/RelatedTreatments';
import Reveal from '@/components/Reveal';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return {};
  return {
    title: treatment.name,
    description:
      treatment.idealFor ??
      `${treatment.name} — a doctor-assisted, 100% vegan medi-facial service at Kamars Khyra, Poonamallee, Chennai.`,
  };
}

export default async function TreatmentPage({ params }: Params) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();

  return (
    <article className="pb-24 bg-rich-black min-h-screen text-cream">
      {/* Masthead — Rich Black with Gold Accents */}
      <div className="bg-rich-black pt-28 md:pt-36 border-b border-sage/15">
        <div className="shell grid items-center gap-10 py-10 md:grid-cols-2 md:gap-16 md:py-14">
          <Reveal>
            <Link
              href="/treatments"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-antique-gold hover:text-gold-light transition-colors"
            >
              ← Back to All Services
            </Link>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.1] text-cream sm:text-5xl md:text-6xl">
              {treatment.name}
            </h1>

            {treatment.concerns.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {treatment.concerns.map((concern) => (
                  <span
                    key={concern}
                    className="rounded-full border border-sage/30 bg-forest-green/50 px-3.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-antique-gold"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            )}

            {treatment.idealFor && (
              <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/80 sm:text-base">
                <strong className="text-antique-gold font-bold">Ideal for: </strong>
                {treatment.idealFor}
              </p>
            )}
            <div className="rule-gold mt-8 max-w-28" />
          </Reveal>

          <PlaceholderMedia
            src={treatmentAssets.hero(treatment.slug)}
            alt={treatment.name}
            priority
            className="aspect-[4/5] w-full rounded-sm border border-sage/20 shadow-2xl"
          />
        </div>
      </div>

      {/* Detail + Sticky Service Booking Rail */}
      <div className="shell grid gap-12 py-14 lg:grid-cols-[1fr_22rem] lg:gap-16 lg:py-20">
        <div>
          <TreatmentTabs treatment={treatment} />
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="bg-forest-green/80 border border-sage/25 p-7 rounded-sm shadow-xl">
            <TreatmentPurchase treatment={treatment} />
          </div>
        </aside>
      </div>

      <ExpectTimeline treatment={treatment} />

      <RelatedTreatments slug={treatment.slug} />
    </article>
  );
}
