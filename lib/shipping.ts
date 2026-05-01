import { cache } from "react"
import { prisma } from "@/lib/prisma"

/**
 * Mapeo país → código de zona. Se busca primero por matching exacto
 * y si no, por código ISO. Países no listados caen en "OTHER".
 */
const COUNTRY_TO_ZONE: Record<string, string> = {
  // España y subzonas
  ES:    "SPAIN",
  "ES-PM": "BALEARES",
  "ES-IB": "BALEARES",
  "ES-GC": "CANARIAS",
  "ES-TF": "CANARIAS",

  // Europa (UE + Reino Unido + países cercanos)
  PT: "EUROPE", FR: "EUROPE", IT: "EUROPE", DE: "EUROPE", BE: "EUROPE",
  NL: "EUROPE", LU: "EUROPE", AT: "EUROPE", IE: "EUROPE", DK: "EUROPE",
  SE: "EUROPE", FI: "EUROPE", GR: "EUROPE", PL: "EUROPE", CZ: "EUROPE",
  HU: "EUROPE", RO: "EUROPE", BG: "EUROPE", HR: "EUROPE", SI: "EUROPE",
  SK: "EUROPE", LT: "EUROPE", LV: "EUROPE", EE: "EUROPE", MT: "EUROPE",
  CY: "EUROPE", GB: "EUROPE", CH: "EUROPE", NO: "EUROPE", IS: "EUROPE",
  AD: "EUROPE", MC: "EUROPE", LI: "EUROPE", SM: "EUROPE", VA: "EUROPE",

  // USA
  US: "USA",
}

export type ShippingQuote = {
  zoneCode: string
  zoneName: string
  cost: number
  isFree: boolean
  estimatedDays: string
  freeFrom: number | null
}

export class NoShippingAvailableError extends Error {
  constructor(public country: string) {
    super(`No hay envío disponible a ${country}`)
  }
}

/** Devuelve la zona aplicable a un país. */
export function zoneCodeFor(country: string): string {
  const code = country.toUpperCase()
  return COUNTRY_TO_ZONE[code] ?? "OTHER"
}

/**
 * Calcula el coste de envío para un país y un subtotal. Lee la tarifa de la BD.
 * Cacheado por request.
 */
export const getShippingQuote = cache(
  async (country: string, subtotal: number): Promise<ShippingQuote> => {
    const code = zoneCodeFor(country)
    const zone = await prisma.shippingZone.findUnique({ where: { code } })
    if (!zone || !zone.isActive) {
      throw new NoShippingAvailableError(country)
    }
    const isFree = zone.freeFrom !== null && subtotal >= zone.freeFrom
    return {
      zoneCode: zone.code,
      zoneName: zone.name,
      cost: isFree ? 0 : zone.price,
      isFree,
      estimatedDays: zone.days,
      freeFrom: zone.freeFrom,
    }
  },
)
