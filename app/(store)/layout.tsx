import { TopBar } from "@/components/store/TopBar"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { getSettings } from "@/lib/store/content"
import { JsonLd, organizationJsonLd, webSiteJsonLd } from "@/lib/store/jsonld"

export const dynamic = "force-dynamic"

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  return (
    <>
      <JsonLd data={organizationJsonLd(settings)} />
      <JsonLd data={webSiteJsonLd()} />
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
