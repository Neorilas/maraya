import {
  ShoppingBag,
  CalendarDays,
  CalendarRange,
  Wallet,
  PackageCheck,
  AlertTriangle,
} from "lucide-react"
import { getDashboardStats } from "@/lib/admin/dashboard"
import { StatsCard } from "@/components/admin/StatsCard"
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable"

export const dynamic = "force-dynamic"

const FORMAT_EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display italic text-3xl !text-text-dark">
          Dashboard
        </h1>
        <p className="text-text-mid mt-1 text-sm">
          Resumen del estado de la tienda en tiempo real.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          label="Pedidos hoy"
          value={stats.ordersToday}
          icon={CalendarDays}
          tone="pink"
        />
        <StatsCard
          label="Esta semana"
          value={stats.ordersThisWeek}
          icon={CalendarRange}
          tone="teal"
        />
        <StatsCard
          label="Este mes"
          value={stats.ordersThisMonth}
          icon={ShoppingBag}
          tone="gold"
        />
        <StatsCard
          label="Ingresos del mes"
          value={FORMAT_EUR.format(stats.revenueThisMonth)}
          hint="Pedidos pagados, en preparación, enviados o entregados"
          icon={Wallet}
          tone="teal"
        />
        <StatsCard
          label="Pendientes de enviar"
          value={stats.ordersPending}
          hint={stats.ordersPending > 0 ? "Revisa pedidos pagados" : "Todo al día"}
          icon={PackageCheck}
          tone={stats.ordersPending > 0 ? "alert" : "pink"}
        />
        <StatsCard
          label="Stock bajo"
          value={stats.productsLowStock}
          hint="Productos con menos de 3 unidades"
          icon={AlertTriangle}
          tone={stats.productsLowStock > 0 ? "alert" : "gold"}
        />
      </section>

      <section>
        <RecentOrdersTable orders={stats.recentOrders} />
      </section>
    </div>
  )
}
