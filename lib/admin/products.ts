"use server"

import { revalidatePath } from "next/cache"
import type { ZodIssue } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/slug"
import {
  productCreateSchema,
  productUpdateSchema,
  type ProductFormState,
} from "./products-schema"

function fdToObj(fd: FormData): Record<string, FormDataEntryValue> {
  const o: Record<string, FormDataEntryValue> = {}
  for (const [k, v] of fd.entries()) o[k] = v
  return o
}

function zodErrors(issues: ZodIssue[]): Record<string, string> {
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

/** Crea un producto. Tras éxito devuelve ok para que el form muestre toast y se resetee. */
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
  try {
    await prisma.product.create({ data })
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
  revalidatePath("/bolsos", "layout")
  return { ok: true, message: `Producto «${parsed.data.name}» creado` }
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
    console.error("[deleteProduct]", err)
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("Record to") && msg.includes("not found")) {
      return { ok: false, message: "El producto ya no existe" }
    }
    if (msg.includes("Foreign key constraint")) {
      await prisma.product.update({ where: { id }, data: { isActive: false } }).catch(() => {})
      revalidatePath("/admin/productos")
      return { ok: true, message: "Tiene referencias — desactivado en su lugar." }
    }
    if (msg.includes("No autorizado")) {
      return { ok: false, message: "Sesión expirada. Recarga la página." }
    }
    return { ok: false, message: "Error al eliminar el producto" }
  }
}
