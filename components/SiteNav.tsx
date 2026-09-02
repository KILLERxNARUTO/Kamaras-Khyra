'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, ChevronDown, ArrowRight, X, Menu } from 'lucide-react';
import { site } from '@/data/site';
import StaggeredMenu from './StaggeredMenu';

const SERVICES_LIST = [
  { href: '/treatments/aqua-360-medi-hydra-facial', label: 'Signature Hydrafacials' },
  { href: '/treatments/halal-eyebrow-lamination', label: 'Brows & Lashes' },
  { href: '/treatments/scalp-rejuvenation-therapy', label: 'Scalp & Hair Therapy' },
  { href: '/treatments/glow-glass-therapy', label: 'Body & Glow Treatments' },
  { href: '/treatments/doctor-assisted-skin-analysis', label: 'Doctor Assisted Consult' },
];

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/treatments', label: 'All Services' },
  { href: '/gallery', label: 'Results' },
  { href: '/contact', label: 'Contact' },
  { href: '/booking', label: 'Book Appointment' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  return (
    <>
      <nav className="w-full bg-transparent text-cream py-4 sm:py-5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative flex items-center justify-between">

          {/* LEFT LINKS — hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 z-10">
            <Link href="/" className="text-xs uppercase tracking-[0.25em] font-light text-cream/90 hover:text-cream transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-xs uppercase tracking-[0.25em] font-light text-cream/80 hover:text-cream transition-colors">
              About
            </Link>
          </div>

          {/* MOBILE: Hamburger (left) */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="md:hidden p-2 -ml-1 text-cream/90 z-10"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* ABSOLUTE DEAD-CENTER LOGO */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto">
            <Link href="/" aria-label={site.name}>
              <img
                src="/assets/brand/logo.png"
                alt={site.name}
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
              />
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 sm:gap-6 z-10">

            {/* SERVICES DROPDOWN — desktop only */}
            <div
              className="relative hidden md:block"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-xs uppercase tracking-[0.25em] font-light text-cream/90 hover:text-cream transition-colors flex items-center gap-1.5 py-1"
                aria-expanded={dropdownOpen}
              >
                <span>Services</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-3 w-72 bg-[#060e0a]/95 border border-sage/20 rounded-2xl p-4 shadow-2xl z-50 backdrop-blur-xl"
                  >
                    <p className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-antique-gold mb-1">
                      Clinical Medi-Facials
                    </p>
                    <ul className="space-y-1">
                      {SERVICES_LIST.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-light text-cream/85 hover:text-cream hover:bg-white/5 transition-all group"
                          >
                            <span className="shrink-0 text-antique-gold/70 group-hover:text-antique-gold transition-colors">
                              <svg width="12" height="16" viewBox="0 0 14 20" fill="none">
                                <path d="M7 0C7 0 0 8.5 0 13a7 7 0 1 0 14 0C14 8.5 7 0 7 0z" stroke="currentColor" strokeWidth="1.2" />
                                <path d="M7 0C7 0 0 8.5 0 13a7 7 0 1 0 14 0C14 8.5 7 0 7 0z" fill="currentColor" fillOpacity="0.2" />
                              </svg>
                            </span>
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="my-3 border-t border-cream/10" />
                    <Link
                      href="/treatments"
                      className="flex items-center justify-between px-3 py-2 text-xs uppercase tracking-[0.2em] text-antique-gold hover:text-cream font-bold transition-colors group"
                    >
                      <span>All Clinical Services</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BOOK CTA — hidden on smallest screens */}
            <Link
              href="/booking"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-antique-gold px-3 py-1.5 sm:px-4 text-xs font-bold text-near-black transition-colors hover:bg-gold-light"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Book Service</span>
            </Link>

            {/* STAGGERED MENU — desktop */}
            <div className="hidden md:block">
              <StaggeredMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ───────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[80] bg-rich-black/80 backdrop-blur-sm md:hidden"
            />
            {/* Drawer panel */}
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-[90] w-72 bg-rich-black border-r border-sage/20 flex flex-col md:hidden shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-sage/15">
                <Link href="/" onClick={() => setMobileOpen(false)} aria-label={site.name}>
                  <img
                    src="/assets/brand/logo.png"
                    alt={site.name}
                    className="h-9 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 text-cream/70 hover:text-cream"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="flex-1 overflow-y-auto py-6 px-6">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between w-full py-3.5 text-sm font-medium border-b border-sage/10 transition-colors ${
                          link.href === '/booking'
                            ? 'text-antique-gold font-bold'
                            : 'text-cream/80 hover:text-antique-gold'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Services sub-section */}
                <div className="mt-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-antique-gold mb-3">
                    Clinical Medi-Facials
                  </p>
                  <ul className="space-y-1">
                    {SERVICES_LIST.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2.5 text-xs text-cream/65 hover:text-cream transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Drawer footer */}
              <div className="border-t border-sage/15 px-6 py-5">
                <Link
                  href="/booking"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-antique-gold py-3 text-sm font-bold text-near-black transition-colors hover:bg-gold-light"
                >
                  <CalendarDays className="h-4 w-4" />
                  Book Appointment
                </Link>
                <p className="mt-4 text-center text-xs text-cream/50">
                  <a href={`tel:${site.phoneHref}`} className="hover:text-antique-gold transition-colors">
                    {site.phone}
                  </a>
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
