import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, User, Mail, Phone, FileText, CreditCard } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { OrderStatusBadge, type OrderStatus } from "@/components/admin/OrderStatusBadge"
import { OrderStatusForm } from "@/components/admin/orders/OrderStatusForm"
import { OrderItemsTable } from "@/components/admin/orders/OrderItemsTable"
import { OrderHistoryTimeline } from "@/components/admin/orders/OrderHistoryTimeline"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Pedido · Maraya Admin",
  robots: { index: false, follow: false },
}

const FORMAT_EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const o = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  })
  if (!o) notFound()

  const fullName = `${o.firstName} ${o.lastName}`.trim()
  const fullAddress = [
    o.address,
    o.addressLine2,
    `${o.postalCode} ${o.city}`,
    o.province,
    o.country,
  ]
    .filter(Boolean)
    .join("\n")

  return (
    <div className="space-y-6 max-w-5xl">
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-pink-deep hover:text-pink-primary transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a pedidos
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display italic text-3xl !text-text-dark">
            {o.orderNumber}
          </h1>
          <p className="text-sm text-text-mid mt-1">
            {o.createdAt.toLocaleString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <OrderStatusBadge status={o.status as OrderStatus} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-4 lg:gap-6">
        <div className="space-y-6">
          <section>
            <h2 className="font-display !text-text-dark text-lg mb-3">
              Productos
            </h2>
            <OrderItemsTable
              items={o.items.map((it) => ({
                id: it.id,
                productName: it.productName,
                price: it.price,
                quantity: it.quantity,
              }))}
            />
          </section>

          <section className="card-maraya p-4 sm:p-5 space-y-2 text-sm">
            <h2 className="font-display !text-text-dark text-lg mb-2">Totales</h2>
            <Row label="Subtotal" value={FORMAT_EUR.format(o.subtotal)} />
            <Row
              label={`Envío · ${o.shippingZone}`}
              value={o.shippingCost === 0 ? "GRATIS" : FORMAT_EUR.format(o.shippingCost)}
            />
            <div className="pt-3 border-t border-pink-light flex items-baseline justify-between">
              <span className="font-bold text-text-dark">Total pagado</span>
              <span className="font-display italic text-pink-deep text-2xl">
                {FORMAT_EUR.format(o.total)}
              </span>
            </div>
          </section>

          <section>
            <h2 className="font-display !text-text-dark text-lg mb-3">
              Historial
            </h2>
            <OrderHistoryTimeline
              events={o.statusHistory.map((h) => ({
                id: h.id,
                status: h.status as OrderStatus,
                note: h.note,
                createdAt: h.createdAt,
              }))}
            />
          </section>
        </div>

        <div className="space-y-6">
          <OrderStatusForm
            orderId={o.id}
            currentStatus={o.status as OrderStatus}
            trackingNumber={o.trackingNumber}
          />

          <section className="card-maraya p-4 sm:p-5 space-y-3 text-sm">
            <h2 className="font-display !text-text-dark text-lg">
              Datos del cliente
            </h2>
            <Detail icon={User} label="Nombre" value={fullName} />
            <Detail icon={FileText} label="DNI/NIE" value={o.dni} />
            <Detail icon={Mail} label="Email">
              <a href={`mailto:${o.email}`} className="text-pink-deep hover:underline">
                {o.email}
              </a>
            </Detail>
            <Detail icon={Phone} label="Teléfono">
              <a href={`tel:${o.phone}`} className="text-pink-deep hover:underline">
                {o.phone}
              </a>
            </Detail>
            <Detail icon={MapPin} label="Dirección de envío">
              <span className="whitespace-pre-line">{fullAddress}</span>
            </Detail>
          </section>

          {o.stripePaymentId && (
            <section className="card-maraya p-4 sm:p-5 space-y-2 text-sm">
              <h2 className="font-display !text-text-dark text-lg">Pago</h2>
              <Detail icon={CreditCard} label="Stripe Payment Intent">
                <a
                  href={`https://dashboard.stripe.com/payments/${o.stripePaymentId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-pink-deep hover:underline break-all"
                >
                  {o.stripePaymentId}
                </a>
              </Detail>
              {o.paidAt && (
                <Detail icon={CreditCard} label="Confirmado el">
                  {o.paidAt.toLocaleString("es-ES")}
                </Detail>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-mid">{label}</span>
      <span className="font-semibold text-text-dark">{value}</span>
    </div>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-pink-deep mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider text-text-mid">
          {label}
        </div>
        <div className="text-text-dark">{children ?? value}</div>
      </div>
    </div>
  )
}
