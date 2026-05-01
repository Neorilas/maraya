import { TopBar } from "@/components/store/TopBar"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"

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
