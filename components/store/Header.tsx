import Link from "next/link"
import { Search, User, ChevronDown } from "lucide-react"
import { CartIconButton } from "@/components/store/CartIconButton"

const NAV = [
  { label: "Inicio", href: "/" },
  { label: "Bolsos", href: "/bolsos", chevron: true },
  { label: "Novedades", href: "/bolsos?filter=new" },
  { label: "Best Sellers", href: "/bolsos?filter=top" },
  { label: "Accesorios", href: "/bolsos?cat=accesorios" },
  { label: "Outfits", href: "/outfits" },
  { label: "Sobre Nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/contacto" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gold/30 shadow-[0_2px_12px_rgba(244,114,182,0.08)]">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* fila logo / search / acciones */}
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-script text-3xl sm:text-4xl text-pink-primary leading-none">
              Maraya
            </span>
            <span className="font-display italic text-[10px] sm:text-xs text-gold tracking-[0.4em] uppercase mt-0.5">
              Store
            </span>
          </Link>

          <form
            action="/bolsos"
            className="hidden md:flex flex-1 max-w-md items-center gap-2 bg-pink-light/50 border border-pink-light rounded-full px-4 py-2 focus-within:border-pink-primary transition"
          >
            <Search className="w-4 h-4 text-pink-deep" />
            <input
              type="search"
              name="q"
              placeholder="Buscar bolsos, modelos, colores…"
              className="flex-1 bg-transparent text-sm placeholder:text-text-mid outline-none"
            />
          </form>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/admin/login"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-text-dark hover:text-pink-deep transition px-3 py-2"
            >
              <User className="w-4 h-4" />
              <span>Mi cuenta</span>
            </Link>

            <CartIconButton />
          </div>
        </div>

        {/* nav */}
        <nav className="border-t border-pink-light">
          <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 text-sm font-semibold scrollbar-thin">
            {NAV.map((item) => (
              <li key={item.label} className="shrink-0">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 rounded-full uppercase tracking-wider text-xs text-text-dark hover:bg-pink-light hover:text-pink-deep transition"
                >
                  {item.label}
                  {item.chevron && <ChevronDown className="w-3 h-3" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
