"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const baseSchema = {
  author: z.string().min(1, "Obligatorio"),
  text: z.string().min(1, "Obligatorio"),
  rating: z.coerce.number().int().min(1).max(5),
  source: z.string().optional(),
  sourceUrl: z.string().url("URL no válida").optional().or(z.literal("")),
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

function clean(data: Record<string, unknown>) {
  if (data.sourceUrl === "") data.sourceUrl = null
  if (!data.source) data.source = null
  return data
}

export async function saveTestimonial(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireSession()
  const parsed = updateSchema.safeParse(fdToObj(fd))
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos", errors: zodErrors(parsed.error.issues) }
  }
  const { id, ...data } = parsed.data
  await prisma.testimonial.update({ where: { id }, data: clean(data) })
  revalidatePath("/", "layout")
  revalidatePath("/admin/contenido")
  return { ok: true, message: "Guardado" }
}

export async function createTestimonial(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireSession()
  const parsed = createSchema.safeParse(fdToObj(fd))
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos", errors: zodErrors(parsed.error.issues) }
  }
  await prisma.testimonial.create({ data: clean(parsed.data) })
  revalidatePath("/", "layout")
  revalidatePath("/admin/contenido")
  return { ok: true, message: "Reseña creada" }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  await requireSession()
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath("/", "layout")
  revalidatePath("/admin/contenido")
  return { ok: true, message: "Eliminada" }
}
