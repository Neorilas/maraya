import { cache } from "react"
import { prisma } from "@/lib/prisma"

export type CatalogFilters = {
  q?: string
  cat?: string
  /** "new" | "top" | "sale" */
  filter?: string
  sort?: "newest" | "price-asc" | "price-desc"
}

const SORT_MAP: Record<NonNullable<CatalogFilters["sort"]>, { field: "createdAt" | "price"; direction: "asc" | "desc" }> = {
  newest:       { field: "createdAt", direction: "desc" },
  "price-asc":  { field: "price",     direction: "asc" },
  "price-desc": { field: "price",     direction: "desc" },
}

export const getCatalog = cache(async (f: CatalogFilters = {}) => {
  const sort = SORT_MAP[f.sort ?? "newest"]
  const where = {
    isActive: true,
    ...(f.q && {
      OR: [
        { name: { contains: f.q, mode: "insensitive" as const } },
        { tags: { has: f.q.toLowerCase() } },
      ],
    }),
    ...(f.cat && { category: f.cat }),
    ...(f.filter === "sale" && { salePrice: { not: null } }),
    ...(f.filter === "top" && { isFeatured: true }),
  }

  return prisma.product.findMany({
    where,
    orderBy: { [sort.field]: sort.direction },
    select: {
      id: true,
      sku: true,
      slug: true,
      name: true,
      price: true,
      salePrice: true,
      stock: true,
      images: true,
      imagesAlt: true,
      category: true,
      isFeatured: true,
      createdAt: true,
    },
  })
})

export type CatalogItem = Awaited<ReturnType<typeof getCatalog>>[number]

export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      _count: { select: { orderItems: true } },
    },
  })
})

export const getRelatedProducts = cache(
  async (productId: string, category: string | null, limit = 4) => {
    return prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: productId },
        ...(category && { category }),
      },
      take: limit,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      select: {
        id: true, sku: true, slug: true, name: true,
        price: true, salePrice: true, images: true, imagesAlt: true, stock: true,
      },
    })
  },
)

/** Indica si un producto se considera "nuevo" (creado en los últimos 14 días). */
export function isNew(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() < 14 * 24 * 60 * 60 * 1000
}
