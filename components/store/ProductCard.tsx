import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Tag } from "lucide-react"
import type { CatalogItem } from "@/lib/store/products"
import { isNew } from "@/lib/store/products"

const FORMAT_EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})

export function ProductCard({ p }: { p: CatalogItem }) {
  const onSale = p.salePrice !== null && p.salePrice < p.price
  const soldOut = p.stock === 0
  const fresh = isNew(p.createdAt)
  const primary = p.images[0]
  const hover = p.images[1]
  const href = `/bolsos/${p.slug}`

  const badge =
    soldOut ? { label: "Agotado", className: "bg-text-dark text-white" } :
    onSale ? { label: "Oferta",  className: "bg-pink-deep text-white" } :
    fresh  ? { label: "Nuevo",   className: "bg-teal-primary text-white" } :
    null

  return (
    <article className="card-maraya group flex flex-col">
      <Link href={href} className="relative aspect-square overflow-hidden block">
        {primary ? (
          <Image
            src={primary}
            alt={p.name}
            fill
            sizes="(min-width:1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-pink-light text-pink-deep">
            <Tag className="w-10 h-10" />
          </div>
        )}
        {hover && (
          <Image
            src={hover}
            alt=""
            fill
            sizes="(min-width:1024px) 25vw, 50vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}

        {badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.className}`}
          >
            {badge.label}
          </span>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-display !text-text-dark text-base line-clamp-2 leading-snug">
          <Link href={href} className="hover:text-pink-deep transition">
            {p.name}
          </Link>
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          {onSale ? (
            <>
              <span className="font-bold text-pink-deep">
                {FORMAT_EUR.format(p.salePrice!)}
              </span>
              <span className="text-xs text-text-mid line-through">
                {FORMAT_EUR.format(p.price)}
              </span>
            </>
          ) : (
            <span className="font-bold text-text-dark">
              {FORMAT_EUR.format(p.price)}
            </span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-pink-light/60 flex items-center justify-between">
          {soldOut ? (
            <span className="text-xs text-text-mid italic">Agotado</span>
          ) : (
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-deep hover:text-pink-primary transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Ver detalle
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
