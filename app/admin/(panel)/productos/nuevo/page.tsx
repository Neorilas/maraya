import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductForm, type ProductFormDefaults } from "@/components/admin/products/ProductForm"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Nuevo producto · Maraya Admin",
  robots: { index: false, follow: false },
}

const EMPTY: ProductFormDefaults = {
  sku: "",
  name: "",
  slug: "",
  description: "",
  price: 0,
  salePrice: null,
  stock: 0,
  category: null,
  tags: [],
  images: [],
  imagesAlt: [],
  isActive: true,
  isFeatured: false,
}

export default async function NuevoProductoPage() {
  const categories = await prisma.productCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { slug: true, label: true },
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/admin/productos"
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-pink-deep hover:text-pink-primary transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver al catálogo
      </Link>

      <header>
        <h1 className="font-display italic text-3xl !text-text-dark">
          Nuevo producto
        </h1>
        <p className="text-text-mid mt-1 text-sm">
          Rellena los datos. Al guardar te llevamos a la edición para que puedas afinar.
        </p>
      </header>

      <ProductForm defaults={EMPTY} mode="create" categories={categories} />
    </div>
  )
}
