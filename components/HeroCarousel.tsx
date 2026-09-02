'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

interface SlideData {
  id: number;
  leftTitle: string;
  rightTitle: string;
  leftImage: string;
  rightImage: string;
  centerVideo: string;
  centerPoster: string;
  treatmentSlug: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    leftTitle: 'Aqua 360',
    rightTitle: 'Hydra Facial',
    leftImage: '/assets/treatments/Aqua 360 hydra facial explaination.jpeg',
    rightImage: '/assets/treatments/Teen glow HydraFacial explaination.jpeg',
    centerVideo: 'https://nymphaicosmetics.com/cdn/shop/t/2/assets/vecchia.mp4',
    centerPoster: '/assets/before-after/before-after-1-after.jpg',
    treatmentSlug: 'aqua-360-medi-hydra-facial',
  },
  {
    id: 2,
    leftTitle: 'Radiance',
    rightTitle: 'Glow Facial',
    leftImage: '/assets/treatments/Radiance glow HydraFacial explaination.jpeg',
    rightImage: '/assets/treatments/Teen glow HydraFacial explaination.jpeg',
    centerVideo: 'https://nymphaicosmetics.com/cdn/shop/t/2/assets/biondina.mp4',
    centerPoster: '/assets/before-after/before-after-2-after.jpg',
    treatmentSlug: 'radiance-glow-medi-hydra-facial',
  },
  {
    id: 3,
    leftTitle: 'Collagen',
    rightTitle: 'Boost Facial',
    leftImage: '/assets/treatments/Collagen.jpg',
    rightImage: '/assets/treatments/Collagen.jpg',
    centerVideo: 'https://nymphaicosmetics.com/cdn/shop/t/2/assets/vecchia.mp4',
    centerPoster: '/assets/before-after/before-after-3-after.jpg',
    treatmentSlug: 'collagen-boost-medi-hydra-facial',
  },
];

export default function HeroCarousel() {
  const [slideIndex, setSlideIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.33) setSlideIndex(0);
    else if (latest < 0.66) setSlideIndex(1);
    else setSlideIndex(2);
  });

  const currentSlide = slides[slideIndex];

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-[#060e0a]">
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden select-none">

        {/* ── MOBILE: Single full-width image ──────────────────────── */}
        <div className="absolute inset-0 md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img
                src={currentSlide.rightImage}
                alt={currentSlide.leftTitle}
                className="w-full h-full object-cover opacity-55 filter saturate-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#060e0a]/50 via-[#060e0a]/20 to-[#060e0a]/85" />
            </motion.div>
          </AnimatePresence>

          {/* Mobile title — bottom left */}
          <div className="absolute bottom-28 left-5 right-5 z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <h1 className="font-sans font-light text-[clamp(3rem,16vw,6rem)] text-cream tracking-tight leading-[1.1] pb-1">
                  {currentSlide.leftTitle}
                </h1>
                <h2 className="font-sans font-light text-[clamp(2rem,10vw,4rem)] text-cream/70 tracking-tight leading-[1.1]">
                  {currentSlide.rightTitle}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Explore link */}
          <div className="absolute bottom-10 left-5 z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link
                  href={`/treatments/${currentSlide.treatmentSlug}`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.3em] text-antique-gold uppercase"
                >
                  <span>EXPLORE SERVICE</span>
                  <span className="text-sm leading-none">↗</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile slide dots */}
          <div className="absolute bottom-10 right-5 z-20 flex gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-400 ${i === slideIndex ? 'w-6 bg-antique-gold' : 'w-2 bg-cream/40'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ── DESKTOP: Split left/right layout ─────────────────────── */}
        {/* LEFT CONTAINER */}
        <div className="absolute inset-y-0 left-0 hidden md:block md:w-1/2 overflow-hidden border-r border-antique-gold/20">
          <div className="relative w-full h-full">
            <img
              src={currentSlide.leftImage}
              alt={currentSlide.leftTitle}
              className="w-full h-full object-cover opacity-60 filter saturate-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060e0a]/70 via-[#060e0a]/30 to-[#060e0a]/80" />

            <div className="absolute top-24 left-8 sm:top-32 sm:left-14 md:top-36 md:left-20 z-20 py-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, x: 90 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -90 }}
                  transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <h1 className="font-sans font-light text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] text-cream tracking-tight leading-[1.15] pb-3 drop-shadow-sm">
                    {currentSlide.leftTitle}
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT CONTAINER */}
        <div className="absolute inset-y-0 right-0 hidden md:block md:w-1/2 overflow-hidden">
          <div className="relative w-full h-full">
            <img
              src={currentSlide.rightImage}
              alt={currentSlide.rightTitle}
              className="w-full h-full object-cover opacity-60 filter saturate-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e0a]/80 via-[#060e0a]/30 to-[#060e0a]/60" />

            <div className="absolute bottom-20 right-12 md:bottom-24 md:right-20 z-20 text-right py-2 flex flex-col items-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, x: -90 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 90 }}
                  transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                  className="flex flex-col items-end"
                >
                  <h2 className="font-sans font-light text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] text-cream tracking-tight leading-[1.15] pb-3 drop-shadow-sm">
                    {currentSlide.rightTitle}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── CENTER FOCAL (desktop only) ─── */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <div className="w-[110px] sm:w-[130px] md:w-[140px] h-[110px] sm:h-[130px] md:h-[140px] rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-[0_8px_35px_rgba(0,0,0,0.85)] border border-antique-gold/40">
                <video
                  key={currentSlide.centerVideo}
                  src={currentSlide.centerVideo}
                  poster={currentSlide.centerPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              <Link
                href={`/treatments/${currentSlide.treatmentSlug}`}
                className="mt-3 group/btn inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium tracking-[0.3em] text-cream hover:text-antique-gold transition-colors uppercase"
              >
                <span>EXPLORE</span>
                <span className="text-sm leading-none transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-antique-gold">
                  ↗
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
