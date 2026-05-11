import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email/sender"
import {
  customerOrderConfirmation,
  adminNewOrderAlert,
  customerStatusUpdate,
} from "@/lib/email/templates"

const PUBLIC_URL = (): string => process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") ?? "http://localhost:3000"

/**
 * Recoge los datos del pedido y dispara los dos emails (cliente y admin).
 * Tolera fallos individuales (loguea pero no rompe el webhook).
 */
export async function sendOrderConfirmationEmails(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: { select: { images: true } } } },
    },
  })
  if (!order) return { ok: false, error: "Pedido no encontrado" }

  const settings = await prisma.settings.findUniqueOrThrow({ where: { id: "singleton" } })
  const zone = await prisma.shippingZone.findUnique({ where: { code: order.shippingZone } })

  const baseUrl = PUBLIC_URL()
  const customerName = `${order.firstName} ${order.lastName}`.trim()
  const trackingUrl = order.trackingToken
    ? `${baseUrl}/seguimiento/${order.orderNumber}?token=${order.trackingToken}`
    : `${baseUrl}/seguimiento/${order.orderNumber}`
  const adminUrl = `${baseUrl}/admin/pedidos/${order.id}`

  const items = order.items.map((it) => {
    const raw = it.product?.images?.[0] ?? null
    const image = raw && raw.startsWith("/") ? `${baseUrl}${raw}` : raw
    return { name: it.productName, price: it.price, quantity: it.quantity, image }
  })

  const customerData = {
    orderNumber: order.orderNumber,
    customerName,
    email: order.email,
    items,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    total: order.total,
    shippingZoneName: zone?.name ?? order.shippingZone,
    estimatedDays: zone?.days ?? "—",
    shippingAddress: [
      order.address,
      order.addressLine2,
      `${order.postalCode} ${order.city}`,
      order.province,
      order.country,
    ]
      .filter(Boolean)
      .join(", "),
    trackingUrl,
  }

  const customerEmail = customerOrderConfirmation(customerData)
  const adminEmail = adminNewOrderAlert({ ...customerData, trackingUrl: adminUrl })

  const [a, b] = await Promise.all([
    sendEmail({ to: order.email, ...customerEmail }),
    sendEmail({ to: settings.adminEmail, ...adminEmail }),
  ])

  if (!a.ok) console.error("[email cliente] error:", a.error)
  if (!b.ok) console.error("[email admin] error:", b.error)
  return { ok: true, customer: a, admin: b }
}

/**
 * Email al cliente cuando el admin cambia el estado.
 */
export async function sendStatusUpdateEmail(
  orderId: string,
  status: "EN_PREPARACION" | "ENVIADO" | "ENTREGADO" | "CANCELADO" | "REEMBOLSADO",
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      orderNumber: true, firstName: true, lastName: true, email: true,
      trackingNumber: true, shippingCompany: true, trackingToken: true,
    },
  })
  if (!order) return { ok: false, error: "Pedido no encontrado" }

  const trackingUrl = order.trackingToken
    ? `${PUBLIC_URL()}/seguimiento/${order.orderNumber}?token=${order.trackingToken}`
    : `${PUBLIC_URL()}/seguimiento/${order.orderNumber}`
  const { subject, html } = customerStatusUpdate({
    orderNumber: order.orderNumber,
    customerName: `${order.firstName} ${order.lastName}`.trim(),
    status,
    trackingUrl,
    trackingNumber: order.trackingNumber,
    shippingCompany: order.shippingCompany,
  })
  return sendEmail({ to: order.email, subject, html })
}
