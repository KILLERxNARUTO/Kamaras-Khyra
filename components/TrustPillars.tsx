import { FlaskConical, Leaf, Stethoscope } from 'lucide-react';
import { trustPillars } from '@/data/site';
import Reveal from './Reveal';

const icons = {
  doctor: Stethoscope,
  vegan: Leaf,
  results: FlaskConical,
  science: FlaskConical,
} as const;

export default function TrustPillars() {
  return (
    <section className="bg-rich-black py-20 md:py-28">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {trustPillars.map((pillar, i) => {
            const Icon = icons[pillar.icon as keyof typeof icons] ?? FlaskConical;
            return (
              <Reveal key={pillar.numeral} delay={i * 0.15} as="article">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-4xl text-antique-gold">{pillar.numeral}</span>
                  <Icon className="h-5 w-5 text-gold-deep" aria-hidden />
                </div>
                <div className="rule-gold mt-6" />
                <h2 className="mt-6 font-serif text-2xl text-cream">{pillar.title}</h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/60">
                  {pillar.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
