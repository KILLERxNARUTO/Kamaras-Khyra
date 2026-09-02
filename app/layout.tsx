import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, Short_Stack, Outfit } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FloatingBookCta from '@/components/FloatingBookCta';
import IntroReveal from '@/components/IntroReveal';
import { site } from '@/data/site';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans-heading',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const shortStack = Short_Stack({
  subsets: ['latin'],
  variable: '--font-short-stack',
  display: 'swap',
  weight: ['400'],
});

const googleSans = Outfit({
  subsets: ['latin'],
  variable: '--font-google-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}, Chennai`,
    template: `%s — ${site.name}`,
  },
  description:
    'Doctor-assisted, 100% vegan medi-facial services in Poonamallee, Chennai. Personalised after clinical skin analysis, science-backed, ethically formulated.',
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${inter.variable} ${shortStack.variable} ${googleSans.variable}`}
    >
      <body className="min-h-dvh bg-rich-black text-cream antialiased font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest-green focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
        >
          Skip to content
        </a>
        <IntroReveal />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <FloatingBookCta />
      </body>
    </html>
  );
}
