import Link from "next/link"
import Image from "next/image"
import { Sparkles, Heart } from "lucide-react"
import { getSettings } from "@/lib/store/content"
import { BagIllustration } from "@/components/store/BagIllustration"
import { TropicalLeaf } from "@/components/store/decorations/TropicalLeaf"
import { SparkleField } from "@/components/store/decorations/Sparkle"
import { GoldCorners } from "@/components/store/decorations/GoldCornerOrnament"

export async function HeroBanner() {
  const s = await getSettings()
  return (
    <section className="relative overflow-hidden">
      {/* Capa 1: gradiente base que ocupa toda la sección */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-light via-cream to-teal-light/60" />

      {/* Capa 2: estampado leopardo asomando POR LA IZQUIERDA, fundido con máscara */}
      <div
        className="absolute inset-0 bg-leopard"
        style={{
          maskImage:
            "linear-gradient(to right, black 0%, black 14%, transparent 42%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 14%, transparent 42%)",
        }}
        aria-hidden
      />

      {/* Capa 3: estampado zebra POR LA DERECHA, fundido */}
      <div
        className="absolute inset-0 bg-zebra-soft"
        style={{
          maskImage:
            "linear-gradient(to left, black 0%, black 14%, transparent 42%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 0%, black 14%, transparent 42%)",
        }}
        aria-hidden
      />

      {/* Sparkles dispersos */}
      <SparkleField
        items={[
          { top: "8%",  left: "26%",  size: 20, opacity: 0.85 },
          { top: "18%", left: "70%",  size: 24, opacity: 0.9 },
          { top: "55%", left: "30%",  size: 14, opacity: 0.7, color: "#F472B6" },
          { top: "75%", left: "65%",  size: 22, opacity: 0.85 },
          { top: "30%", right: "8%",  size: 16, opacity: 0.8 },
          { top: "60%", left: "12%",  size: 18, opacity: 0.7 },
          { top: "40%", left: "50%",  size: 12, opacity: 0.6 },
        ]}
      />

      {/* Hojas tropicales asomando */}
      <TropicalLeaf
        className="absolute -left-10 top-20 hidden md:block"
        rotate={-25}
        color="#10B981"
        size={220}
      />
      <TropicalLeaf
        className="absolute right-0 -bottom-12 hidden lg:block"
        rotate={210}
        color="#34D399"
        size={240}
      />
      <TropicalLeaf
        className="absolute -left-12 -bottom-16 hidden md:block"
        rotate={170}
        color="#2DD4BF"
        size={180}
      />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-12 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="text-center lg:text-left relative">
          {s.heroEyebrow && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 border border-gold/40 text-gold font-semibold text-xs tracking-[0.25em] uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              {s.heroEyebrow}
            </div>
          )}

          <h1 className="font-display font-black leading-[1.02] text-text-dark relative">
            <span className="block italic">{s.heroTitle}</span>
            <span className="block font-marker text-pink-primary drop-shadow-[0_3px_0_rgba(212,175,55,0.4)] relative">
              {s.heroHighlight}
              <Heart className="hidden sm:inline-block absolute -right-10 top-1 w-7 h-7 fill-pink-primary stroke-pink-deep -rotate-12" />
            </span>
          </h1>

          {s.heroSubtitle && (
            <p className="mt-5 font-script text-2xl sm:text-3xl text-pink-deep">
              {s.heroSubtitle}
            </p>
          )}

          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <Link
              href={s.heroCtaPrimaryUrl}
              className="btn-pill btn-pink shadow-[0_8px_24px_rgba(244,114,182,0.35)]"
            >
              {s.heroCtaPrimaryText}
              <Heart className="w-4 h-4 fill-current" />
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
            <div className="relative mx-auto max-w-md aspect-square rounded-3xl overflow-hidden gold-border shadow-[0_20px_40px_rgba(244,114,182,0.35)]">
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

          {/* Sticker LOVE BAGS estilo referente */}
          <div className="hidden sm:flex absolute -right-2 -top-2 lg:-right-6 lg:top-4 w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-pink-primary text-white flex-col items-center justify-center font-marker uppercase text-[10px] lg:text-xs gold-border rotate-12 shadow-lg leading-tight">
            <span>Love</span>
            <span>Bags</span>
          </div>

          <div className="absolute -inset-8 bg-gradient-to-tr from-pink-primary/20 via-transparent to-teal-primary/20 rounded-full blur-3xl -z-10" />
        </div>
      </div>

      {/* Esquinas doradas barrocas */}
      <GoldCorners size={64} />
    </section>
  )
}
