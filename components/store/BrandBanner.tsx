import Link from "next/link"
import { getSettings } from "@/lib/store/content"

export async function BrandBanner() {
  const s = await getSettings()
  // Soporta saltos de línea literales en el campo (\n).
  const titleLines = s.brandBannerTitle.split(/\n+/).filter(Boolean)

  return (
    <section className="relative overflow-hidden bg-leopard-teal py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-primary/40 via-teal-light/20 to-pink-light/30 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
        <div className="text-center lg:text-left">
          {s.brandBannerEyebrow && (
            <p className="font-script text-2xl text-pink-deep">
              {s.brandBannerEyebrow}
            </p>
          )}

          <h2 className="font-display italic !text-text-dark mt-2 text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            {titleLines.map((line, i) => {
              const isLast = i === titleLines.length - 1
              return (
                <span
                  key={i}
                  className={
                    isLast
                      ? "block font-marker not-italic uppercase text-pink-primary drop-shadow-[0_3px_0_rgba(212,175,55,0.4)]"
                      : "block"
                  }
                >
                  {line}
                </span>
              )
            })}
          </h2>

          {s.brandBannerText && (
            <p className="mt-6 max-w-md text-text-mid leading-relaxed mx-auto lg:mx-0">
              {s.brandBannerText}
            </p>
          )}

          {s.brandBannerCtaText && s.brandBannerCtaUrl && (
            <Link href={s.brandBannerCtaUrl} className="btn-pill btn-pink mt-8">
              {s.brandBannerCtaText}
            </Link>
          )}
        </div>

        {s.brandBannerBadge && (
          <div className="hidden lg:flex justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-full border-[3px] border-gold/70" />
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-pink-deep/60 animate-[spin_20s_linear_infinite]" />
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
