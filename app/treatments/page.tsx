import type { Metadata } from 'next';
import TreatmentsGrid from '@/components/TreatmentsGrid';
import { treatments } from '@/data/treatments';

export const metadata: Metadata = {
  title: 'Treatments',
  description:
    'Doctor-assisted, 100% vegan medi-facials — hydration, acne, pigmentation, barrier repair and anti-ageing treatments at Kamars Khyra, Chennai.',
};

export default function TreatmentsPage() {
  return <TreatmentsGrid treatments={treatments} />;
}
