import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle2, Mail, Package, Clock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ClearCartOnMount } from "@/components/store/ClearCartOnMount"
import { OrderStatusPoller } from "@/components/store/OrderStatusPoller"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Pedido confirmado · Maraya Collection",
  robots: { index: false, follow: false },
}

const FORMAT_EUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" })

export default async function PedidoConfirmadoPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string; token?: string }>
}) {
  const { orderNumber } = await params
  const sp = await searchParams

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  })
  if (!order) notFound()
  if (order.trackingToken && sp.token !== order.trackingToken) notFound()

  const isPaid = order.status !== "PENDIENTE" && order.status !== "CANCELADO"
  const isPending = order.status === "PENDIENTE"
  const failed = sp.redirect_status === "failed"

  return (
    <div className="bg-cream/40 min-h-[60vh]">
      <ClearCartOnMount />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="card-maraya gold-border p-8 text-center">
          {isPaid ? (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="font-script text-2xl text-pink-primary">¡Gracias!</p>
              <h1 className="font-display italic !text-text-dark text-3xl mt-1">
                Pedido confirmado
              </h1>
              <p className="text-text-mid mt-2">
                Te llegará un email de confirmación en breve.
              </p>
            </>
          ) : isPending ? (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-gold-light flex items-center justify-center text-gold mb-3">
                <Clock className="w-8 h-8" />
              </div>
              <h1 className="font-display italic !text-text-dark text-3xl">
                Estamos confirmando tu pago
              </h1>
              <p className="text-text-mid mt-2">
                {failed
                  ? "Hubo un problema con el pago. Intenta de nuevo o usa otra tarjeta."
                  : "Esto suele tardar unos segundos. Si la página no se actualiza, recárgala."}
              </p>
              {!failed && <OrderStatusPoller />}
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-3">
                <Package className="w-8 h-8" />
              </div>
              <h1 className="font-display italic !text-text-dark text-3xl">
                Pedido cancelado
              </h1>
            </>
          )}

          <p className="mt-4 text-sm text-text-mid">Número de pedido</p>
          <p className="font-mono font-bold text-text-dark text-lg">{order.orderNumber}</p>

          <div className="mt-6 pt-6 border-t border-pink-light grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-text-mid uppercase tracking-wider font-bold">Total</p>
              <p className="text-pink-deep font-display italic text-2xl">
                {FORMAT_EUR.format(order.total)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-mid uppercase tracking-wider font-bold">Email</p>
              <p className="text-text-dark font-semibold flex items-center gap-1.5 justify-end">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{order.email}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/seguimiento/${order.orderNumber}${order.trackingToken ? `?token=${order.trackingToken}` : ""}`}
              className="btn-pill btn-pink"
            >
              Seguir mi pedido
            </Link>
            <Link href="/bolsos" className="btn-pill bg-white gold-border text-text-dark hover:bg-gold-light">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
