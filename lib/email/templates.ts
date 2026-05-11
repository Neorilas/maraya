/**
 * Plantillas HTML para emails. Inline styles porque la mayoría de clientes
 * de email ignoran <style> y CSS externo.
 */

const EUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" })

export type OrderEmailData = {
  orderNumber: string
  customerName: string
  email: string
  items: Array<{ name: string; price: number; quantity: number; image?: string | null }>
  subtotal: number
  shippingCost: number
  total: number
  shippingZoneName: string
  estimatedDays: string
  shippingAddress: string
  trackingUrl: string
}

const SHELL = (inner: string, preview = "") => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Maraya Collection</title>
</head>
<body style="margin:0;padding:0;background:#FFF8F0;font-family:Nunito,Arial,sans-serif;color:#1F1F1F;">
<div style="display:none;max-height:0;overflow:hidden;">${preview}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F0;padding:24px 0;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 4px 14px rgba(31,31,31,0.06);">
    <tr><td style="background:linear-gradient(135deg,#FDE7F3 0%,#FFF8F0 50%,#CCFBF1 100%);padding:32px;text-align:center;border-bottom:2px solid #D4AF37;">
      <div style="font-family:Georgia,serif;font-size:42px;font-style:italic;color:#F472B6;line-height:1;">Maraya</div>
      <div style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.4em;color:#D4AF37;text-transform:uppercase;margin-top:6px;">Collection</div>
    </td></tr>
    ${inner}
    <tr><td style="background:#1F1F1F;color:#fff;padding:24px;text-align:center;font-size:12px;">
      <p style="margin:0 0 4px 0;">© Maraya Collection · Hecho con ♡ en España</p>
      <p style="margin:0;color:#bbb;">¿Dudas? Responde a este email y te ayudamos.</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`

const ITEMS_TABLE = (items: OrderEmailData["items"]) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
${items.map((it) => `
<tr>
  <td style="padding:8px 0;border-bottom:1px solid #FDE7F3;">
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        ${it.image ? `<td style="padding-right:12px;"><img src="${it.image}" width="56" height="56" style="border-radius:8px;border:1px solid #D4AF37;display:block;" alt=""></td>` : ""}
        <td>
          <div style="font-weight:bold;color:#1F1F1F;">${it.name}</div>
          <div style="color:#6B7280;font-size:13px;">${it.quantity} × ${EUR.format(it.price)}</div>
        </td>
      </tr>
    </table>
  </td>
  <td align="right" style="padding:8px 0;border-bottom:1px solid #FDE7F3;font-weight:bold;">${EUR.format(it.price * it.quantity)}</td>
</tr>`).join("")}
</table>`

const TOTALS_BLOCK = (d: OrderEmailData) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
  <tr><td style="color:#6B7280;">Subtotal</td><td align="right">${EUR.format(d.subtotal)}</td></tr>
  <tr><td style="color:#6B7280;">Envío · ${d.shippingZoneName}</td><td align="right">${d.shippingCost === 0 ? "GRATIS" : EUR.format(d.shippingCost)}</td></tr>
  <tr><td style="border-top:2px solid #D4AF37;padding-top:8px;font-weight:bold;font-size:16px;">Total</td>
      <td align="right" style="border-top:2px solid #D4AF37;padding-top:8px;font-family:Georgia,serif;font-style:italic;font-size:22px;color:#EC4899;">${EUR.format(d.total)}</td></tr>
</table>`

/** Email al cliente: pedido recibido y pago confirmado. */
export function customerOrderConfirmation(d: OrderEmailData): { subject: string; html: string } {
  const inner = `
<tr><td style="padding:32px;">
  <p style="font-family:'Brush Script MT',cursive;font-size:24px;color:#F472B6;margin:0;">¡Gracias, ${escapeHtml(d.customerName)}!</p>
  <h1 style="font-family:Georgia,serif;font-style:italic;color:#1F1F1F;margin:8px 0 16px 0;font-size:28px;">Tu pedido ${escapeHtml(d.orderNumber)} está confirmado</h1>
  <p style="line-height:1.6;color:#1F1F1F;">Hemos recibido tu pago y empezamos a preparar tu pedido con muchísimo mimo. Te avisamos cuando salga del taller.</p>
  ${ITEMS_TABLE(d.items)}
  ${TOTALS_BLOCK(d)}
  <div style="margin-top:20px;padding:16px;border:2px solid #D4AF37;border-radius:12px;background:#FEF9C3;">
    <strong style="color:#1F1F1F;">Envío estimado: ${escapeHtml(d.estimatedDays)}</strong><br>
    <span style="color:#6B7280;font-size:14px;">${escapeHtml(d.shippingAddress)}</span>
  </div>
  <p style="text-align:center;margin:24px 0;">
    <a href="${d.trackingUrl}" style="display:inline-block;padding:12px 28px;background:#F472B6;color:#fff;text-decoration:none;border-radius:9999px;font-weight:bold;letter-spacing:0.05em;text-transform:uppercase;font-size:13px;">Ver mi pedido</a>
  </p>
</td></tr>`
  return {
    subject: `¡Gracias por tu pedido en Maraya Store! 🎀 #${d.orderNumber}`,
    html: SHELL(inner, `Tu pedido ${d.orderNumber} está confirmado.`),
  }
}

/** Email al admin: nuevo pedido. */
export function adminNewOrderAlert(d: OrderEmailData): { subject: string; html: string } {
  const inner = `
<tr><td style="padding:32px;">
  <h1 style="font-family:Georgia,serif;font-style:italic;color:#1F1F1F;margin:0;font-size:24px;">🛒 Nuevo pedido entrante</h1>
  <p style="color:#6B7280;margin:4px 0 16px 0;">${escapeHtml(d.orderNumber)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="color:#6B7280;">Cliente</td><td><strong>${escapeHtml(d.customerName)}</strong></td></tr>
    <tr><td style="color:#6B7280;">Email</td><td>${escapeHtml(d.email)}</td></tr>
    <tr><td style="color:#6B7280;">Total</td><td><strong>${EUR.format(d.total)}</strong></td></tr>
    <tr><td style="color:#6B7280;">Envío</td><td>${escapeHtml(d.shippingZoneName)}</td></tr>
  </table>
  ${ITEMS_TABLE(d.items)}
  <p style="text-align:center;margin:20px 0;">
    <a href="${d.trackingUrl}" style="display:inline-block;padding:10px 24px;background:#2DD4BF;color:#fff;text-decoration:none;border-radius:9999px;font-weight:bold;font-size:13px;">Abrir en el panel</a>
  </p>
</td></tr>`
  return {
    subject: `🛒 Nuevo pedido #${d.orderNumber} — ${d.customerName}`,
    html: SHELL(inner),
  }
}

/** Email al cliente: cambio de estado del pedido. */
export function customerStatusUpdate({
  orderNumber,
  customerName,
  status,
  trackingUrl,
  trackingNumber,
}: {
  orderNumber: string
  customerName: string
  status: "EN_PREPARACION" | "ENVIADO" | "ENTREGADO" | "CANCELADO" | "REEMBOLSADO"
  trackingUrl: string
  trackingNumber?: string | null
}): { subject: string; html: string } {
  const COPY: Record<typeof status, { subject: string; title: string; body: string }> = {
    EN_PREPARACION: {
      subject: `Estamos preparando tu pedido 🎀 #${orderNumber}`,
      title: "¡Tu pedido está en taller!",
      body: "Estamos preparándolo con muchísimo mimo. En breve sale para ti.",
    },
    ENVIADO: {
      subject: `¡Tu Maraya está en camino! 🚚 #${orderNumber}`,
      title: "Tu pedido sale de viaje",
      body: trackingNumber
        ? `Número de seguimiento: <strong>${escapeHtml(trackingNumber)}</strong>. Llega en breve.`
        : "En breve estará en tus manos.",
    },
    ENTREGADO: {
      subject: `¡Llegó tu Maraya! ❤️ #${orderNumber}`,
      title: "¡Tu pedido ha llegado!",
      body: "Esperamos que te enamores. Si te apetece, nos haría ilusión que nos etiquetaras en Instagram @marayastore.",
    },
    CANCELADO: {
      subject: `Tu pedido ha sido cancelado #${orderNumber}`,
      title: "Pedido cancelado",
      body: "Te contactaremos para devolverte el importe y resolver dudas.",
    },
    REEMBOLSADO: {
      subject: `Tu reembolso está en proceso #${orderNumber}`,
      title: "Reembolso en proceso",
      body: "El abono puede tardar entre 3 y 7 días en aparecer en tu cuenta.",
    },
  }
  const c = COPY[status]
  const inner = `
<tr><td style="padding:32px;">
  <p style="font-family:'Brush Script MT',cursive;font-size:22px;color:#F472B6;margin:0;">${escapeHtml(customerName)},</p>
  <h1 style="font-family:Georgia,serif;font-style:italic;color:#1F1F1F;margin:8px 0 16px 0;font-size:26px;">${c.title}</h1>
  <p style="line-height:1.6;color:#1F1F1F;">${c.body}</p>
  <p style="color:#6B7280;margin-top:16px;font-size:14px;">Pedido <strong>${escapeHtml(orderNumber)}</strong></p>
  <p style="text-align:center;margin:24px 0;">
    <a href="${trackingUrl}" style="display:inline-block;padding:12px 28px;background:#F472B6;color:#fff;text-decoration:none;border-radius:9999px;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;font-size:13px;">Ver mi pedido</a>
  </p>
</td></tr>`
  return { subject: c.subject, html: SHELL(inner) }
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}
