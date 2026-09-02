import Link from 'next/link';
import { beforeAfterPreview } from '@/data/site';
import BeforeAfterSlider from './BeforeAfterSlider';
import Reveal from './Reveal';

export default function BeforeAfterPreview() {
  return (
    /* Off-white ground — DESIGN RULE: before/after skin photography must never sit on
       dark/black backgrounds. Dark surrounds distort perceived skin tone. */
    <section className="bg-[#1a2e22] py-20 md:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Results</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-cream sm:text-4xl">
            Skin that looks like itself, only stronger
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/65">
            Every result shown here is a Kamars Khyra client, photographed in the clinic and
            published only with their written consent. Drag to compare.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beforeAfterPreview.slice(0, 6).map((pair, i) => (
            <Reveal key={pair.id} delay={(i % 3) * 0.12}>
              <BeforeAfterSlider
                before={pair.before}
                after={pair.after}
                label={`Result ${i + 1}`}
                className="aspect-[4/5] w-full rounded-sm"
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-block rounded-full bg-antique-gold px-8 py-3.5 text-sm font-medium text-near-black transition-colors duration-200 hover:bg-gold-light"
          >
            See the full gallery
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
