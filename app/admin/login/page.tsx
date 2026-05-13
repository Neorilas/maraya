import Link from "next/link"
import { Heart } from "lucide-react"
import { LoginForm } from "@/components/admin/LoginForm"

export const metadata = {
  title: { absolute: "Acceso admin · Maraya" },
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}) {
  const sp = await searchParams
  return (
    <div className="min-h-screen bg-leopard flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-light/80 via-cream/60 to-teal-light/40 pointer-events-none" />

      <div className="relative w-full max-w-md card-maraya gold-border p-8 sm:p-10">
        <Link href="/" className="flex flex-col items-center mb-6 leading-none">
          <span className="font-script text-4xl text-pink-primary">Maraya</span>
          <span className="font-display italic text-[10px] text-gold tracking-[0.4em] uppercase mt-1">
            Store
          </span>
        </Link>

        <h1 className="font-display italic text-center text-2xl !text-text-dark mb-1">
          Acceso administrador
        </h1>
        <p className="text-center text-sm text-text-mid mb-6 flex items-center justify-center gap-1.5">
          Solo personal autorizado
          <Heart className="w-3 h-3 fill-pink-primary stroke-none" />
        </p>

        <LoginForm
          callbackUrl={sp?.callbackUrl ?? "/admin"}
          error={sp?.error}
        />

        <p className="mt-6 text-center text-xs text-text-mid">
          ¿Eres cliente?{" "}
          <Link href="/" className="text-pink-deep font-semibold hover:underline">
            Volver a la tienda
          </Link>
        </p>
      </div>
    </div>
  )
}
