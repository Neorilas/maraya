import { cache } from "react"
import { prisma } from "@/lib/prisma"

/**
 * Lectores cacheados por request (React.cache) del contenido editable de la
 * tienda. Si dos componentes en la misma página piden la misma cosa,
 * Postgres ve una sola query.
 *
 * No usamos `unstable_cache` (cache cross-request) a propósito: cuando el
 * admin edite contenido necesitamos que el siguiente render lo refleje. Si
 * en producción mide caro, podemos añadir cache HTTP en una capa superior.
 */

export const getSettings = cache(async () => {
  return prisma.settings.findUniqueOrThrow({ where: { id: "singleton" } })
})

export const getActiveTrustBadges = cache(async () => {
  return prisma.trustBadge.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })
})

export const getActiveHomeCollections = cache(async () => {
  return prisma.homeCollection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })
})

export const getActiveMenuItems = cache(async () => {
  return prisma.menuItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })
})

export const getActiveProductCategories = cache(async () => {
  return prisma.productCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })
})

export const getActiveTestimonials = cache(async () => {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })
})

export type StoreSettings = Awaited<ReturnType<typeof getSettings>>
export type TrustBadgeRow = Awaited<ReturnType<typeof getActiveTrustBadges>>[number]
export type HomeCollectionRow = Awaited<ReturnType<typeof getActiveHomeCollections>>[number]
export type MenuItemRow = Awaited<ReturnType<typeof getActiveMenuItems>>[number]
export type ProductCategoryRow = Awaited<ReturnType<typeof getActiveProductCategories>>[number]
export type TestimonialRow = Awaited<ReturnType<typeof getActiveTestimonials>>[number]
