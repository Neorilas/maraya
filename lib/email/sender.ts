import { Resend } from "resend"

/**
 * Wrapper de envío de email. Usa Resend si está configurado;
 * en dev sin clave, hace console.log con el HTML para no bloquear el flujo.
 */

let _resend: Resend | null = null

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (_resend) return _resend
  _resend = new Resend(key)
  return _resend
}

export type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
  /** Opcional: from override. Por defecto FROM_EMAIL. */
  from?: string
  replyTo?: string
}

export async function sendEmail({
  to, subject, html, from, replyTo,
}: SendEmailInput): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  const resend = client()
  const sender = from ?? process.env.FROM_EMAIL ?? "noreply@marayastore.com"

  if (!resend) {
    console.log("─".repeat(70))
    console.log(`[EMAIL MOCK] no hay RESEND_API_KEY — log en consola:`)
    console.log(`  to:      ${Array.isArray(to) ? to.join(", ") : to}`)
    console.log(`  from:    ${sender}`)
    console.log(`  subject: ${subject}`)
    console.log(`  --- html (primeras 400 chars) ---`)
    console.log(html.slice(0, 400) + (html.length > 400 ? "…" : ""))
    console.log("─".repeat(70))
    return { ok: true, mock: true }
  }

  try {
    const res = await resend.emails.send({
      from: sender,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
    })
    if (res.error) return { ok: false, error: res.error.message }
    return { ok: true, id: res.data?.id }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" }
  }
}
