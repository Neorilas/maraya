import type { MetadataRoute } from "next"

export const dynamic = "force-dynamic"

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/carrito", "/checkout", "/pedido-confirmado/", "/seguimiento/"],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
