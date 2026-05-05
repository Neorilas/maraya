"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const slugRegex = /^[a-z0-9-]+$/

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v
const optString = z.preprocess(emptyToNull, z.string().nullable())

const baseSchema = {
  slug: z.string().min(1).regex(slugRegex, "Solo minúsculas, números y guiones"),
  name: z.string().min(1, "Obligatorio"),
  tag: optString,
  gradient: z.string().min(1, "Obligatorio"),
  imageUrl: optString,
  imageAlt: optString,
  href: optString,
  sortOrder: z.coerce.number().int().min(0).max(99),
  isActive: z.preprocess((v) => v === "on" || v === true, z.boolean()),
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

export async function saveCollection(
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
    await prisma.homeCollection.update({ where: { id }, data })
  } catch (err) {
    return { ok: false, message: "El slug ya existe en otra colección" }
  }
  revalidatePath("/", "layout")
  revalidatePath("/admin/contenido")
  return { ok: true, message: "Guardado" }
}

export async function createCollection(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireSession()
  const parsed = createSchema.safeParse(fdToObj(fd))
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos", errors: zodErrors(parsed.error.issues) }
  }
  try {
    await prisma.homeCollection.create({ data: parsed.data })
  } catch (err) {
    return { ok: false, message: "Ya existe una colección con ese slug" }
  }
  revalidatePath("/", "layout")
  revalidatePath("/admin/contenido")
  return { ok: true, message: "Colección creada" }
}

export async function deleteCollection(id: string): Promise<ActionResult> {
  await requireSession()
  await prisma.homeCollection.delete({ where: { id } })
  revalidatePath("/", "layout")
  revalidatePath("/admin/contenido")
  return { ok: true, message: "Eliminada" }
}
