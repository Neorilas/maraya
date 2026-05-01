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
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-pink-light flex items-center px-4 sm:px-6 gap-4">
      <div className="lg:hidden">
        <MobileMenuButton />
      </div>

      <div className="flex-1" />

      <Link
        href="/"
        target="_blank"
        rel="noreferrer"
        className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-text-mid hover:text-pink-deep transition"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Ver tienda
      </Link>

      <div className="hidden sm:flex flex-col items-end leading-tight">
        <span className="text-xs text-text-mid">Hola,</span>
        <span className="text-sm font-bold text-text-dark truncate max-w-[160px]">
          {user.name}
        </span>
      </div>

      <div
        className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-primary to-pink-deep flex items-center justify-center text-white font-bold uppercase shrink-0"
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
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-pink-light hover:bg-pink-primary hover:text-white text-pink-deep text-xs font-bold uppercase tracking-wider transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </form>
    </header>
  )
}
