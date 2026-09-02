import Reveal from './Reveal';

/** Standard inner-page masthead aligned with dark luxury green & gold system. */
export default function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="bg-rich-black border-b border-sage/15 pt-32 pb-14 md:pt-40 md:pb-20 relative">
      <div className="shell">
        <Reveal>
          <p className="text-xs font-bold text-antique-gold uppercase tracking-[0.25em]">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-[1.1] text-cream sm:text-5xl md:text-6xl">{title}</h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-cream/80 sm:text-base">{intro}</p>
          )}
          <div className="rule-gold mt-8 max-w-32" />
        </Reveal>
      </div>
    </header>
  );
}
