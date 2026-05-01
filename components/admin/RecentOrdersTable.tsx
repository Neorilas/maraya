import Link from "next/link"
import { ArrowRight, Inbox } from "lucide-react"
import { OrderStatusBadge, type OrderStatus } from "@/components/admin/OrderStatusBadge"

export type RecentOrderRow = {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: OrderStatus
  createdAt: Date
}

export function RecentOrdersTable({ orders }: { orders: RecentOrderRow[] }) {
  if (orders.length === 0) return <EmptyState />

  return (
    <div className="card-maraya overflow-hidden">
      <div className="px-5 py-4 border-b border-pink-light flex items-center justify-between">
        <h3 className="font-display !text-text-dark text-lg">Pedidos recientes</h3>
        <Link
          href="/admin/pedidos"
          className="text-xs font-bold text-pink-deep hover:text-pink-primary uppercase tracking-wider flex items-center gap-1"
        >
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-text-mid bg-cream/50">
              <th className="text-left px-5 py-2.5 font-bold">Pedido</th>
              <th className="text-left px-5 py-2.5 font-bold">Cliente</th>
              <th className="text-left px-5 py-2.5 font-bold">Estado</th>
              <th className="text-right px-5 py-2.5 font-bold">Total</th>
              <th className="text-right px-5 py-2.5 font-bold">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-pink-light/60 hover:bg-pink-light/30 transition">
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/pedidos/${o.id}`}
                    className="font-bold text-pink-deep hover:underline"
                  >
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-text-dark">{o.customerName}</td>
                <td className="px-5 py-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="px-5 py-3 text-right font-semibold text-text-dark">
                  {o.total.toFixed(2)} €
                </td>
                <td className="px-5 py-3 text-right text-text-mid text-xs">
                  {formatDate(o.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card-maraya p-10 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-pink-light flex items-center justify-center text-pink-deep mb-3">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="font-display !text-text-dark text-lg">Aún no hay pedidos</h3>
      <p className="text-sm text-text-mid mt-1">
        Cuando entren pedidos aparecerán aquí en tiempo real.
      </p>
    </div>
  )
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}
