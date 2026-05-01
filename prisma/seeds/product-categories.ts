/**
 * Categorías iniciales del catálogo. Editables desde /admin/productos.
 * El campo Product.category guarda el `slug` (sin FK formal).
 */
export const PRODUCT_CATEGORIES = [
  { slug: "bolsos-de-mano", label: "Bolsos de mano", sortOrder: 10 },
  { slug: "bandolera",      label: "Bandolera",      sortOrder: 20 },
  { slug: "mochilas",       label: "Mochilas",       sortOrder: 30 },
  { slug: "clutch",         label: "Clutch",         sortOrder: 40 },
  { slug: "cartera",        label: "Cartera",        sortOrder: 50 },
  { slug: "accesorios",     label: "Accesorios",     sortOrder: 60 },
] as const
