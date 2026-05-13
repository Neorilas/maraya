import Link from "next/link"
import { SearchX } from "lucide-react"

export const metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
}

export default function StoreNotFound() {
  return (
    <div className="bg-cream/40 flex-1 flex items-center justify-center px-4 py-16">
      <div className="card-maraya p-10 sm:p-14 text-center max-w-md">
        <SearchX className="w-12 h-12 text-pink-deep mx-auto mb-4" />

        <h1 className="font-display italic !text-text-dark text-2xl sm:text-3xl">
          Página no encontrada
        </h1>

        <div className="divider-heart my-4">
          <span aria-hidden>♡</span>
        </div>

        <p className="text-sm text-text-mid mb-6">
          Lo sentimos, esta página no existe o ha sido movida.
        </p>

        <Link
          href="/bolsos"
          className="btn-pill btn-pink inline-block px-6 py-2.5 text-sm font-bold"
        >
          Ver catálogo
        </Link>

        <p className="mt-4">
          <Link href="/" className="text-xs text-pink-deep hover:underline">
            Ir al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
