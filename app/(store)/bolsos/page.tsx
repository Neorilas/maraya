import { Search } from "lucide-react"
import { getCatalog } from "@/lib/store/products"
import { getActiveHomeCollections } from "@/lib/store/content"
import { ProductCard } from "@/components/store/ProductCard"
import { CatalogFilters } from "@/components/store/CatalogFilters"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Bolsos · Maraya Store",
  description: "Catálogo de bolsos artesanales Maraya. Encuentra el tuyo.",
}

type SP = { q?: string; cat?: string; filter?: string; sort?: "newest" | "price-asc" | "price-desc" }

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

  return (
    <div className="bg-cream/40">
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
