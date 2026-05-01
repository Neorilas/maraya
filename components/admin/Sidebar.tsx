"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ADMIN_NAV, isNavActive } from "@/lib/admin/nav"
import { cn } from "@/lib/cn"
import { X } from "lucide-react"

/**
 * Barra lateral del admin. Cliente para detectar el item activo via usePathname.
 * En desktop está siempre visible; en móvil se abre con un drawer overlay.
 */
export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  return (
    <>
      {/* overlay móvil */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-dvh w-64 bg-white border-r border-pink-light shadow-[2px_0_20px_rgba(244,114,182,0.08)]",
          "transition-transform duration-200 ease-out",
          "lg:translate-x-0 lg:sticky lg:top-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-pink-light">
          <Link href="/admin" className="flex flex-col leading-none">
            <span className="font-script text-2xl text-pink-primary">Maraya</span>
            <span className="font-display italic text-[9px] text-gold tracking-[0.4em] uppercase mt-0.5">
              Admin
            </span>
          </Link>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={onClose}
            className="lg:hidden p-2 rounded-full hover:bg-pink-light text-pink-deep"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {ADMIN_NAV.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              active={isNavActive(item, pathname)}
              onNavigate={onClose}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}

function SidebarLink({
  item,
  active,
  onNavigate,
}: {
  item: (typeof ADMIN_NAV)[number]
  active: boolean
  onNavigate: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition",
        active
          ? "bg-pink-light text-pink-deep gold-border shadow-[0_4px_14px_rgba(212,175,55,0.18)]"
          : "text-text-dark hover:bg-pink-light/60 hover:text-pink-deep",
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{item.label}</span>
    </Link>
  )
}
