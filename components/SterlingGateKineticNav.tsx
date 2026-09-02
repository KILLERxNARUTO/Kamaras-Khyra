'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function SterlingGateKineticNav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hover open / leave close handlers
  const handleMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 250);
  };

  // Initial Setup & Ambient Shape Hover Effects
  useEffect(() => {
    if (!containerRef.current) return;

    gsap.defaults({ ease: 'power3.out', duration: 0.5 });

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current!.querySelectorAll('.menu-list-item[data-shape]');
      const shapesContainer = containerRef.current!.querySelector('.ambient-background-shapes');

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute('data-shape');
        const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;

        if (!shape) return;

        const shapeEls = shape.querySelectorAll('.shape-element');

        const onEnter = () => {
          if (shapesContainer) {
            shapesContainer.querySelectorAll('.bg-shape').forEach((s) => s.classList.remove('active'));
          }
          shape.classList.add('active');

          gsap.fromTo(
            shapeEls,
            { scale: 0.7, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              stagger: 0.05,
              ease: 'power2.out',
              overwrite: 'auto',
            }
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => shape.classList.remove('active'),
            overwrite: 'auto',
          });
        };

        item.addEventListener('mouseenter', onEnter);
        item.addEventListener('mouseleave', onLeave);

        (item as any)._cleanup = () => {
          item.removeEventListener('mouseenter', onEnter);
          item.removeEventListener('mouseleave', onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (containerRef.current) {
        const items = containerRef.current.querySelectorAll('.menu-list-item[data-shape]');
        items.forEach((item: any) => item._cleanup && item._cleanup());
      }
    };
  }, []);

  // Menu Open/Close GSAP Timeline
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current!.querySelector('.nav-overlay-wrapper');
      const menu = containerRef.current!.querySelector('.menu-content');
      const overlay = containerRef.current!.querySelector('.overlay');
      const bgPanels = containerRef.current!.querySelectorAll('.backdrop-layer');
      const menuLinks = containerRef.current!.querySelectorAll('.nav-link');

      const tl = gsap.timeline();

      if (isMenuOpen) {
        if (navWrap) navWrap.setAttribute('data-nav', 'open');

        tl.set(navWrap, { display: 'block' })
          .set(menu, { xPercent: 0 }, '<')
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, '<')
          .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.1, duration: 0.5 }, '<')
          .fromTo(
            menuLinks,
            { opacity: 0, x: 40 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.06,
              duration: 0.5,
              clearProps: 'transform,opacity',
            },
            '<+=0.25'
          );
      } else {
        if (navWrap) navWrap.setAttribute('data-nav', 'closed');

        tl.to(overlay, { autoAlpha: 0, duration: 0.3 })
          .to(menu, { xPercent: 105, duration: 0.4 }, '<')
          .set(navWrap, { display: 'none' });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  // keydown Escape handling
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {/* Header Menu Button Trigger — Opens on hover & click */}
      <button
        role="button"
        className="nav-close-btn relative z-50 flex items-center gap-2.5 cursor-pointer py-1"
        onClick={toggleMenu}
        aria-label="Toggle Navigation Menu"
      >
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-cream">
          {isMenuOpen ? 'CLOSE' : 'MENU'}
        </span>
        <div className="icon-wrap flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="menu-button-icon transition-transform duration-300"
            style={{ transform: isMenuOpen ? 'rotate(135deg)' : 'rotate(0deg)' }}
          >
            <path d="M7.33333 16L7.33333 0L8.66667 0L8.66667 16L7.33333 16Z" fill="currentColor" />
            <path d="M16 8.66667L0 8.66667L0 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
          </svg>
        </div>
      </button>

      {/* Fullscreen Overlay Container */}
      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu}></div>
          <nav
            className="menu-content"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>

              {/* Ambient Hover Background Shapes */}
              <div className="ambient-background-shapes">
                {/* Shape 1: Floating circles */}
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(184,150,62,0.25)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(107,143,113,0.2)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(184,150,62,0.15)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(31,58,46,0.3)" />
                </svg>

                {/* Shape 2: Wave pattern */}
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M0 200 Q100 100, 200 200 T 400 200"
                    stroke="rgba(184,150,62,0.25)"
                    strokeWidth="60"
                    fill="none"
                  />
                  <path
                    className="shape-element"
                    d="M0 280 Q100 180, 200 280 T 400 280"
                    stroke="rgba(107,143,113,0.2)"
                    strokeWidth="40"
                    fill="none"
                  />
                </svg>

                {/* Shape 3: Grid dots */}
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(184,150,62,0.4)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(107,143,113,0.4)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(184,150,62,0.4)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(107,143,113,0.4)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(184,150,62,0.3)" />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(107,143,113,0.3)" />
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(184,150,62,0.3)" />
                </svg>

                {/* Shape 4: Organic blobs */}
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                    fill="rgba(184,150,62,0.2)"
                  />
                </svg>

                {/* Shape 5: Diagonal lines */}
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(184,150,62,0.25)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(107,143,113,0.2)" strokeWidth="25" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                <li className="menu-list-item" data-shape="1">
                  <Link href="/about" onClick={closeMenu} className="nav-link font-bold text-cream hover:text-antique-gold transition-colors">
                    <span className="text-sm font-bold text-antique-gold tracking-widest font-mono">01</span>
                    <span className="nav-link-text font-bold">About Us</span>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="2">
                  <Link href="/gallery" onClick={closeMenu} className="nav-link font-bold text-cream hover:text-antique-gold transition-colors">
                    <span className="text-sm font-bold text-antique-gold tracking-widest font-mono">02</span>
                    <span className="nav-link-text font-bold">Clinical Results</span>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="3">
                  <Link href="/treatments" onClick={closeMenu} className="nav-link font-bold text-cream hover:text-antique-gold transition-colors">
                    <span className="text-sm font-bold text-antique-gold tracking-widest font-mono">03</span>
                    <span className="nav-link-text font-bold">Services & Facials</span>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="4">
                  <Link href="/booking" onClick={closeMenu} className="nav-link font-bold text-cream hover:text-antique-gold transition-colors">
                    <span className="text-sm font-bold text-antique-gold tracking-widest font-mono">04</span>
                    <span className="nav-link-text font-bold">Book Consultation</span>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="5">
                  <Link href="/contact" onClick={closeMenu} className="nav-link font-bold text-cream hover:text-antique-gold transition-colors">
                    <span className="text-sm font-bold text-antique-gold tracking-widest font-mono">05</span>
                    <span className="nav-link-text font-bold">Contact Clinic</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
