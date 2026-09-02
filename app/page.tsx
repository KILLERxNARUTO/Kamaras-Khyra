import HeroCarousel from '@/components/HeroCarousel';
import TrustPillars from '@/components/TrustPillars';
import Marquee from '@/components/Marquee';
import FeaturedTreatments from '@/components/FeaturedTreatments';
import StickyScrollSequence from '@/components/StickyScrollSequence';
import SkinFinder from '@/components/SkinFinder';
import SessionSteps from '@/components/SessionSteps';
import PhilosophySection from '@/components/PhilosophySection';
import ReviewWall from '@/components/ReviewWall';
import { featuredTreatments } from '@/data/treatments';

/**
 * Section order alternates ground colour (cream / off-white / forest green) so the page
 * reads as bands, and keeps every piece of skin photography — the carousel cards — on cream or off-white.
 */
export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <TrustPillars />
      <Marquee />
      <FeaturedTreatments treatments={featuredTreatments} />
      <StickyScrollSequence />
      <SkinFinder />
      <SessionSteps />
      <PhilosophySection />
      <ReviewWall />
    </>
  );
}
