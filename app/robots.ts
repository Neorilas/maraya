import type { MetadataRoute } from "next"

const base = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/carrito", "/checkout", "/pedido-confirmado/", "/seguimiento/"],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
