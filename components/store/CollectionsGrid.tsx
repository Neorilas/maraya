import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Tag } from "lucide-react"
import { getActiveHomeCollections, type HomeCollectionRow } from "@/lib/store/content"

export async function CollectionsGrid() {
  const collections = await getActiveHomeCollections()
  if (collections.length === 0) return null

  return (
    <section className="relative bg-leopard py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/80 to-cream/95 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-center mb-10 sm:mb-14">
          <span className="font-script text-3xl text-pink-primary block">
            Descubre
          </span>
          <h2 className="font-marker !text-text-dark mt-2 text-3xl sm:text-4xl uppercase">
            Nuestras colecciones
          </h2>
          <div className="divider-heart">
            <span aria-hidden>♡</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {collections.map((c) => (
            <CollectionCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Card de colección. La imagen vive DENTRO del hueco transparente del marco
 * dorado (`marco.png`); el marco se superpone arriba con `pointer-events-none`.
 *
 * Aspect ratio del marco original: 600×900 = 2/3.
 * Hueco interior aproximado: insets ~7% verticales · ~10% horizontales.
 */
function CollectionCard({ c }: { c: HomeCollectionRow }) {
  const href = c.href ?? `/bolsos?cat=${c.slug}`
  return (
    <Link
      href={href}
      aria-label={`Ver colección ${c.name}`}
      className="group relative aspect-[2/3] block transition-transform hover:-translate-y-1"
    >
      {/* Imagen / gradiente DENTRO del hueco del marco */}
      <div className="absolute inset-y-[7%] inset-x-[10%] overflow-hidden rounded-sm">
        {c.imageUrl ? (
          <Image
            src={c.imageUrl}
            alt=""
            fill
            sizes="(min-width:1024px) 22vw, 45vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderArt gradient={c.gradient} />
        )}

        {/* Tinte para que el texto se lea sobre cualquier imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 text-white">
          {c.tag && (
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase opacity-95 font-bold drop-shadow">
              {c.tag}
            </span>
          )}
          <h3 className="font-marker !text-white mt-1 text-base sm:text-lg lg:text-xl uppercase leading-tight drop-shadow-md">
            {c.name}
          </h3>
          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-95 group-hover:gap-2 transition-all">
            Ver <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Marco dorado encima — fondo y centro transparentes; rodea la imagen */}
      <Image
        src="/marco.png"
        alt=""
        fill
        sizes="(min-width:1024px) 25vw, 50vw"
        className="object-contain pointer-events-none drop-shadow-[0_8px_18px_rgba(212,175,55,0.45)]"
        priority={false}
      />
    </Link>
  )
}

function PlaceholderArt({ gradient }: { gradient: string }) {
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-leopard opacity-25 mix-blend-overlay" />
      <div className="absolute inset-0 flex items-center justify-center text-white/40">
        <Tag className="w-12 h-12" />
      </div>
    </>
  )
}
