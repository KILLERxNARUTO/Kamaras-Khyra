import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Visit Kamars Khyra at ${site.address.line1}, ${site.address.line2}, ${site.address.city}. Call ${site.phone} to book a doctor-assisted medi-facial.`,
};

export default function ContactPage() {
  return (
    <div className="bg-rich-black pt-28 md:pt-36 pb-24 md:pb-32">
      <div className="shell">
        <Reveal>
          <p className="text-xs font-bold text-antique-gold uppercase tracking-[0.25em]">Contact</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-[1.1] text-cream sm:text-4xl md:text-5xl">
            Come and see us
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
            The clinic is in Poonamallee. Call ahead or send a message and we will find a time that suits your skin and your schedule.
          </p>
          <div className="rule-gold mt-8 max-w-32 mb-12" />
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="font-serif text-2xl font-bold text-cream">Clinic Details</h2>
            <div className="rule-gold mt-4 max-w-20" />

            <address className="mt-8 space-y-6 text-sm not-italic leading-relaxed text-cream/80">
              <span className="flex gap-4 items-start">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-antique-gold" aria-hidden />
                <span className="text-cream/90">
                  <strong className="block text-cream font-bold mb-0.5">{site.name}</strong>
                  {site.address.line1}<br />
                  {site.address.line2}<br />
                  {site.address.city} — {site.address.postcode}
                </span>
              </span>
              <span className="flex gap-4 items-center">
                <Phone className="h-5 w-5 shrink-0 text-antique-gold" aria-hidden />
                <a href={`tel:${site.phoneHref}`} className="text-antique-gold font-bold hover:text-gold-light transition-colors">
                  {site.phone}
                </a>
              </span>
            </address>

            <div className="mt-10 flex aspect-[16/10] w-full items-center justify-center rounded-sm border border-sage/30 bg-forest-green/50 p-6 text-center">
              <p className="max-w-xs text-xs leading-relaxed text-cream/70">
                Poonamallee, Chennai — Doctor-Assisted Medi-Facial Clinic. Contact us for direct directions.
              </p>
            </div>

            <Link
              href="/booking"
              className="mt-10 inline-block rounded-full bg-antique-gold px-8 py-3.5 text-sm font-bold text-near-black transition-colors duration-200 hover:bg-gold-light"
            >
              Book an appointment
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-serif text-2xl font-bold text-cream">Send a message</h2>
            <div className="rule-gold mt-4 max-w-20" />
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
