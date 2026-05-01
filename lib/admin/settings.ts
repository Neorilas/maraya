"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/** Convierte string vacío en null (para campos opcionales). */
const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v)
const optString = z.preprocess(emptyToNull, z.string().nullable())
const optUrl = z.preprocess(
  emptyToNull,
  z.string().url("URL inválida").nullable(),
)

/** Forma del payload aceptado por saveSettingsAction. */
export const settingsSchema = z.object({
  // Tienda
  storeName:  z.string().min(1, "Obligatorio"),
  storeEmail: z.string().email("Email inválido"),
  adminEmail: z.string().email("Email inválido"),

  // Stripe (todos opcionales hasta que el usuario las configure)
  stripePublicKey:     optString,
  stripeSecretKey:     optString,
  stripeWebhookSecret: optString,

  // Redes
  instagramUrl: optUrl,
  facebookUrl:  optUrl,
  tiktokUrl:    optUrl,
  twitterUrl:   optUrl,
  whatsappNumber: optString,

  // Top bar
  topBarText:   z.string().min(0).max(160),
  topBarActive: z.preprocess((v) => v === "on" || v === true, z.boolean()),

  // Hero
  heroEyebrow:           optString,
  heroTitle:             z.string().min(1, "Obligatorio"),
  heroHighlight:         z.string().min(1, "Obligatorio"),
  heroSubtitle:          z.string().min(0).max(280),
  heroImageUrl:          optString,
  heroCtaPrimaryText:    z.string().min(1, "Obligatorio"),
  heroCtaPrimaryUrl:     z.string().min(1, "Obligatorio"),
  heroCtaSecondaryText:  optString,
  heroCtaSecondaryUrl:   optString,

  // Brand banner
  brandBannerEyebrow: optString,
  brandBannerTitle:   z.string().min(1, "Obligatorio"),
  brandBannerText:    z.string().min(0).max(500),
  brandBannerCtaText: optString,
  brandBannerCtaUrl:  optString,
  brandBannerBadge:   optString,

  // Footer
  newsletterIntro: optString,
  clubIntro:       optString,
})

export type SettingsFormState = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
}

/** Convierte FormData en plain object para zod. */
function formDataToObject(fd: FormData): Record<string, FormDataEntryValue> {
  const obj: Record<string, FormDataEntryValue> = {}
  for (const [k, v] of fd.entries()) obj[k] = v
  // Toggles ausentes → undefined → zod preprocess los trata como false
  return obj
}

/**
 * Server Action invocada por el formulario /admin/configuracion.
 */
export async function saveSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await auth()
  if (!session?.user) return { ok: false, message: "No autorizado" }

  const parsed = settingsSchema.safeParse(formDataToObject(formData))
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".")
      if (!errors[path]) errors[path] = issue.message
    }
    return { ok: false, message: "Revisa los campos marcados", errors }
  }

  await prisma.settings.update({
    where: { id: "singleton" },
    data: parsed.data,
  })

  // Refresca toda la tienda (la home lee de aquí)
  revalidatePath("/", "layout")
  revalidatePath("/admin/configuracion")

  return { ok: true, message: "Cambios guardados" }
}
