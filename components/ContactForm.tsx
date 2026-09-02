'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { site } from '@/data/site';

/**
 * Contact form with WhatsApp deep link integration.
 */
export default function ContactForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const text = encodeURIComponent(
    `Hello ${site.name}, my name is ${name || '—'}.\n\n${message}`.trim(),
  );
  const href = `https://wa.me/${site.phoneHref.replace(/\D/g, '')}?text=${text}`;
  const ready = name.trim().length > 1 && message.trim().length > 4;

  return (
    <form className="max-w-lg" onSubmit={(e) => e.preventDefault()}>
      <label className="block">
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-antique-gold font-bold">
          Your Name
        </span>
        <input
          type="text"
          value={name}
          placeholder="Enter your full name"
          autoComplete="name"
          onChange={(e) => setName(e.target.value)}
          className="mt-2.5 w-full rounded-sm border border-sage/30 bg-forest-green/80 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-antique-gold"
        />
      </label>

      <label className="mt-6 block">
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-antique-gold font-bold">
          Your Message
        </span>
        <textarea
          rows={5}
          value={message}
          placeholder="Tell us about your skin concern or preferred appointment time"
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2.5 w-full rounded-sm border border-sage/30 bg-forest-green/80 px-4 py-3 text-sm text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-antique-gold"
        />
      </label>

      <a
        href={ready ? href : undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!ready}
        className={`mt-7 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-colors duration-200 ${
          ready
            ? 'bg-antique-gold text-near-black hover:bg-gold-light'
            : 'pointer-events-none bg-sage/20 text-cream/40'
        }`}
      >
        <MessageCircle className="h-4 w-4" />
        Send on WhatsApp
      </a>

      <p className="mt-4 text-xs leading-relaxed text-cream/60">
        Opens WhatsApp with your message ready to send to {site.phone}. Prefer to call? Reach the clinic directly.
      </p>
    </form>
  );
}
