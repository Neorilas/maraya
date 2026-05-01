"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const slugRegex = /^[a-z0-9-]+$/

const baseSchema = {
  slug:      z.string().min(1).regex(slugRegex, "Solo minúsculas, números y guiones"),
  label:     z.string().min(1, "Obligatorio").max(60),
  sortOrder: z.coerce.number().int().min(0).max(999),
  isActive:  z.preprocess((v) => v === "on" || v === true, z.boolean()),
}

const updateSchema = z.object({ id: z.string().min(1), ...baseSchema })
const createSchema = z.object(baseSchema)

export type ActionResult = {
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

export async function saveCategory(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireSession()
  const parsed = updateSchema.safeParse(fdToObj(fd))
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos", errors: zodErrors(parsed.error.issues) }
  }
  const { id, ...data } = parsed.data
  try {
    await prisma.productCategory.update({ where: { id }, data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("Unique")) return { ok: false, message: "Slug duplicado" }
    return { ok: false, message: "Error al guardar" }
  }
  revalidatePath("/admin/productos")
  revalidatePath("/bolsos", "page")
  return { ok: true, message: "Guardada" }
}

export async function createCategory(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireSession()
  const parsed = createSchema.safeParse(fdToObj(fd))
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos", errors: zodErrors(parsed.error.issues) }
  }
  try {
    await prisma.productCategory.create({ data: parsed.data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("Unique")) return { ok: false, message: "Ya existe ese slug" }
    return { ok: false, message: "Error al crear" }
  }
  revalidatePath("/admin/productos")
  return { ok: true, message: "Categoría creada" }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireSession()
  // Comprobamos si hay productos con ese slug; si es así, sólo desactivamos.
  const cat = await prisma.productCategory.findUnique({ where: { id } })
  if (!cat) return { ok: false, message: "No encontrada" }
  const usedBy = await prisma.product.count({ where: { category: cat.slug } })
  if (usedBy > 0) {
    await prisma.productCategory.update({
      where: { id },
      data: { isActive: false },
    })
    revalidatePath("/admin/productos")
    return {
      ok: true,
      message: `Está en uso por ${usedBy} producto(s) — desactivada en lugar de borrada.`,
    }
  }
  await prisma.productCategory.delete({ where: { id } })
  revalidatePath("/admin/productos")
  return { ok: true, message: "Eliminada" }
}
