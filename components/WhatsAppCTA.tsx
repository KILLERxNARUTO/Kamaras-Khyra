import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { site } from '@/data/site';
import { createWhatsAppLink, WhatsAppTemplates } from '@/lib/whatsapp';

interface FloatingWhatsAppProps {
  customMessage?: string;
  phoneNumber?: string;
  position?: 'bottom-right' | 'bottom-left';
}

/**
 * Floating WhatsApp trigger button with pulse effect
 */
export function FloatingWhatsAppButton({
  customMessage,
  phoneNumber,
  position = 'bottom-right',
}: FloatingWhatsAppProps) {
  const targetPhone = phoneNumber || site.phoneHref;
  const message = customMessage || WhatsAppTemplates.generalInquiry();
  const href = createWhatsAppLink(targetPhone, message);

  const posClass = position === 'bottom-right' ? 'right-6 bottom-20 md:bottom-8' : 'left-6 bottom-20 md:bottom-8';

  return (
    <div className={`fixed ${posClass} z-50 flex items-center group`}>
      {/* Tooltip on hover */}
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 bg-[#14140f] text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-white/10">
        Chat with Dr. Nazreen on WhatsApp
      </span>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25d366] text-white rounded-full shadow-xl hover:bg-[#20ba59] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#25d366]/40"
      >
        <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-25 pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-current stroke-white" />
      </Link>
    </div>
  );
}

/**
 * Sticky bottom mobile action bar for high conversion
 */
export function MobileWhatsAppActionBar({
  phoneNumber,
  treatmentName,
}: {
  phoneNumber?: string;
  treatmentName?: string;
}) {
  const targetPhone = phoneNumber || site.phoneHref;
  const message = treatmentName
    ? WhatsAppTemplates.serviceDetails(treatmentName)
    : WhatsAppTemplates.generalInquiry();
  const whatsappUrl = createWhatsAppLink(targetPhone, message);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#14140f]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
      <div className="flex flex-col">
        <span className="text-xs text-[#8b968f] font-medium">Need consultation advice?</span>
        <span className="text-sm text-white font-semibold tracking-tight">Talk to our clinical team</span>
      </div>
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 bg-[#25d366] text-white font-semibold text-xs tracking-wider uppercase rounded-md shadow-md active:scale-95 transition-transform"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span>Chat Now</span>
      </Link>
    </div>
  );
}
