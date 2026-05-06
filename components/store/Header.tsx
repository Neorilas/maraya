import Link from "next/link"
import Image from "next/image"
import { Search, User, ChevronDown } from "lucide-react"
import { CartIconButton } from "@/components/store/CartIconButton"
import { MobileSearchButton } from "@/components/store/MobileSearchButton"
import { getActiveMenuItems } from "@/lib/store/content"

export async function Header() {
  const menuItems = await getActiveMenuItems()
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gold/30 shadow-[0_2px_12px_rgba(244,114,182,0.08)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 relative">
        {/* fila logo / search / acciones */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 py-1.5 sm:py-2 lg:py-3">
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
              sizes="(max-width: 640px) 96px, (max-width: 1024px) 96px, 112px"
              className="h-24 sm:h-24 lg:h-28 w-auto transition-transform group-hover:scale-105 drop-shadow-[0_2px_4px_rgba(244,114,182,0.25)]"
            />
          </Link>

          {/* Buscador inline en md+ (en mobile lo abre MobileSearchButton) */}
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
            <MobileSearchButton />

            {/* Mi cuenta: icono solo en móvil, icono+texto en lg */}
            <Link
              href="/admin/login"
              prefetch={false}
              aria-label="Mi cuenta"
              className="flex items-center gap-1.5 text-sm font-semibold text-text-dark hover:text-pink-deep transition lg:px-3 lg:py-2"
            >
              <span className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-pink-light hover:bg-pink-primary hover:text-white text-pink-deep transition">
                <User className="w-4 h-4" />
              </span>
              <span className="hidden lg:flex items-center gap-1.5">
                <User className="w-4 h-4" />
                Mi cuenta
              </span>
            </Link>

            <CartIconButton />
          </div>
        </div>

        {/* Nav — items leídos de BD. En móvil scroll horizontal con fade en bordes. */}
        {menuItems.length > 0 && (
          <nav className="border-t border-pink-light relative">
            <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 text-sm font-semibold scrollbar-none [&::-webkit-scrollbar]:hidden">
              {menuItems.map((item) => (
                <li key={item.id} className="shrink-0">
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="flex items-center gap-1 px-3 py-2 rounded-full uppercase tracking-wider text-[11px] sm:text-xs text-text-dark hover:bg-pink-light hover:text-pink-deep transition"
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Fade derecho indicando scroll en móvil */}
            <div
              className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none"
              aria-hidden
            />
          </nav>
        )}
      </div>
    </header>
  )
}
