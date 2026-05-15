"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { STORE_ICON_MAP } from "@/lib/store/icons"

const iconValues = Object.keys(STORE_ICON_MAP) as [string, ...string[]]

const baseSchema = {
  icon: z.enum(iconValues),
  title: z.string().min(1, "Obligatorio").max(100),
  text: z.string().min(1, "Obligatorio").max(300),
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

export async function saveTrustBadge(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireSession()
  const parsed = updateSchema.safeParse(fdToObj(fd))
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos", errors: zodErrors(parsed.error.issues) }
  }
  const { id, ...data } = parsed.data
  await prisma.trustBadge.update({ where: { id }, data })
  revalidatePath("/", "layout")
  revalidatePath("/admin/contenido")
  return { ok: true, message: "Guardado" }
}

export async function createTrustBadge(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireSession()
  const parsed = createSchema.safeParse(fdToObj(fd))
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos", errors: zodErrors(parsed.error.issues) }
  }
  await prisma.trustBadge.create({ data: parsed.data })
  revalidatePath("/", "layout")
  revalidatePath("/admin/contenido")
  return { ok: true, message: "Trust badge creada" }
}

export async function deleteTrustBadge(id: string): Promise<ActionResult> {
  await requireSession()
  await prisma.trustBadge.delete({ where: { id } })
  revalidatePath("/", "layout")
  revalidatePath("/admin/contenido")
  return { ok: true, message: "Eliminada" }
}
