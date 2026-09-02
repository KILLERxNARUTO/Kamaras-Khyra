import type { Metadata } from 'next';
import BookingStepper from '@/components/BookingStepper';

export const metadata: Metadata = {
  title: 'Book an appointment',
  description:
    'Choose a date and time for your doctor-assisted medi-facial at Kamars Khyra, Poonamallee, Chennai.',
};

export default function BookingPage() {
  return <BookingStepper />;
}
