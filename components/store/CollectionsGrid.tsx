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
          <h2 className="font-display italic mt-1">Nuestras colecciones</h2>
          <div className="divider-heart">
            <span aria-hidden>♡</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((c) => (
            <CollectionCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CollectionCard({ c }: { c: HomeCollectionRow }) {
  const href = c.href ?? `/bolsos?cat=${c.slug}`
  return (
    <Link
      href={href}
      className="group card-maraya gold-border relative aspect-[3/4] overflow-hidden block"
    >
      {c.imageUrl ? (
        <Image
          src={c.imageUrl}
          alt={c.name}
          fill
          sizes="(min-width:1024px) 25vw, 50vw"
          className="object-cover"
        />
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} />
          <div className="absolute inset-0 bg-leopard opacity-15 mix-blend-overlay" />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
        {c.tag && (
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-90 font-bold">
            {c.tag}
          </span>
        )}
        <h3 className="font-display italic !text-white mt-1 text-2xl sm:text-3xl leading-tight">
          {c.name}
        </h3>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold opacity-95 group-hover:gap-2 transition-all">
          Ver colección <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}
