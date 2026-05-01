import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Package,
  CreditCard,
  Settings,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Mail,
  MapPin,
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { OrderStatusBadge, type OrderStatus } from "@/components/admin/OrderStatusBadge"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Seguimiento del pedido · Maraya Store",
  robots: { index: false, follow: false },
}

const FORMAT_EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})

const STATUS_ORDER: OrderStatus[] = [
  "PENDIENTE",
  "PAGADO",
  "EN_PREPARACION",
  "ENVIADO",
  "ENTREGADO",
]

const STATUS_META: Record<
  OrderStatus,
  { icon: React.ComponentType<{ className?: string }>; label: string; description: string }
> = {
  PENDIENTE:      { icon: Package,      label: "Pedido recibido",     description: "Estamos a la espera de confirmar el pago." },
  PAGADO:         { icon: CreditCard,   label: "Pago confirmado",     description: "Tu pago ha sido confirmado correctamente." },
  EN_PREPARACION: { icon: Settings,     label: "En preparación",      description: "Estamos preparando tu pedido con muchísimo mimo." },
  ENVIADO:        { icon: Truck,        label: "En camino",           description: "Tu pedido ya está de viaje." },
  ENTREGADO:      { icon: CheckCircle2, label: "Entregado",           description: "¡Tu pedido ya está en tus manos!" },
  CANCELADO:      { icon: XCircle,      label: "Cancelado",           description: "Este pedido ha sido cancelado." },
  REEMBOLSADO:    { icon: RotateCcw,    label: "Reembolsado",         description: "El reembolso está en proceso." },
}

export default async function SeguimientoPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params
  const o = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, statusHistory: { orderBy: { createdAt: "asc" } } },
  })
  if (!o) notFound()

  const status = o.status as OrderStatus
  const isCancelled = status === "CANCELADO" || status === "REEMBOLSADO"
  const currentStep = STATUS_ORDER.indexOf(status)

  return (
    <div className="bg-cream/40 min-h-[60vh]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <header className="text-center mb-8">
          <span className="font-script text-2xl text-pink-primary">Tu pedido</span>
          <h1 className="font-display italic !text-text-dark text-3xl">
            {o.orderNumber}
          </h1>
          <div className="divider-heart">
            <span aria-hidden>♡</span>
          </div>
          <div className="flex justify-center">
            <OrderStatusBadge status={status} />
          </div>
        </header>

        {!isCancelled ? (
          <ProgressSteps currentStep={currentStep} />
        ) : (
          <div className="card-maraya gold-border p-6 text-center">
            <p className="font-display !text-text-dark text-lg">
              {STATUS_META[status].label}
            </p>
            <p className="text-sm text-text-mid mt-1">
              {STATUS_META[status].description}
            </p>
          </div>
        )}

        {o.trackingNumber && status === "ENVIADO" && (
          <div className="card-maraya gold-border p-4 mt-6 text-center">
            <p className="text-xs uppercase tracking-wider font-bold text-text-mid">
              Número de seguimiento
            </p>
            <p className="font-mono font-bold text-text-dark text-lg mt-1">
              {o.trackingNumber}
            </p>
          </div>
        )}

        <section className="card-maraya p-5 mt-6 space-y-3">
          <h2 className="font-display !text-text-dark text-lg">Resumen</h2>
          <ul className="space-y-2">
            {o.items.map((it) => (
              <li key={it.id} className="flex justify-between text-sm">
                <span>
                  <strong className="text-text-dark">{it.productName}</strong>{" "}
                  <span className="text-text-mid">× {it.quantity}</span>
                </span>
                <span className="font-bold text-text-dark">
                  {FORMAT_EUR.format(it.price * it.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="pt-3 border-t border-pink-light flex justify-between text-sm">
            <span className="text-text-mid">Subtotal</span>
            <span className="font-semibold">{FORMAT_EUR.format(o.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-mid">Envío</span>
            <span className="font-semibold">
              {o.shippingCost === 0 ? "GRATIS" : FORMAT_EUR.format(o.shippingCost)}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-3 border-t border-pink-light">
            <span className="font-bold text-text-dark">Total</span>
            <span className="font-display italic text-pink-deep text-2xl">
              {FORMAT_EUR.format(o.total)}
            </span>
          </div>
        </section>

        <section className="card-maraya p-5 mt-6 space-y-3 text-sm">
          <h2 className="font-display !text-text-dark text-lg">Datos del envío</h2>
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-pink-deep mt-0.5 shrink-0" />
            <span>{o.email}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-pink-deep mt-0.5 shrink-0" />
            <span className="whitespace-pre-line">
              {[o.address, o.addressLine2, `${o.postalCode} ${o.city}`, o.province, o.country]
                .filter(Boolean)
                .join("\n")}
            </span>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/bolsos" className="btn-pill btn-pink">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProgressSteps({ currentStep }: { currentStep: number }) {
  return (
    <ol className="grid grid-cols-5 gap-1 sm:gap-2">
      {STATUS_ORDER.map((status, i) => {
        const meta = STATUS_META[status]
        const Icon = meta.icon
        const done = i <= currentStep
        const current = i === currentStep
        return (
          <li key={status} className="flex flex-col items-center text-center">
            <span
              className={
                "w-10 h-10 rounded-full flex items-center justify-center transition " +
                (done
                  ? "bg-pink-primary text-white shadow-[0_4px_14px_rgba(244,114,182,0.4)]"
                  : "bg-pink-light text-pink-deep") +
                (current ? " ring-2 ring-pink-primary ring-offset-2 ring-offset-cream" : "")
              }
            >
              <Icon className="w-5 h-5" />
            </span>
            <span
              className={
                "text-[10px] sm:text-xs mt-2 font-semibold " +
                (done ? "text-pink-deep" : "text-text-mid")
              }
            >
              {meta.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
