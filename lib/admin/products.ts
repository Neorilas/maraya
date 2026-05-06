"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/slug"

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
  // No filtramos vacíos para preservar posiciones
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

function fdToObj(fd: FormData): Record<string, FormDataEntryValue> {
  const o: Record<string, FormDataEntryValue> = {}
  for (const [k, v] of fd.entries()) o[k] = v
  return o
}

function zodErrors(issues: z.ZodIssue[]): Record<string, string> {
  const e: Record<string, string> = {}
  for (const i of issues) {
    const k = i.path.join(".")
    if (!e[k]) e[k] = i.message
  }
  return e
}

async function requireSession() {
  const s = await auth()
  if (!s?.user) throw new Error("No autorizado")
}

/** Asegura imagesAlt[i] para cada images[i]; corta o rellena con "". */
function normalizeImagesAlt(images: string[], alts: string[]): string[] {
  return Array.from({ length: images.length }, (_, i) => alts[i] ?? "")
}

/** Crea un producto. Tras éxito, redirige a la edición del nuevo. */
export async function createProductAction(
  _prev: ProductFormState,
  fd: FormData,
): Promise<ProductFormState> {
  await requireSession()

  const obj = fdToObj(fd)
  // Auto-genera slug si viene vacío
  if (!obj.slug && typeof obj.name === "string") obj.slug = slugify(obj.name)

  const parsed = productCreateSchema.safeParse(obj)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los campos",
      errors: zodErrors(parsed.error.issues),
    }
  }

  const data = {
    ...parsed.data,
    imagesAlt: normalizeImagesAlt(parsed.data.images, parsed.data.imagesAlt),
  }
  let id: string
  try {
    const created = await prisma.product.create({ data })
    id = created.id
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("Unique") && msg.includes("sku")) {
      return { ok: false, message: "Ya existe un producto con ese SKU", errors: { sku: "SKU duplicado" } }
    }
    if (msg.includes("Unique") && msg.includes("slug")) {
      return { ok: false, message: "Ya existe un producto con ese slug", errors: { slug: "Slug duplicado" } }
    }
    return { ok: false, message: "Error al crear el producto" }
  }

  revalidatePath("/admin/productos")
  redirect(`/admin/productos/${id}?ok=1`)
}

export async function updateProductAction(
  _prev: ProductFormState,
  fd: FormData,
): Promise<ProductFormState> {
  await requireSession()
  const parsed = productUpdateSchema.safeParse(fdToObj(fd))
  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los campos",
      errors: zodErrors(parsed.error.issues),
    }
  }
  const { id, ...rest } = parsed.data
  const data = {
    ...rest,
    imagesAlt: normalizeImagesAlt(rest.images, rest.imagesAlt),
  }
  try {
    await prisma.product.update({ where: { id }, data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("Unique") && msg.includes("sku")) {
      return { ok: false, message: "SKU duplicado", errors: { sku: "Ya en uso" } }
    }
    if (msg.includes("Unique") && msg.includes("slug")) {
      return { ok: false, message: "Slug duplicado", errors: { slug: "Ya en uso" } }
    }
    return { ok: false, message: "Error al guardar" }
  }
  revalidatePath("/admin/productos")
  revalidatePath(`/admin/productos/${id}`)
  revalidatePath("/", "layout")
  return { ok: true, message: "Cambios guardados" }
}

/** Borra un producto si NO está referenciado por pedidos (en cuyo caso desactiva). */
export async function deleteProductAction(id: string): Promise<{ ok: boolean; message: string }> {
  try {
    await requireSession()
  } catch {
    return { ok: false, message: "Sesión expirada. Recarga la página." }
  }
  try {
    const refs = await prisma.orderItem.count({ where: { productId: id } })
    if (refs > 0) {
      await prisma.product.update({ where: { id }, data: { isActive: false } })
      revalidatePath("/admin/productos")
      revalidatePath("/bolsos", "layout")
      return {
        ok: true,
        message: `Está en ${refs} pedido(s) — desactivado en su lugar.`,
      }
    }
    await prisma.product.delete({ where: { id } })
    revalidatePath("/admin/productos")
    revalidatePath("/bolsos", "layout")
    return { ok: true, message: "Producto eliminado" }
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("Record to") && msg.includes("not found")) {
      return { ok: false, message: "El producto ya no existe" }
    }
    if (msg.includes("Foreign key constraint")) {
      await prisma.product.update({ where: { id }, data: { isActive: false } }).catch(() => {})
      revalidatePath("/admin/productos")
      return { ok: true, message: "Tiene referencias — desactivado en su lugar." }
    }
    return { ok: false, message: "Error al eliminar el producto" }
  }
}
