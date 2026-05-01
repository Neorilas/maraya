import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductsTable, type ProductTableRow } from "@/components/admin/products/ProductsTable"
import { CategoriesEditor } from "@/components/admin/categories/CategoriesEditor"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Productos · Maraya Admin",
  robots: { index: false, follow: false },
}

export default async function ProductosListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>
}) {
  const sp = await searchParams
  const q = (sp.q ?? "").trim()
  const cat = (sp.cat ?? "").trim()

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(q && {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku:  { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        }),
        ...(cat && { category: cat }),
      },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      select: {
        id: true, sku: true, slug: true, name: true,
        price: true, salePrice: true, stock: true,
        isActive: true, isFeatured: true, category: true, images: true,
      },
    }),
    prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ])

  const rows: ProductTableRow[] = products.map((p) => ({
    ...p,
    primaryImage: p.images[0] ?? null,
  }))

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display italic text-3xl !text-text-dark">Productos</h1>
          <p className="text-text-mid mt-1 text-sm">
            Catálogo de bolsos. {products.length} producto(s) en total.
          </p>
        </div>
        <Link href="/admin/productos/nuevo" className="btn-pill btn-pink">
          <Plus className="w-4 h-4" />
          Nuevo producto
        </Link>
      </header>

      <CategoriesEditor categories={categories} />

      <form className="card-maraya p-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-pink-deep ml-2" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, SKU o slug…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-mid/60"
        />
        {cat && <input type="hidden" name="cat" value={cat} />}
        <button type="submit" className="btn-pill btn-pink !px-4 !py-2 text-xs">
          Buscar
        </button>
        {(q || cat) && (
          <Link
            href="/admin/productos"
            className="text-xs font-semibold text-text-mid hover:text-pink-deep px-2"
          >
            Limpiar
          </Link>
        )}
      </form>

      <ProductsTable rows={rows} />
    </div>
  )
}
