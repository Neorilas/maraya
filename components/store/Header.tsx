import Link from "next/link"
import Image from "next/image"
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
        <div className="flex items-center justify-between gap-3 sm:gap-4 py-2 sm:py-3">
          <Link
            href="/"
            aria-label="Maraya — Inicio"
            className="flex items-center shrink-0 group"
          >
            <Image
              src="/maraya-logo.png"
              alt="Maraya by Maraya Bags"
              width={420}
              height={420}
              priority
              sizes="(max-width: 640px) 56px, (max-width: 1024px) 72px, 88px"
              className="h-14 sm:h-16 lg:h-20 w-auto transition-transform group-hover:scale-105 drop-shadow-[0_2px_4px_rgba(244,114,182,0.25)]"
            />
          </Link>

          <form
            action="/bolsos"
            className="hidden md:flex flex-1 max-w-md items-center gap-2 bg-pink-light/50 border border-pink-light rounded-full px-4 py-2 focus-within:border-pink-primary transition"
          >
            <Search className="w-4 h-4 text-pink-deep shrink-0" />
            <input
              type="search"
              name="q"
              placeholder="Buscar bolsos, modelos, colores…"
              className="flex-1 bg-transparent text-sm placeholder:text-text-mid outline-none min-w-0"
            />
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/admin/login"
              className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-text-dark hover:text-pink-deep transition px-3 py-2"
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
