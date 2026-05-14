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
      images: [{ url: "/hero-actitud.jpg" }],
    },
    alternates: { canonical: "/" },
  }
}

export default function HomePage() {
  return (
    <>
      <ImageHero
        src="/hero-actitud.jpg"
        mobileSrc="/hero-actitud-mobile.jpg"
        alt="Que hablen, Que hablen — Artesanía con actitud. Bolsos hechos a mano por Maraya"
        width={1535}
        height={1024}
        mobileWidth={850}
        mobileHeight={1024}
        href="/bolsos"
        priority
      />
      <TrustBadges />
      <CollectionsGrid />
      <ImageHero
        src="/hero-quehablen.jpg"
        mobileSrc="/hero-quehablen-mobile.jpg"
        alt="Que hablen, que hablen — Bolsos artesanales Maraya con animal print y detalles únicos"
        width={1288}
        height={916}
        mobileWidth={960}
        mobileHeight={916}
        href="/bolsos"
      />
      <BrandBanner />
    </>
  )
}
