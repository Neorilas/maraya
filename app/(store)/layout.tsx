import { TopBar } from "@/components/store/TopBar"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"

// Toda la tienda lee el CMS de la BD en cada request → opt-out de SSG.
// React.cache() sigue evitando llamadas duplicadas dentro del mismo request.
export const dynamic = "force-dynamic"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
