import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { markOrderAsPaid } from "@/lib/order"
import { sendOrderConfirmationEmails } from "@/lib/email/notifications"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Webhook Stripe. Verifica firma, procesa eventos y actúa de forma idempotente.
 * En dev, levantar `stripe listen --forward-to localhost:3000/api/stripe/webhook`
 * para reenviar eventos.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret no configurado" }, { status: 503 })
  }

  const sig = req.headers.get("stripe-signature")
  if (!sig) return NextResponse.json({ error: "Sin firma" }, { status: 400 })

  // Necesitamos el body RAW (texto) para que el SDK pueda verificar la firma.
  const raw = await req.text()

  let event: Stripe.Event
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "firma inválida"
    return NextResponse.json({ error: `Webhook signature: ${msg}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent
        const orderId = pi.metadata?.orderId
        if (!orderId) break

        const result = await markOrderAsPaid(orderId, pi.id)
        if (result && !result.alreadyPaid) {
          await sendOrderConfirmationEmails(orderId)
        }
        break
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent
        const orderId = pi.metadata?.orderId
        if (orderId) {
          // Marcamos un evento informativo en el historial (status sigue PENDIENTE)
          await prisma.orderStatusHistory.create({
            data: {
              orderId,
              status: "PENDIENTE",
              note: `Pago fallido: ${pi.last_payment_error?.message ?? "sin detalle"}`,
            },
          })
        }
        break
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : null
        if (piId) {
          const order = await prisma.order.findFirst({ where: { stripePaymentId: piId } })
          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: "REEMBOLSADO",
                statusHistory: { create: { status: "REEMBOLSADO", note: "Reembolso confirmado por Stripe" } },
              },
            })
          }
        }
        break
      }
      default:
        // Ignoramos otros eventos.
        break
    }
  } catch (err) {
    console.error("[stripe webhook] error procesando evento", event.type, err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
