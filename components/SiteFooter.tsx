import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from './SocialIcons';
import { site } from '@/data/site';

const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  site.address.fullQuery,
)}`;

const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  site.address.fullQuery,
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export default function SiteFooter() {
  return (
    <footer className="bg-forest-green text-cream border-t border-sage/15 min-h-[100dvh] flex flex-col justify-between">
      <div className="shell py-12 md:py-16 my-auto flex-1 flex flex-col justify-center">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 items-start">
          
          {/* Column 1: Brand & Social */}
          <div className="lg:col-span-3">
            <p className="font-serif text-2xl uppercase tracking-[0.14em] text-cream">{site.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">{site.tagline}</p>
            <div className="mt-6 flex gap-3">
              {site.social.instagram && (
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-full border border-cream/25 p-2.5 transition-colors duration-200 hover:border-antique-gold hover:text-antique-gold"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {/* WhatsApp */}
              <a
                href="https://wa.me/917305063062"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full border border-cream/25 p-2.5 transition-colors duration-200 hover:border-antique-gold hover:text-antique-gold"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {site.social.facebook && (
                <a
                  href={site.social.facebook}
                  aria-label="Facebook"
                  className="rounded-full border border-cream/25 p-2.5 transition-colors duration-200 hover:border-antique-gold hover:text-antique-gold"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Visit Clinic */}
          <div className="lg:col-span-2">
            <h2 className="text-[0.6875rem] uppercase tracking-[0.22em] text-antique-gold font-bold">
              Visit the clinic
            </h2>
            <address className="mt-5 space-y-4 text-sm not-italic leading-relaxed text-cream/80">
              <span className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-antique-gold" aria-hidden />
                <span>
                  <a
                    href={MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-antique-gold transition-colors"
                  >
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                    <br />
                    {site.address.city}—{site.address.postcode}
                  </a>
                </span>
              </span>
              <span className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-antique-gold" aria-hidden />
                <a href={`tel:${site.phoneHref}`} className="hover:text-antique-gold transition-colors">
                  {site.phone}
                </a>
              </span>
            </address>
          </div>

          {/* Column 3: Links (Explore & Legal) */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-2">
            <FooterColumn
              title="Explore"
              items={[
                { href: '/treatments', label: 'Treatments' },
                { href: '/gallery', label: 'Results' },
                { href: '/about', label: 'About' },
                { href: '/booking', label: 'Book Now' },
              ]}
            />
            <FooterColumn
              title="Legal"
              items={[
                { href: '/legal/cancellation', label: 'Cancellation Policy' },
                { href: '/legal/terms', label: 'Terms' },
                { href: '/legal/privacy', label: 'Privacy' },
              ]}
            />
          </div>

          {/* Column 4: Wide Map & Get Directions button below */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h2 className="text-[0.6875rem] uppercase tracking-[0.22em] text-antique-gold font-bold">
              Location Map
            </h2>
            
            {/* Wider, Sleek Aspect Map Container */}
            <div className="relative overflow-hidden rounded-xl border border-sage/25 shadow-2xl bg-[#060e0a] h-48 sm:h-56 lg:h-64 w-full group">
              <iframe
                title="Kamars Khyra Location Map"
                src={MAPS_EMBED_URL}
                className="w-full h-full border-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Directions Button Below Map with Map Pin Icon */}
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full rounded-xl bg-antique-gold px-5 py-3 text-xs font-bold text-near-black shadow-md hover:bg-gold-light hover:scale-[1.01] transition-all duration-200"
            >
              <MapPin className="h-4 w-4 shrink-0 text-near-black" aria-hidden="true" />
              <span className="uppercase tracking-[0.15em]">Get Directions</span>
              <span className="text-sm leading-none ml-0.5">↗</span>
            </a>
          </div>

        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Doctor-assisted · 100% vegan · Chennai</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-[0.6875rem] uppercase tracking-[0.22em] text-antique-gold font-bold">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm text-cream/80">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="transition-colors duration-200 hover:text-antique-gold">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
