import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 max-w-xl font-serif text-4xl leading-[1.1] sm:text-5xl">
        This page has stepped out
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-near-black/70">
        The page you were looking for is not here. The treatment menu is a good place to pick
        things back up.
      </p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Link
          href="/treatments"
          className="rounded-full bg-antique-gold px-8 py-3.5 text-sm font-medium text-near-black transition-colors duration-200 hover:bg-near-black hover:text-antique-gold"
        >
          View treatments
        </Link>
        <Link
          href="/"
          className="rounded-full border border-forest-green px-8 py-3.5 text-sm text-forest-green transition-colors duration-200 hover:bg-forest-green hover:text-cream"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
