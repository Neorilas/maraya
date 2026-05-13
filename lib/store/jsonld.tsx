import type { StoreSettings } from "./content"

const base = () => process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"

/* ------------------------------------------------------------------ */
/*  Data builders (plain objects — no React)                          */
/* ------------------------------------------------------------------ */

export function organizationJsonLd(s: StoreSettings) {
  const sameAs = [s.instagramUrl, s.facebookUrl, s.tiktokUrl, s.twitterUrl].filter(Boolean)

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.storeName,
    url: base(),
    logo: `${base()}/maraya-logo.png`,
    email: s.storeEmail,
    ...(s.contactPhone ? { telephone: s.contactPhone } : {}),
    ...(s.contactAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: s.contactAddress,
          },
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Maraya Store",
    url: base(),
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${base()}/bolsos?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  }
}

interface ProductData {
  name: string
  slug: string
  sku: string
  description: string
  price: number
  salePrice: number | null
  images: string[]
  stock: number
  category: string | null
}

export function productJsonLd(p: ProductData) {
  const url = `${base()}/bolsos/${p.slug}`
  const onSale = p.salePrice !== null && p.salePrice < p.price
  const effectivePrice = onSale ? p.salePrice! : p.price

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.sku,
    url,
    image: p.images.map((img) => (img.startsWith("http") ? img : `${base()}${img}`)),
    brand: { "@type": "Brand", name: "Maraya Store" },
    ...(p.category ? { category: p.category } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: effectivePrice.toFixed(2),
      availability: p.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url,
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${base()}${item.url}`,
    })),
  }
}

/* ------------------------------------------------------------------ */
/*  Render helper (React server component)                            */
/* ------------------------------------------------------------------ */

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
