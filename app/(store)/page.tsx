import type { Metadata } from "next"
import { HeroBanner } from "@/components/store/HeroBanner"
import { TrustBadges } from "@/components/store/TrustBadges"
import { CollectionsGrid } from "@/components/store/CollectionsGrid"
import { BrandBanner } from "@/components/store/BrandBanner"
import { getSettings } from "@/lib/store/content"

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const desc = "Bolsos artesanales hechos con mimo. Descubre la colección Maraya: piezas únicas en piel y tejido, diseños que destacan."
  return {
    title: { absolute: `${s.storeName} — Bolsos artesanales únicos` },
    description: desc,
    openGraph: {
      title: s.storeName,
      description: desc,
      images: s.heroImageUrl ? [{ url: s.heroImageUrl }] : [{ url: "/maraya-logo.png" }],
    },
    alternates: { canonical: "/" },
  }
}

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <CollectionsGrid />
      <BrandBanner />
    </>
  )
}
