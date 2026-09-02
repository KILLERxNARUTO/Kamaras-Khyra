import { Star } from 'lucide-react';
import { reviews, reviewSummary } from '@/data/reviews';
import { getTreatment } from '@/data/treatments';
import { site } from '@/data/site';
import Reveal from './Reveal';

/**
 * In Their Words — Client reviews wall.
 */
export default function ReviewWall() {
  const summary = reviewSummary();

  return (
    <section className="bg-rich-black py-20 md:py-28 border-t border-sage/15">
      <div className="shell">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow text-antique-gold">In Their Words</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-cream sm:text-4xl">
              What clients say afterwards
            </h2>
          </div>

          {summary && (
            <div className="flex items-center gap-3 bg-forest-green/80 border border-antique-gold/30 px-4 py-2 rounded-full">
              <div className="flex gap-1" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(summary.average)
                        ? 'fill-antique-gold text-antique-gold'
                        : 'text-sage/40'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-cream">
                {summary.average} / 5.0 ({summary.count} Verified Reviews)
              </p>
            </div>
          )}
        </Reveal>

        {reviews.length === 0 ? (
          <Reveal delay={0.1} className="mt-12">
            <div className="border border-dashed border-sage/40 bg-forest-green px-8 py-14 text-center rounded-sm">
              <p className="font-serif text-xl text-cream font-bold">No reviews published yet</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/80">
                We publish reviews only from clients who have been treated here and have given
                permission to share them. If you have visited us, we would like to hear from you.
              </p>
              <a
                href={`tel:${site.phoneHref}`}
                className="mt-7 inline-block rounded-full border border-antique-gold bg-antique-gold px-7 py-3 text-sm font-bold text-near-black transition-colors hover:bg-gold-light"
              >
                Talk to the clinic
              </a>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={`${review.author}-${review.date}`} delay={(i % 3) * 0.1}>
                <figure className="flex h-full flex-col bg-forest-green p-7 rounded-sm border border-sage/20 hover:border-antique-gold/40 transition-colors">
                  <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star
                        key={s}
                        aria-hidden
                        className={`h-4 w-4 ${
                          s < review.rating
                            ? 'fill-antique-gold text-antique-gold'
                            : 'text-sage/40'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-cream/90 font-sans">
                    “{review.body}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-sage/20 pt-4 text-xs flex flex-col gap-0.5">
                    <span className="font-bold text-antique-gold">{review.author}</span>
                    {review.treatment && (
                      <span className="text-cream/60">
                        {getTreatment(review.treatment)?.name ?? review.treatment}
                      </span>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
