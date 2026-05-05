import Link from "next/link"
import { ExternalLink, LogOut } from "lucide-react"
import { signOut } from "@/lib/auth"
import { MobileMenuButton } from "@/components/admin/MobileMenuButton"

/**
 * Topbar server-rendered. El botón hamburguesa es cliente (lee contexto)
 * y el botón de salir usa server action.
 */
export function AdminTopBar({
  user,
}: {
  user: { name: string; email: string }
}) {
  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white/95 backdrop-blur border-b border-pink-light flex items-center px-3 sm:px-6 gap-2 sm:gap-4">
      <div className="lg:hidden">
        <MobileMenuButton />
      </div>

      <div className="flex-1" />

      <Link
        href="/"
        target="_blank"
        rel="noreferrer"
        aria-label="Ver tienda"
        className="flex items-center gap-1.5 text-xs font-semibold text-text-mid hover:text-pink-deep transition"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Ver tienda</span>
      </Link>

      <div className="hidden md:flex flex-col items-end leading-tight">
        <span className="text-xs text-text-mid">Hola,</span>
        <span className="text-sm font-bold text-text-dark truncate max-w-[160px]">
          {user.name}
        </span>
      </div>

      <div
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-pink-primary to-pink-deep flex items-center justify-center text-white font-bold uppercase shrink-0 text-sm"
        aria-hidden
      >
        {user.name.charAt(0)}
      </div>

      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/admin/login" })
        }}
      >
        <button
          type="submit"
          aria-label="Cerrar sesión"
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-pink-light hover:bg-pink-primary hover:text-white text-pink-deep text-xs font-bold uppercase tracking-wider transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </form>
    </header>
  )
}
