import type { Metadata } from "next"
import { ImageHero } from "@/components/store/ImageHero"
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
      images: [{ url: "/hero-salvaje.jpg" }],
    },
    alternates: { canonical: "/" },
  }
}

export default function HomePage() {
  return (
    <>
      <ImageHero
        src="/hero-salvaje.jpg"
        alt="Salvaje — Artesanía con actitud. Bolsos hechos a mano por Maraya"
        href="/bolsos"
        priority
        objectPosition="20% center"
      />
      <TrustBadges />
      <CollectionsGrid />
      <ImageHero
        src="/hero-quehablen.jpg"
        alt="Que hablen, que hablen — Bolsos artesanales Maraya con animal print y detalles únicos"
        href="/bolsos"
        objectPosition="25% center"
      />
      <BrandBanner />
    </>
  )
}
