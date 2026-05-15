"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/** Convierte string vacío en null (para campos opcionales). */
const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v)
const optString = z.preprocess(emptyToNull, z.string().max(500).nullable())
const optUrl = z.preprocess(
  emptyToNull,
  z.string().url("URL inválida").max(500).nullable(),
)

/**
 * Schema completo de Settings. Cada campo es opcional (`.optional()`)
 * para permitir updates PARCIALES — el form de /admin/configuracion
 * solo envía sus campos, el de /admin/contenido los suyos.
 */
const settingsSchema = z.object({
  // Tienda
  storeName:  z.string().min(1, "Obligatorio").optional(),
  storeEmail: z.string().email("Email inválido").optional(),
  adminEmail: z.string().email("Email inválido").optional(),

  // Stripe
  stripePublicKey:     z.preprocess(emptyToNull, z.string().max(200).nullable()).optional(),
  stripeSecretKey:     z.preprocess(emptyToNull, z.string().max(200).nullable()).optional(),
  stripeWebhookSecret: z.preprocess(emptyToNull, z.string().max(200).nullable()).optional(),

  // Redes
  instagramUrl:   optUrl.optional(),
  facebookUrl:    optUrl.optional(),
  tiktokUrl:      optUrl.optional(),
  twitterUrl:     optUrl.optional(),
  whatsappNumber: optString.optional(),

  // Top bar
  topBarText:   z.string().max(160).optional(),
  topBarActive: z.preprocess((v) => v === "on" || v === true, z.boolean()).optional(),

  // Hero
  heroEyebrow:           optString.optional(),
  heroTitle:             z.string().min(1, "Obligatorio").optional(),
  heroHighlight:         z.string().min(1, "Obligatorio").optional(),
  heroSubtitle:          z.string().max(280).optional(),
  heroImageUrl:          optString.optional(),
  heroCtaPrimaryText:    z.string().min(1, "Obligatorio").optional(),
  heroCtaPrimaryUrl:     z.string().min(1, "Obligatorio").optional(),
  heroCtaSecondaryText:  optString.optional(),
  heroCtaSecondaryUrl:   optString.optional(),

  // Brand banner
  brandBannerEyebrow: optString.optional(),
  brandBannerTitle:   z.string().min(1, "Obligatorio").optional(),
  brandBannerText:    z.string().max(500).optional(),
  brandBannerCtaText: optString.optional(),
  brandBannerCtaUrl:  optString.optional(),
  brandBannerBadge:   optString.optional(),

  // Sobre Nosotros
  aboutIntro:        z.preprocess(emptyToNull, z.string().max(2000).nullable()).optional(),
  aboutHistoryTitle: optString.optional(),
  aboutHistoryText:  z.preprocess(emptyToNull, z.string().max(2000).nullable()).optional(),
  aboutValuesTitle:  optString.optional(),
  aboutValuesText:   z.preprocess(emptyToNull, z.string().max(2000).nullable()).optional(),
  aboutProcessTitle: optString.optional(),
  aboutProcessText:  z.preprocess(emptyToNull, z.string().max(2000).nullable()).optional(),

  // Contacto
  contactIntro:    optString.optional(),
  contactPhone:    optString.optional(),
  contactAddress:  optString.optional(),
  contactSchedule: optString.optional(),

  // Footer
  newsletterIntro: optString.optional(),
  clubIntro:       optString.optional(),
})

export type SettingsFormState = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
}

function formDataToObject(fd: FormData): Record<string, FormDataEntryValue> {
  const obj: Record<string, FormDataEntryValue> = {}
  for (const [k, v] of fd.entries()) obj[k] = v
  return obj
}

/**
 * Server Action para guardar Settings (parcial). Solo persiste los campos
 * presentes en el FormData. Para los toggles (`topBarActive`), si el form
 * los renderiza pero están desmarcados, llegan ausentes → se interpretan
 * como `false` SOLO si el form declaró ese campo (heurística: viene un input
 * hidden con el nombre del toggle prefijado por `__has_`).
 */
export async function saveSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await auth()
  if (!session?.user) return { ok: false, message: "No autorizado" }

  const obj = formDataToObject(formData)

  // Toggles declarados explícitamente en el form (hidden __has_X) que no
  // están marcados → forzamos a "off" para que zod los interprete como false.
  for (const key of Object.keys(obj)) {
    if (key.startsWith("__has_")) {
      const target = key.slice("__has_".length)
      if (!(target in obj)) {
        ;(obj as Record<string, FormDataEntryValue>)[target] = "off"
      }
    }
  }

  const parsed = settingsSchema.safeParse(obj)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".")
      if (!errors[path]) errors[path] = issue.message
    }
    return { ok: false, message: "Revisa los campos marcados", errors }
  }

  // Filtra undefined para evitar pisar columnas no enviadas
  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v !== undefined) data[k] = v
  }

  await prisma.settings.update({ where: { id: "singleton" }, data })

  revalidatePath("/", "layout")
  revalidatePath("/contacto")
  revalidatePath("/sobre-nosotros")
  revalidatePath("/admin/configuracion")
  revalidatePath("/admin/contenido")

  return { ok: true, message: "Cambios guardados" }
}
