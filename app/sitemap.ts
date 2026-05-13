import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const base = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.homeCollection.findMany({
      where: { isActive: true },
      select: { slug: true },
    }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/bolsos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contacto`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/sobre-nosotros`, changeFrequency: "yearly", priority: 0.5 },
  ]

  const categoryPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${base}/bolsos?cat=${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/bolsos/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...productPages]
}
