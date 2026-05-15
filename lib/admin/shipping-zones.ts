"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v

const baseSchema = {
  name:     z.string().min(1, "Obligatorio").max(100),
  code:     z.string().min(1).max(30).regex(/^[A-Z_]+$/, "Mayúsculas y guion bajo"),
  price:    z.coerce.number().min(0).max(10000),
  freeFrom: z.preprocess(emptyToNull, z.coerce.number().min(0).max(100000).nullable()),
  days:     z.string().min(1, "Obligatorio").max(40),
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

export async function saveShippingZone(
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
    await prisma.shippingZone.update({ where: { id }, data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("Unique")) return { ok: false, message: "Código de zona duplicado" }
    return { ok: false, message: "Error al guardar" }
  }
  revalidatePath("/admin/envios")
  revalidatePath("/", "layout")
  return { ok: true, message: "Guardada" }
}

export async function createShippingZone(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireSession()
  const parsed = createSchema.safeParse(fdToObj(fd))
  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos", errors: zodErrors(parsed.error.issues) }
  }
  try {
    await prisma.shippingZone.create({ data: parsed.data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("Unique")) return { ok: false, message: "Ya existe ese código de zona" }
    return { ok: false, message: "Error al crear" }
  }
  revalidatePath("/admin/envios")
  revalidatePath("/", "layout")
  return { ok: true, message: "Zona creada" }
}

export async function deleteShippingZone(id: string): Promise<ActionResult> {
  await requireSession()
  await prisma.shippingZone.delete({ where: { id } })
  revalidatePath("/admin/envios")
  revalidatePath("/", "layout")
  return { ok: true, message: "Eliminada" }
}
