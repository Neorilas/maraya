import { z } from "zod"

/** Lista de países a mostrar en el checkout. Subdivisiones de España como "país lógico". */
export const CHECKOUT_COUNTRIES = [
  { code: "ES",    label: "España (Península)" },
  { code: "ES-IB", label: "España — Baleares" },
  { code: "ES-GC", label: "España — Canarias" },
  { code: "PT",    label: "Portugal" },
  { code: "FR",    label: "Francia" },
  { code: "IT",    label: "Italia" },
  { code: "DE",    label: "Alemania" },
  { code: "GB",    label: "Reino Unido" },
  { code: "BE",    label: "Bélgica" },
  { code: "NL",    label: "Países Bajos" },
  { code: "IE",    label: "Irlanda" },
  { code: "AT",    label: "Austria" },
  { code: "PL",    label: "Polonia" },
  { code: "CH",    label: "Suiza" },
  { code: "AD",    label: "Andorra" },
  { code: "US",    label: "Estados Unidos" },
  { code: "OTHER", label: "Otro país (consultar)" },
] as const

/** Validación del DNI/NIE español. */
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE"
function validSpanishId(value: string): boolean {
  const v = value.toUpperCase().replace(/[\s-]/g, "")
  // DNI: 8 dígitos + letra
  const dni = /^(\d{8})([A-Z])$/.exec(v)
  if (dni) {
    const num = parseInt(dni[1], 10)
    return DNI_LETTERS[num % 23] === dni[2]
  }
  // NIE: X/Y/Z + 7 dígitos + letra
  const nie = /^([XYZ])(\d{7})([A-Z])$/.exec(v)
  if (nie) {
    const prefix = { X: "0", Y: "1", Z: "2" }[nie[1] as "X" | "Y" | "Z"]
    const num = parseInt(prefix + nie[2], 10)
    return DNI_LETTERS[num % 23] === nie[3]
  }
  return false
}

const phoneRegex = /^[+]?[\d\s\-()]{6,20}$/

export const checkoutSchema = z.object({
  // Datos personales
  firstName: z.string().min(1, "Obligatorio").max(60),
  lastName:  z.string().min(1, "Obligatorio").max(60),
  email:     z.string().email("Email no válido"),
  phone:     z.string().regex(phoneRegex, "Teléfono no válido"),
  dni:       z.string().refine(validSpanishId, "DNI/NIE no válido"),

  // Dirección
  address:      z.string().min(3, "Demasiado corto").max(120),
  addressLine2: z.string().max(80).optional().or(z.literal("")),
  city:         z.string().min(1, "Obligatorio").max(60),
  province:     z.string().min(1, "Obligatorio").max(60),
  postalCode:   z.string().min(3, "Demasiado corto").max(15),
  country:      z.string().min(2, "Selecciona un país"),

  // Aceptaciones
  acceptTerms: z.preprocess((v) => v === "on" || v === true, z.boolean())
                .refine((v) => v, "Tienes que aceptar los términos"),
  acceptMarketing: z.preprocess((v) => v === "on" || v === true, z.boolean()),
})

export type CheckoutData = z.infer<typeof checkoutSchema>
