import Link from "next/link"
import { OrderStatusBadge, type OrderStatus } from "@/components/admin/OrderStatusBadge"

const FORMAT_EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})

export type OrdersTableRow = {
  id: string
  orderNumber: string
  customerName: string
  email: string
  total: number
  status: OrderStatus
  shippingZone: string
  createdAt: Date
}

export function OrdersTable({ rows }: { rows: OrdersTableRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="card-maraya p-10 text-center">
        <p className="font-display !text-text-dark text-lg">Sin pedidos</p>
        <p className="text-sm text-text-mid mt-1">
          Cuando entren pedidos aparecerán aquí.
        </p>
      </div>
    )
  }

  return (
    <div className="card-maraya overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-text-mid bg-cream/50">
              <th className="text-left px-4 py-2.5 font-bold">Pedido</th>
              <th className="text-left px-4 py-2.5 font-bold">Fecha</th>
              <th className="text-left px-4 py-2.5 font-bold">Cliente</th>
              <th className="text-left px-4 py-2.5 font-bold">Estado</th>
              <th className="text-left px-4 py-2.5 font-bold">Zona</th>
              <th className="text-right px-4 py-2.5 font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.id}
                className="border-t border-pink-light/60 hover:bg-pink-light/30 transition"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/pedidos/${o.id}`}
                    className="font-bold text-pink-deep hover:underline"
                  >
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-mid text-xs">
                  {formatDate(o.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-text-dark truncate max-w-[14rem]">
                    {o.customerName}
                  </div>
                  <div className="text-xs text-text-mid truncate max-w-[14rem]">
                    {o.email}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-xs text-text-mid">
                  {o.shippingZone}
                </td>
                <td className="px-4 py-3 text-right font-bold text-text-dark">
                  {FORMAT_EUR.format(o.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatDate(d: Date): string {
  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
