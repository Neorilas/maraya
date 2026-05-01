import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {collections.map((c) => (
            <CollectionCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Cada card de colección va dentro del marco `marco.avif`. La imagen/gradient
 * de la categoría queda ENMARCADA: el marco es la PNG/AVIF transparente que
 * se superpone, la cara visual está dentro con padding.
 */
function CollectionCard({ c }: { c: HomeCollectionRow }) {
  const href = c.href ?? `/bolsos?cat=${c.slug}`
  return (
    <Link
      href={href}
      aria-label={`Ver colección ${c.name}`}
      className="group relative aspect-[3/4] block transition-transform hover:-translate-y-1"
    >
      {/* Cara visual interna (un pelín más pequeña que el marco) */}
      <div className="absolute inset-[8%] rounded-xl overflow-hidden">
        {c.imageUrl ? (
          <Image
            src={c.imageUrl}
            alt=""
            fill
            sizes="(min-width:1024px) 22vw, 45vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} />
            <div className="absolute inset-0 bg-leopard opacity-20 mix-blend-overlay" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 text-white">
          {c.tag && (
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase opacity-90 font-bold">
              {c.tag}
            </span>
          )}
          <h3 className="font-marker !text-white mt-1 text-lg sm:text-xl uppercase leading-tight drop-shadow-md">
            {c.name}
          </h3>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider opacity-95 group-hover:gap-2 transition-all">
            Ver <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Marco decorativo encima (no captura clicks) */}
      <Image
        src="/marco.avif"
        alt=""
        fill
        sizes="(min-width:1024px) 25vw, 50vw"
        className="object-contain pointer-events-none drop-shadow-[0_4px_10px_rgba(212,175,55,0.35)]"
        priority={false}
      />
    </Link>
  )
}
