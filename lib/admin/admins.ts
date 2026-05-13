"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email/sender"
import { passwordChangeConfirmationEmail } from "@/lib/email/templates"

export type ActionResult = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
}

async function requireSession() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("No autorizado")
  return session
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

export async function getAdmins() {
  await requireSession()
  return prisma.admin.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

const createSchema = z.object({
  email: z.string().email("Email inválido").transform((e) => e.toLowerCase().trim()),
  name: z.string().min(1, "Nombre obligatorio").max(100),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

export async function createAdminAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession()

  const parsed = createSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      errors[issue.path[0] as string] = issue.message
    }
    return { ok: false, errors }
  }

  const existing = await prisma.admin.findUnique({ where: { email: parsed.data.email } })
  if (existing) {
    return { ok: false, errors: { email: "Ya existe un admin con ese email" } }
  }

  const hash = await bcrypt.hash(parsed.data.password, 12)
  await prisma.admin.create({
    data: { email: parsed.data.email, name: parsed.data.name, password: hash },
  })

  revalidatePath("/admin/usuarios")
  return { ok: true, message: "Admin creado correctamente" }
}

// ---------------------------------------------------------------------------
// Update name/email
// ---------------------------------------------------------------------------

const updateSchema = z.object({
  id: z.string().min(1),
  email: z.string().email("Email inválido").transform((e) => e.toLowerCase().trim()),
  name: z.string().min(1, "Nombre obligatorio").max(100),
})

export async function updateAdminAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession()

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    email: formData.get("email"),
    name: formData.get("name"),
  })
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      errors[issue.path[0] as string] = issue.message
    }
    return { ok: false, errors }
  }

  const dup = await prisma.admin.findFirst({
    where: { email: parsed.data.email, NOT: { id: parsed.data.id } },
  })
  if (dup) {
    return { ok: false, errors: { email: "Ya existe otro admin con ese email" } }
  }

  await prisma.admin.update({
    where: { id: parsed.data.id },
    data: { email: parsed.data.email, name: parsed.data.name },
  })

  revalidatePath("/admin/usuarios")
  return { ok: true, message: "Admin actualizado" }
}

// ---------------------------------------------------------------------------
// Request password change (sends confirmation email)
// ---------------------------------------------------------------------------

const CONFIRM_EMAIL = "faltodeimaginacion@gmail.com"
const TOKEN_EXPIRY_MINUTES = 30

const passwordSchema = z.object({
  adminId: z.string().min(1),
  newPassword: z.string().min(6, "Mínimo 6 caracteres"),
})

export async function requestPasswordChangeAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession()

  const parsed = passwordSchema.safeParse({
    adminId: formData.get("adminId"),
    newPassword: formData.get("newPassword"),
  })
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      errors[issue.path[0] as string] = issue.message
    }
    return { ok: false, errors }
  }

  const admin = await prisma.admin.findUnique({ where: { id: parsed.data.adminId } })
  if (!admin) return { ok: false, message: "Admin no encontrado" }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12)
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: {
      adminId: admin.id,
      token,
      newHash,
      expiresAt,
    },
  })

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? process.env.AUTH_URL ?? "http://localhost:3000"
  const confirmUrl = `${baseUrl}/api/admin/confirm-password?token=${token}`

  const { subject, html } = passwordChangeConfirmationEmail({
    adminName: admin.name,
    adminEmail: admin.email,
    confirmUrl,
    expiresInMinutes: TOKEN_EXPIRY_MINUTES,
  })

  const result = await sendEmail({
    to: CONFIRM_EMAIL,
    subject,
    html,
  })

  if (!result.ok) {
    return { ok: false, message: `Error enviando email: ${result.error}` }
  }

  return {
    ok: true,
    message: `Email de confirmación enviado a ${CONFIRM_EMAIL}. Expira en ${TOKEN_EXPIRY_MINUTES} minutos.`,
  }
}

// ---------------------------------------------------------------------------
// Confirm password change (called from API route with token)
// ---------------------------------------------------------------------------

export async function confirmPasswordChange(token: string): Promise<{
  ok: boolean
  message: string
  adminEmail?: string
}> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { admin: { select: { email: true, name: true } } },
  })

  if (!record) return { ok: false, message: "Token inválido o no encontrado." }
  if (record.usedAt) return { ok: false, message: "Este token ya fue utilizado." }
  if (record.expiresAt < new Date()) return { ok: false, message: "El token ha expirado." }

  await prisma.$transaction([
    prisma.admin.update({
      where: { id: record.adminId },
      data: { password: record.newHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ])

  return {
    ok: true,
    message: `Contraseña de ${record.admin.email} actualizada correctamente.`,
    adminEmail: record.admin.email,
  }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export async function deleteAdminAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession()
  const id = formData.get("id") as string
  if (!id) return { ok: false, message: "ID requerido" }

  if (id === session.user.id) {
    return { ok: false, message: "No puedes eliminar tu propia cuenta" }
  }

  const count = await prisma.admin.count()
  if (count <= 1) {
    return { ok: false, message: "Debe haber al menos un administrador" }
  }

  await prisma.admin.delete({ where: { id } })

  revalidatePath("/admin/usuarios")
  return { ok: true, message: "Admin eliminado" }
}
