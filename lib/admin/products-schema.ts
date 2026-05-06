import { z } from "zod"

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v

/** Convierte textarea con URLs (una por línea o coma) en string[] limpio. */
const imagesPreprocess = (v: unknown) => {
  if (Array.isArray(v)) return v
  if (typeof v !== "string") return []
  return v
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Alt-text paralelos a `images`. NO filtramos vacíos — la posición debe casar
 * 1:1 con el array de URLs. Quien envía es ProductImagesField, que serializa
 * un alt por línea (línea vacía = sin alt).
 */
const imagesAltPreprocess = (v: unknown) => {
  if (Array.isArray(v)) return v.map((s) => String(s ?? "").trim())
  if (typeof v !== "string") return []
  return v.split(/\r?\n/).map((s) => s.trim())
}

/** Tags como string CSV → string[] */
const tagsPreprocess = (v: unknown) => {
  if (Array.isArray(v)) return v
  if (typeof v !== "string") return []
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

const baseSchema = {
  sku: z.string().min(1, "Obligatorio").max(40),
  name: z.string().min(1, "Obligatorio").max(140),
  slug: z
    .string()
    .min(1, "Obligatorio")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  description: z.string().min(1, "Obligatorio"),
  price: z.coerce.number().min(0.01, "Debe ser > 0").max(100000),
  salePrice: z.preprocess(
    emptyToNull,
    z.coerce.number().min(0).max(100000).nullable(),
  ),
  stock: z.coerce.number().int().min(0).max(100000),
  category: z.preprocess(emptyToNull, z.string().nullable()),
  tags: z.preprocess(tagsPreprocess, z.array(z.string()).max(20)),
  images: z.preprocess(imagesPreprocess, z.array(z.string().url("URL inválida")).max(8)),
  imagesAlt: z.preprocess(
    imagesAltPreprocess,
    z.array(z.string().max(200)).max(8),
  ),
  isActive: z.preprocess((v) => v === "on" || v === true, z.boolean()),
  isFeatured: z.preprocess((v) => v === "on" || v === true, z.boolean()),
}

export const productCreateSchema = z
  .object(baseSchema)
  .refine(
    (d) => d.salePrice === null || d.salePrice < d.price,
    { message: "El precio rebajado debe ser menor que el precio normal", path: ["salePrice"] },
  )

export const productUpdateSchema = z
  .object({ id: z.string().min(1), ...baseSchema })
  .refine(
    (d) => d.salePrice === null || d.salePrice < d.price,
    { message: "El precio rebajado debe ser menor que el precio normal", path: ["salePrice"] },
  )

export type ProductFormState = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
}
