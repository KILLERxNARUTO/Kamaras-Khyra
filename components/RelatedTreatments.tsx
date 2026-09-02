import { relatedTreatments } from '@/data/treatments';
import TreatmentCard from './TreatmentCard';
import Reveal from './Reveal';

export default function RelatedTreatments({ slug }: { slug: string }) {
  const related = relatedTreatments(slug);
  if (related.length === 0) return null;

  return (
    <section className="bg-rich-black py-16 md:py-24 border-t border-sage/15">
      <div className="shell">
        <Reveal className="max-w-xl">
          <p className="text-xs font-bold text-antique-gold uppercase tracking-[0.25em]">Complementary Protocols</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-cream">Explore Related Services</h2>
          <p className="mt-3 text-sm leading-relaxed text-cream/75">
            Personalised treatment combinations are finalized after your doctor-assisted skin analysis.
          </p>
          <div className="rule-gold mt-4 max-w-20" />
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {related.map((treatment, i) => (
            <Reveal key={treatment.slug} delay={i * 0.1}>
              <TreatmentCard treatment={treatment} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
