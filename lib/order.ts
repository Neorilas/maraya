import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"

/** Genera número de pedido correlativo por año: MAR-YYYY-NNNN */
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const start = new Date(`${year}-01-01T00:00:00.000Z`)
  const count = await prisma.order.count({
    where: { createdAt: { gte: start } },
  })
  const num = String(count + 1).padStart(4, "0")
  return `MAR-${year}-${num}`
}

/** Datos del cliente requeridos para crear el pedido. */
export type OrderCustomerInput = {
  firstName: string
  lastName: string
  email: string
  phone: string
  dni: string
  address: string
  addressLine2?: string | null
  city: string
  province: string
  postalCode: string
  country: string
}

export type OrderItemInput = {
  productId: string
  quantity: number
}

/**
 * Crea el pedido en estado PENDIENTE con sus items, recalculando precios y subtotal
 * desde la BD (NUNCA confiar en lo que envía el cliente). Lanza si algún producto
 * está inactivo o sin stock suficiente.
 *
 * Devuelve el pedido creado (sin items detallados; consultar en BD si se necesitan).
 */
export async function createPendingOrder({
  customer,
  items,
  shippingCost,
  shippingZoneCode,
}: {
  customer: OrderCustomerInput
  items: OrderItemInput[]
  shippingCost: number
  shippingZoneCode: string
}) {
  if (items.length === 0) throw new Error("Carrito vacío")

  // Cargamos productos para validar stock y precio actual.
  const ids = items.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    select: {
      id: true, name: true, price: true, salePrice: true, stock: true,
    },
  })
  const byId = new Map(products.map((p) => [p.id, p]))

  // Validar y construir line items con precios canónicos del server.
  let subtotal = 0
  const orderItemsCreate = items.map((it) => {
    const p = byId.get(it.productId)
    if (!p) throw new Error(`Producto no disponible: ${it.productId}`)
    if (p.stock < it.quantity) {
      throw new Error(`Sin stock suficiente para ${p.name} (queda ${p.stock})`)
    }
    const unit = p.salePrice ?? p.price
    subtotal += unit * it.quantity
    return {
      productId: p.id,
      productName: p.name,
      price: unit,
      quantity: it.quantity,
    }
  })

  const total = round2(subtotal + shippingCost)
  const orderNumber = await generateOrderNumber()
  const trackingToken = randomUUID()

  const order = await prisma.order.create({
    data: {
      orderNumber,
      trackingToken,
      status: "PENDIENTE",
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      dni: customer.dni,
      address: customer.address,
      addressLine2: customer.addressLine2 || null,
      city: customer.city,
      province: customer.province,
      postalCode: customer.postalCode,
      country: customer.country,
      subtotal: round2(subtotal),
      shippingCost: round2(shippingCost),
      total,
      shippingZone: shippingZoneCode,
      items: { create: orderItemsCreate },
      statusHistory: {
        create: {
          status: "PENDIENTE",
          note: "Pedido creado, pendiente de pago",
        },
      },
    },
    select: {
      id: true,
      orderNumber: true,
      trackingToken: true,
      total: true,
      email: true,
    },
  })

  return order
}

/**
 * Marca un pedido como pagado (status PAGADO), descuenta stock y registra el evento.
 * Es idempotente: si ya estaba PAGADO, no hace nada.
 */
export async function markOrderAsPaid(
  orderId: string,
  stripePaymentId: string,
): Promise<{ alreadyPaid: boolean; orderNumber: string; total: number; email: string } | null> {
  return prisma.$transaction(async (tx) => {
    const o = await tx.order.findUnique({
      where: { id: orderId },
      select: {
        id: true, status: true, orderNumber: true, total: true, email: true,
        items: { select: { productId: true, quantity: true } },
      },
    })
    if (!o) return null
    if (o.status !== "PENDIENTE") {
      return { alreadyPaid: true, orderNumber: o.orderNumber, total: o.total, email: o.email }
    }
    // Descontar stock
    for (const it of o.items) {
      await tx.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      })
    }
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "PAGADO",
        paidAt: new Date(),
        stripePaymentId,
        statusHistory: { create: { status: "PAGADO", note: "Pago confirmado por Stripe" } },
      },
    })
    return { alreadyPaid: false, orderNumber: o.orderNumber, total: o.total, email: o.email }
  })
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
