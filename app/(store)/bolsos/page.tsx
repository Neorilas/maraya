import { Search } from "lucide-react"
import type { Metadata } from "next"
import { getCatalog } from "@/lib/store/products"
import { getActiveHomeCollections } from "@/lib/store/content"
import { ProductCard } from "@/components/store/ProductCard"
import { CatalogFilters } from "@/components/store/CatalogFilters"
import { JsonLd, breadcrumbJsonLd } from "@/lib/store/jsonld"

export const dynamic = "force-dynamic"

type SP = { q?: string; cat?: string; filter?: string; sort?: "newest" | "price-asc" | "price-desc" }

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>
}): Promise<Metadata> {
  const sp = await searchParams
  const title = metaTitleFor(sp)
  const description = metaDescFor(sp)
  const canonical = sp.cat ? `/bolsos?cat=${sp.cat}` : "/bolsos"
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical },
  }
}

function metaTitleFor(sp: SP): string {
  if (sp.filter === "new") return "Novedades"
  if (sp.filter === "top") return "Best sellers"
  if (sp.filter === "sale") return "Ofertas"
  if (sp.cat) return `Bolsos ${sp.cat.replace(/-/g, " ")}`
  if (sp.q) return `Búsqueda: ${sp.q}`
  return "Bolsos"
}

function metaDescFor(sp: SP): string {
  if (sp.filter === "new") return "Las últimas incorporaciones a la colección Maraya. Bolsos artesanales recién llegados."
  if (sp.filter === "top") return "Los bolsos más vendidos de Maraya. Descubre los favoritos de nuestras clientas."
  if (sp.filter === "sale") return "Bolsos Maraya en oferta. Aprovecha nuestras promociones en piezas artesanales."
  if (sp.cat) return `Descubre nuestra colección de bolsos ${sp.cat.replace(/-/g, " ")}. Piezas artesanales únicas de Maraya.`
  return "Catálogo completo de bolsos artesanales Maraya. Piezas únicas en piel y tejido, hechas con mimo."
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SP>
}) {
  const sp = await searchParams
  const [products, collections] = await Promise.all([
    getCatalog(sp),
    getActiveHomeCollections(),
  ])

  const categoryOptions = collections.map((c) => ({
    slug: c.slug,
    label: c.name,
  }))

  const heading = headingFor(sp)

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Bolsos", url: "/bolsos" },
    ...(sp.cat
      ? [{ name: sp.cat.replace(/-/g, " "), url: `/bolsos?cat=${sp.cat}` }]
      : []),
  ]

  return (
    <div className="bg-cream/40">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-14">
        <header className="text-center mb-6 sm:mb-10">
          <span className="font-script text-xl sm:text-2xl text-pink-primary block">
            Colección
          </span>
          <h1 className="font-display italic !text-text-dark text-2xl sm:text-3xl lg:text-4xl">
            {heading}
          </h1>
          <div className="divider-heart my-3 sm:my-6">
            <span aria-hidden>♡</span>
          </div>
          <p className="text-xs sm:text-sm text-text-mid">
            {products.length} bolso{products.length === 1 ? "" : "s"} disponible{products.length === 1 ? "" : "s"}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-6 lg:gap-8">
          <CatalogFilters categories={categoryOptions} active={sp} />

          <div>
            {products.length === 0 ? <EmptyState q={sp.q} /> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
                {products.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function headingFor(sp: SP): string {
  if (sp.filter === "new") return "Novedades"
  if (sp.filter === "top") return "Best sellers"
  if (sp.filter === "sale") return "Ofertas"
  if (sp.cat) return sp.cat.replace(/-/g, " ")
  if (sp.q)  return `"${sp.q}"`
  return "Todos los bolsos"
}

function EmptyState({ q }: { q?: string }) {
  return (
    <div className="card-maraya p-12 text-center">
      <Search className="w-10 h-10 text-pink-deep mx-auto mb-3" />
      <h2 className="font-display !text-text-dark text-xl">
        {q ? `Nada que coincida con "${q}"` : "Aún no hay bolsos disponibles"}
      </h2>
      <p className="text-sm text-text-mid mt-1">
        Vuelve pronto, estamos preparando cosas bonitas.
      </p>
    </div>
  )
}
