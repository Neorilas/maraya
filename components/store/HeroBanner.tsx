import Link from "next/link"
import Image from "next/image"
import { Sparkles } from "lucide-react"
import { getSettings } from "@/lib/store/content"
import { BagIllustration } from "@/components/store/BagIllustration"

export async function HeroBanner() {
  const s = await getSettings()
  return (
    <section className="relative overflow-hidden bg-leopard">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-light/80 via-cream/60 to-teal-light/40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-16 sm:py-24 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          {s.heroEyebrow && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gold/40 text-gold font-semibold text-xs tracking-[0.25em] uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {s.heroEyebrow}
            </div>
          )}

          <h1 className="font-display font-black leading-[1.02] text-text-dark">
            <span className="block italic">{s.heroTitle}</span>
            <span className="block font-marker text-pink-primary drop-shadow-[0_3px_0_rgba(212,175,55,0.35)]">
              {s.heroHighlight}
            </span>
          </h1>

          {s.heroSubtitle && (
            <p className="mt-6 font-script text-2xl sm:text-3xl text-pink-deep">
              {s.heroSubtitle}
            </p>
          )}

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href={s.heroCtaPrimaryUrl} className="btn-pill btn-teal">
              {s.heroCtaPrimaryText}
              <span aria-hidden>💛</span>
            </Link>
            {s.heroCtaSecondaryText && s.heroCtaSecondaryUrl && (
              <Link
                href={s.heroCtaSecondaryUrl}
                className="btn-pill bg-white text-text-dark gold-border hover:bg-gold-light"
              >
                {s.heroCtaSecondaryText}
              </Link>
            )}
          </div>
        </div>

        <div className="relative">
          {s.heroImageUrl ? (
            <div className="relative mx-auto max-w-md aspect-square rounded-2xl overflow-hidden gold-border shadow-[0_20px_40px_rgba(244,114,182,0.35)]">
              <Image
                src={s.heroImageUrl}
                alt={s.heroTitle}
                fill
                priority
                sizes="(min-width:1024px) 32rem, 90vw"
                className="object-cover"
              />
            </div>
          ) : (
            <BagIllustration />
          )}
          <div className="absolute -inset-8 bg-gradient-to-tr from-pink-primary/30 via-transparent to-teal-primary/20 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </section>
  )
}
