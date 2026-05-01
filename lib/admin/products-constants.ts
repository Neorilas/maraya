/** Categorías sugeridas para productos. Se usan en el select del admin y en filtros. */
export const PRODUCT_CATEGORIES = [
  "bolsos-de-mano",
  "bandolera",
  "mochilas",
  "clutch",
  "cartera",
  "accesorios",
  "otros",
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]
