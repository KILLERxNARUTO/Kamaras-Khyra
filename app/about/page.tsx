import type { Metadata } from 'next';
import PlaceholderMedia from '@/components/PlaceholderMedia';
import Reveal from '@/components/Reveal';
import TrustPillars from '@/components/TrustPillars';
import { philosophy, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Kamars Khyra is a doctor-assisted, 100% vegan medi-facial clinic in Poonamallee, Chennai — by Dr. Nazreen. Science-backed, ethically formulated skincare.',
};

export default function AboutPage() {
  return (
    <div className="bg-rich-black">
      {/* Integrated Hero & Welcome Section */}
      <section className="shell pt-28 md:pt-36 pb-16 md:pb-24">
        <Reveal>
          <p className="text-xs font-bold text-antique-gold uppercase tracking-[0.25em]">Our Motive</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-[1.1] text-cream sm:text-4xl md:text-5xl">
            Where Science, Purity & Personal Care Meet
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
            A space thoughtfully created for those who seek healthy, radiant skin through ethical, conscious, and medically guided skincare.
          </p>
          <div className="rule-gold mt-8 max-w-32 mb-12" />
        </Reveal>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <Reveal>
            <p className="text-xs font-bold text-antique-gold uppercase tracking-[0.18em] mb-3">Welcome</p>
            <p className="text-base leading-relaxed text-cream/80 mb-6">{philosophy.welcome}</p>
            <blockquote className="font-serif text-xl leading-[1.45] text-cream border-l-2 border-antique-gold pl-5 sm:text-2xl">
              {philosophy.quote}
            </blockquote>
            <p className="mt-8 text-sm font-bold text-antique-gold">{philosophy.motive}</p>
            <ul className="mt-4 space-y-2">
              {philosophy.motivePoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-cream/75">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <PlaceholderMedia
            src="/assets/story/philosophy-story.jpg"
            alt="Inside the Kamars Khyra clinic"
            className="aspect-[4/5] w-full rounded-sm border border-sage/20"
          />
        </div>
      </section>

      <TrustPillars />

      {/* Vision */}
      <section className="bg-forest-green/40 py-16 md:py-24 border-t border-sage/15">
        <div className="shell grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal className="max-w-xl">
            <p className="eyebrow text-antique-gold">Our Vision</p>
            <h2 className="mt-4 font-serif text-3xl font-bold text-cream">
              Kamars Khyra Customised Facial Treatment
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-cream/80">{philosophy.vision}</p>
            <ul className="mt-6 space-y-3">
              {philosophy.visionBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-cream/75">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-10 text-sm text-cream/70">
              <p className="font-bold text-antique-gold mb-1">By {site.doctor}</p>
              <address className="not-italic space-y-1 text-cream/65">
                <span>{site.address.line1}</span><br />
                <span>{site.address.line2}, {site.address.city} — {site.address.postcode}</span><br />
                <a href={`tel:${site.phoneHref}`} className="text-antique-gold font-bold underline underline-offset-4 hover:text-gold-light">
                  {site.phone}
                </a>
              </address>
            </div>
          </Reveal>
          <PlaceholderMedia
            src="/assets/story/clinic-interior.jpg"
            alt="Inside the Kamars Khyra clinic"
            className="aspect-[4/5] w-full rounded-sm border border-sage/20"
          />
        </div>
      </section>
    </div>
  );
}
