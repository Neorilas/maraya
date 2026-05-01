import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductForm, type ProductFormDefaults } from "@/components/admin/products/ProductForm"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Editar producto · Maraya Admin",
  robots: { index: false, follow: false },
}

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [p, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, label: true },
    }),
  ])
  if (!p) notFound()

  const defaults: ProductFormDefaults = {
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    salePrice: p.salePrice,
    stock: p.stock,
    category: p.category,
    tags: p.tags,
    images: p.images,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/admin/productos"
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-pink-deep hover:text-pink-primary transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver al catálogo
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display italic text-3xl !text-text-dark">
            {p.name}
          </h1>
          <p className="text-text-mid mt-1 text-sm font-mono">SKU {p.sku}</p>
        </div>
        {p.isActive && (
          <Link
            href={`/bolsos/${p.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-deep hover:text-pink-primary transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver en tienda
          </Link>
        )}
      </header>

      <ProductForm defaults={defaults} mode="edit" categories={categories} />
    </div>
  )
}
