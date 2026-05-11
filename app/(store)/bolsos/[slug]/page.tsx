import Link from "next/link"
import { notFound } from "next/navigation"
import { Tag, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import { getProductBySlug, getRelatedProducts } from "@/lib/store/products"
import { getSettings } from "@/lib/store/content"
import { ProductGallery } from "@/components/store/ProductGallery"
import { ShareButtons } from "@/components/store/ShareButtons"
import { AddToCartButton } from "@/components/store/AddToCartButton"
import { ProductCard } from "@/components/store/ProductCard"

const FORMAT_EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const p = await getProductBySlug(slug)
  if (!p) return { title: "Bolso no encontrado · Maraya" }
  return {
    title: `${p.name} · Maraya Store`,
    description: p.description.slice(0, 160),
    openGraph: {
      title: p.name,
      description: p.description.slice(0, 160),
      images: p.images.length > 0 ? [{ url: p.images[0] }] : undefined,
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const p = await getProductBySlug(slug)
  if (!p || !p.isActive) notFound()

  const [related, settings] = await Promise.all([
    getRelatedProducts(p.id, p.category),
    getSettings(),
  ])

  const onSale = p.salePrice !== null && p.salePrice < p.price
  const unitPrice = onSale ? p.salePrice! : p.price
  const productUrl = `${process.env.NEXT_PUBLIC_URL ?? ""}/bolsos/${p.slug}`

  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-5 sm:py-8 lg:py-12">
        <Breadcrumbs name={p.name} category={p.category} />

        <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <ProductGallery images={p.images} imagesAlt={p.imagesAlt} alt={p.name} />

          <div className="space-y-4 sm:space-y-5">
            <header>
              <p className="text-xs font-mono text-text-mid">SKU {p.sku}</p>
              <h1 className="font-display italic !text-text-dark mt-1 text-2xl sm:text-3xl lg:text-4xl">
                {p.name}
              </h1>
            </header>

            <PriceBlock price={p.price} salePrice={p.salePrice} />

            <p className="text-text-dark leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {p.description}
            </p>

            <div className="border-t border-pink-light pt-4 sm:pt-5 space-y-4">
              {p.stock > 0 ? (
                <AddToCartButton
                  full
                  showBuyNow
                  item={{
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    unitPrice,
                    image: p.images[0] ?? null,
                    stockAtAdd: p.stock,
                  }}
                />
              ) : (
                <div className="rounded-2xl bg-text-dark text-white text-center py-3 px-4 font-bold uppercase tracking-wider text-sm">
                  Agotado
                </div>
              )}

              <ShareButtons productName={p.name} productUrl={productUrl} />
            </div>

            <ProductPerks whatsapp={settings.whatsappNumber} />
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h2 className="font-display italic !text-text-dark text-xl sm:text-2xl text-center">
              También te puede gustar
            </h2>
            <div className="divider-heart my-4 sm:my-6">
              <span aria-hidden>♡</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {related.map((r) => (
                <ProductCard
                  key={r.id}
                  p={{
                    ...r,
                    category: null,
                    isFeatured: false,
                    createdAt: new Date(),
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function Breadcrumbs({ name, category }: { name: string; category: string | null }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-text-mid">
      <Link href="/" className="hover:text-pink-deep">Inicio</Link>
      <span aria-hidden>›</span>
      <Link href="/bolsos" className="hover:text-pink-deep">Bolsos</Link>
      {category && (
        <>
          <span aria-hidden>›</span>
          <Link
            href={`/bolsos?cat=${category}`}
            className="hover:text-pink-deep capitalize"
          >
            {category.replace(/-/g, " ")}
          </Link>
        </>
      )}
      <span aria-hidden>›</span>
      <span className="text-text-dark font-semibold truncate max-w-[12rem]">{name}</span>
    </nav>
  )
}

function PriceBlock({ price, salePrice }: { price: number; salePrice: number | null }) {
  const onSale = salePrice !== null && salePrice < price
  if (onSale) {
    const off = Math.round(((price - salePrice!) / price) * 100)
    return (
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display italic text-3xl text-pink-deep">
          {FORMAT_EUR.format(salePrice!)}
        </span>
        <span className="text-base text-text-mid line-through">
          {FORMAT_EUR.format(price)}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-pink-deep text-white text-xs font-bold">
          -{off}%
        </span>
      </div>
    )
  }
  return (
    <span className="font-display italic text-3xl !text-text-dark">
      {FORMAT_EUR.format(price)}
    </span>
  )
}

function ProductPerks({ whatsapp }: { whatsapp: string | null }) {
  return (
    <div className="card-maraya p-4 space-y-2.5 text-sm">
      <Perk icon={Truck} text="Envío en 24/48 h en España peninsular" />
      <Perk icon={ShieldCheck} text="Pago seguro · datos cifrados" />
      <Perk icon={RotateCcw} text="Devoluciones gratuitas hasta 30 días" />
      {whatsapp && (
        <Perk
          icon={Tag}
          text={
            <>
              ¿Dudas? Escríbenos por{" "}
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-pink-deep hover:underline"
              >
                WhatsApp
              </a>
            </>
          }
        />
      )}
    </div>
  )
}

function Perk({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>
  text: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5 text-text-dark">
      <Icon className="w-4 h-4 text-pink-deep shrink-0 mt-0.5" />
      <span>{text}</span>
    </div>
  )
}
