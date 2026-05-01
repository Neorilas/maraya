/**
 * Items por defecto del menú principal del header.
 * El admin puede editar/desactivar/reordenar/añadir desde /admin/contenido.
 */
export const MENU_ITEMS = [
  { label: "Inicio",          href: "/",                  sortOrder: 10, hasDropdown: false },
  { label: "Bolsos",          href: "/bolsos",            sortOrder: 20, hasDropdown: true },
  { label: "Novedades",       href: "/bolsos?filter=new", sortOrder: 30, hasDropdown: false },
  { label: "Best Sellers",    href: "/bolsos?filter=top", sortOrder: 40, hasDropdown: false },
  { label: "Accesorios",      href: "/bolsos?cat=accesorios", sortOrder: 50, hasDropdown: false },
  { label: "Sobre Nosotros",  href: "/sobre-nosotros",    sortOrder: 60, hasDropdown: false },
  { label: "Contacto",        href: "/contacto",          sortOrder: 70, hasDropdown: false },
] as const
