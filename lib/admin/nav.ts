import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ImageIcon,
  Truck,
  Settings,
  Users,
} from "lucide-react"
import type { ComponentType } from "react"

export type NavItem = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
  /** Si está, el item se considera activo cuando el pathname empieza por algún prefix. */
  matchPrefix?: string[]
}

export const ADMIN_NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Pedidos",
    href: "/admin/pedidos",
    icon: ShoppingBag,
    matchPrefix: ["/admin/pedidos"],
  },
  {
    label: "Productos",
    href: "/admin/productos",
    icon: Package,
    matchPrefix: ["/admin/productos"],
  },
  {
    label: "Contenido web",
    href: "/admin/contenido",
    icon: ImageIcon,
    matchPrefix: ["/admin/contenido"],
  },
  {
    label: "Envíos",
    href: "/admin/envios",
    icon: Truck,
    matchPrefix: ["/admin/envios"],
  },
  {
    label: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
    matchPrefix: ["/admin/usuarios"],
  },
  {
    label: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
    matchPrefix: ["/admin/configuracion"],
  },
]

/** ¿Está el item activo según el pathname? */
export function isNavActive(item: NavItem, pathname: string): boolean {
  if (item.matchPrefix) {
    return item.matchPrefix.some((p) => pathname.startsWith(p))
  }
  return pathname === item.href
}
