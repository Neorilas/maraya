"use server"

import { z } from "zod"
import { sendEmail } from "@/lib/email/sender"
import { prisma } from "@/lib/prisma"

const contactSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto").max(100),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "Mensaje demasiado corto").max(2000),
  honeypot: z.string().max(0, "spam"),
})

export type ContactFormState = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
}

export async function sendContactAction(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    honeypot: formData.get("_website") ?? "",
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "honeypot")) {
      return { ok: true, message: "Mensaje enviado correctamente." }
    }
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".")
      if (!errors[path]) errors[path] = issue.message
    }
    return { ok: false, message: "Revisa los campos marcados.", errors }
  }

  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
    select: { adminEmail: true, storeName: true },
  })

  await sendEmail({
    to: settings.adminEmail,
    subject: `[${settings.storeName}] Contacto de ${parsed.data.name}`,
    replyTo: parsed.data.email,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(parsed.data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(parsed.data.email)}</p>
      <hr/>
      <p>${escapeHtml(parsed.data.message).replace(/\n/g, "<br/>")}</p>
    `,
  })

  return { ok: true, message: "Mensaje enviado correctamente. Te responderemos lo antes posible." }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
