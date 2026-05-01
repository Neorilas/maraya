import Link from "next/link"
import { Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import {
  OrdersTable,
  type OrdersTableRow,
} from "@/components/admin/orders/OrdersTable"
import type { OrderStatus } from "@/components/admin/OrderStatusBadge"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Pedidos · Maraya Admin",
  robots: { index: false, follow: false },
}

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: "",               label: "Todos" },
  { value: "PENDIENTE",      label: "Pendientes" },
  { value: "PAGADO",         label: "Pagados" },
  { value: "EN_PREPARACION", label: "En preparación" },
  { value: "ENVIADO",        label: "Enviados" },
  { value: "ENTREGADO",      label: "Entregados" },
  { value: "CANCELADO",      label: "Cancelados" },
  { value: "REEMBOLSADO",    label: "Reembolsados" },
]

export default async function PedidosListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const sp = await searchParams
  const q = (sp.q ?? "").trim()
  const status = (sp.status ?? "").trim() as OrderStatus | ""

  const orders = await prisma.order.findMany({
    where: {
      ...(q && {
        OR: [
          { orderNumber: { contains: q, mode: "insensitive" } },
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      orderNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      total: true,
      status: true,
      shippingZone: true,
      createdAt: true,
    },
  })

  const rows: OrdersTableRow[] = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: `${o.firstName} ${o.lastName}`.trim(),
    email: o.email,
    total: o.total,
    status: o.status as OrderStatus,
    shippingZone: o.shippingZone,
    createdAt: o.createdAt,
  }))

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display italic text-3xl !text-text-dark">Pedidos</h1>
        <p className="text-text-mid mt-1 text-sm">
          {orders.length} pedido(s) {q || status ? "que coinciden con los filtros" : "totales"}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = (status ?? "") === f.value
          const params = new URLSearchParams()
          if (q) params.set("q", q)
          if (f.value) params.set("status", f.value)
          const href = params.toString() ? `/admin/pedidos?${params}` : "/admin/pedidos"
          return (
            <Link
              key={f.value}
              href={href}
              className={
                active
                  ? "px-3 py-1.5 rounded-full bg-pink-primary text-white text-xs font-semibold"
                  : "px-3 py-1.5 rounded-full bg-pink-light text-text-dark hover:bg-pink-primary hover:text-white text-xs font-semibold transition"
              }
            >
              {f.label}
            </Link>
          )
        })}
      </div>

      <form className="card-maraya p-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-pink-deep ml-2" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nº pedido, nombre, email…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-mid/60"
        />
        {status && <input type="hidden" name="status" value={status} />}
        <button type="submit" className="btn-pill btn-pink !px-4 !py-2 text-xs">
          Buscar
        </button>
        {(q || status) && (
          <Link
            href="/admin/pedidos"
            className="text-xs font-semibold text-text-mid hover:text-pink-deep px-2"
          >
            Limpiar
          </Link>
        )}
      </form>

      <OrdersTable rows={rows} />
    </div>
  )
}
