import Link from "next/link"
import { Heart } from "lucide-react"
import { getSettings } from "@/lib/store/content"
import { Sparkle } from "@/components/store/decorations/Sparkle"

export async function BrandBanner() {
  const s = await getSettings()
  const titleLines = s.brandBannerTitle.split(/\n+/).filter(Boolean)

  return (
    <section className="relative overflow-hidden bg-leopard-teal py-16 sm:py-24">
      {/* Banda leopardo arriba — fundida hacia el centro con máscara */}
      <div
        className="absolute top-0 inset-x-0 h-20 sm:h-28 bg-leopard"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* Banda leopardo abajo — fundida hacia arriba */}
      <div
        className="absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-leopard"
        style={{
          maskImage:
            "linear-gradient(to top, black 0%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, black 35%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Tinte central — sin sparkles dispersos para que la sección respire */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-primary/25 via-teal-light/15 to-pink-light/30 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
        <div className="text-center lg:text-left">
          {s.brandBannerEyebrow && (
            <p className="font-script text-2xl text-pink-deep flex items-center gap-2 justify-center lg:justify-start">
              <Sparkle size={14} color="#D4AF37" />
              <span>{s.brandBannerEyebrow}</span>
            </p>
          )}

          <h2 className="font-display italic !text-text-dark mt-2 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] relative">
            {titleLines.map((line, i) => {
              const isLast = i === titleLines.length - 1
              return (
                <span
                  key={i}
                  className={
                    isLast
                      ? "block font-marker not-italic uppercase text-pink-primary drop-shadow-[0_3px_0_rgba(212,175,55,0.4)] relative"
                      : "block"
                  }
                >
                  {line}
                  {/* Sparkle dorado al final de la última línea */}
                  {isLast && (
                    <span className="absolute -top-2 -right-2 sm:-right-4">
                      <Sparkle size={20} color="#D4AF37" />
                    </span>
                  )}
                </span>
              )
            })}
          </h2>

          {s.brandBannerText && (
            <p className="mt-5 max-w-md text-text-dark/80 leading-relaxed mx-auto lg:mx-0 flex items-center justify-center lg:justify-start gap-2">
              <Heart className="w-3.5 h-3.5 fill-pink-primary stroke-none shrink-0" />
              <span>{s.brandBannerText}</span>
              <Heart className="w-3.5 h-3.5 fill-pink-primary stroke-none shrink-0" />
            </p>
          )}

          {s.brandBannerCtaText && s.brandBannerCtaUrl && (
            <Link
              href={s.brandBannerCtaUrl}
              className="btn-pill btn-pink mt-8 shadow-[0_8px_24px_rgba(244,114,182,0.35)]"
            >
              {s.brandBannerCtaText}
              <Heart className="w-4 h-4 fill-current" />
            </Link>
          )}
        </div>

        {s.brandBannerBadge && (
          <div className="hidden lg:flex justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-full border-[3px] border-gold/70 shadow-[0_8px_24px_rgba(212,175,55,0.3)]" />
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-pink-deep/60 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full bg-cream/80 backdrop-blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <span className="font-script text-3xl text-pink-deep leading-tight whitespace-pre-line">
                  {s.brandBannerBadge.replace(" en ", " en\n")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
