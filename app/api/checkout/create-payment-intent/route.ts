import { NextResponse } from "next/server"
import { z } from "zod"
import { stripe, isStripeConfigured } from "@/lib/stripe"
import { checkoutSchema } from "@/lib/checkout"
import { getShippingQuote, NoShippingAvailableError, zoneCodeFor } from "@/lib/shipping"
import { createPendingOrder } from "@/lib/order"
import { prisma } from "@/lib/prisma"

const itemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
})

const bodySchema = z.object({
  customer: checkoutSchema,
  items: z.array(itemSchema).min(1),
})

/**
 * Crea el pedido en estado PENDIENTE (precios y stock validados server-side)
 * y devuelve el client_secret de Stripe para que el navegador confirme la tarjeta.
 *
 * El pedido se "marca como pagado" desde el webhook (única fuente de verdad de pago).
 */
export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe no configurado. Falta STRIPE_SECRET_KEY." },
      { status: 503 },
    )
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.issues }, { status: 400 })
  }

  // Calcular subtotal canónico antes de crear el pedido (lo recalcula también createPendingOrder).
  const productIds = parsed.data.items.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: { id: true, price: true, salePrice: true, stock: true },
  })
  const byId = new Map(products.map((p) => [p.id, p]))
  let subtotal = 0
  for (const it of parsed.data.items) {
    const p = byId.get(it.productId)
    if (!p) {
      return NextResponse.json({ error: "Producto no disponible" }, { status: 422 })
    }
    if (p.stock < it.quantity) {
      return NextResponse.json({ error: "Stock insuficiente" }, { status: 422 })
    }
    subtotal += (p.salePrice ?? p.price) * it.quantity
  }

  let shipping
  try {
    shipping = await getShippingQuote(parsed.data.customer.country, subtotal)
  } catch (err) {
    if (err instanceof NoShippingAvailableError) {
      return NextResponse.json({ error: err.message }, { status: 422 })
    }
    throw err
  }

  // Crea pedido PENDIENTE
  const order = await createPendingOrder({
    customer: parsed.data.customer,
    items: parsed.data.items,
    shippingCost: shipping.cost,
    shippingZoneCode: zoneCodeFor(parsed.data.customer.country),
  })

  // Crea PaymentIntent (importes en céntimos)
  const intent = await stripe().paymentIntents.create({
    amount: Math.round(order.total * 100),
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    receipt_email: order.email,
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
    },
  })

  // Guardar el ID del PI en el pedido (no el secret) para audit trail
  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentId: intent.id },
  })

  return NextResponse.json({
    clientSecret: intent.client_secret,
    orderId: order.id,
    orderNumber: order.orderNumber,
    trackingToken: order.trackingToken,
    total: order.total,
  })
}
