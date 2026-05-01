import { HeroBanner } from "@/components/store/HeroBanner"
import { TrustBadges } from "@/components/store/TrustBadges"
import { CollectionsGrid } from "@/components/store/CollectionsGrid"
import { BrandBanner } from "@/components/store/BrandBanner"

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
