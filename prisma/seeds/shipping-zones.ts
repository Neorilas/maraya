/** Datos por defecto de zonas de envío. Editable desde /admin/envios. */
export const SHIPPING_ZONES = [
  { code: "SPAIN",    name: "España Peninsular", price: 4.99,  freeFrom: 50,   days: "24/48h" },
  { code: "BALEARES", name: "Baleares",          price: 7.99,  freeFrom: 80,   days: "48/72h" },
  { code: "CANARIAS", name: "Canarias",          price: 9.99,  freeFrom: 100,  days: "3-5 días" },
  { code: "EUROPE",   name: "Europa",            price: 14.99, freeFrom: 150,  days: "5-7 días" },
  { code: "USA",      name: "USA",               price: 24.99, freeFrom: 200,  days: "7-14 días" },
  { code: "OTHER",    name: "Otras regiones",    price: 29.99, freeFrom: null, days: "Consultar" },
]
