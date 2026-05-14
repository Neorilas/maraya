import { Star } from "lucide-react"
import { getActiveTestimonials } from "@/lib/store/content"
import { JsonLd, reviewJsonLd } from "@/lib/store/jsonld"

export async function TestimonialsSection() {
  const testimonials = await getActiveTestimonials()
  if (testimonials.length === 0) return null

  const jsonLd = reviewJsonLd(testimonials)

  return (
    <section className="bg-cream py-14 sm:py-20">
      {jsonLd && <JsonLd data={jsonLd} />}
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display italic text-3xl sm:text-4xl text-center !text-text-dark mb-2">
          Lo que dicen nuestras clientas
        </h2>
        <p className="text-center text-text-mid text-sm mb-10">
          Reseñas reales de quienes ya llevan un Maraya
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-pink-light/60 flex flex-col gap-3"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < t.rating
                        ? "fill-gold text-gold"
                        : "fill-pink-light text-pink-light"
                    }`}
                  />
                ))}
              </div>

              <blockquote className="text-text-dark text-sm leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              <footer className="flex items-center justify-between pt-2 border-t border-pink-light/40">
                <span className="font-semibold text-sm text-text-dark">
                  {t.author}
                </span>
                {t.source && (
                  <span className="text-xs text-text-mid">
                    {t.sourceUrl ? (
                      <a
                        href={t.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-pink-deep transition"
                      >
                        {t.source}
                      </a>
                    ) : (
                      t.source
                    )}
                  </span>
                )}
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
