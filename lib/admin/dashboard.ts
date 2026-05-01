import { prisma } from "@/lib/prisma"
import type { OrderStatus } from "@/components/admin/OrderStatusBadge"
import type { RecentOrderRow } from "@/components/admin/RecentOrdersTable"

export type DashboardStats = {
  ordersToday: number
  ordersThisWeek: number
  ordersThisMonth: number
  revenueThisMonth: number
  ordersPending: number
  productsLowStock: number
  recentOrders: RecentOrderRow[]
}

const LOW_STOCK_THRESHOLD = 3

/**
 * Carga los KPIs del dashboard. Todas las queries son agregadas y baratas;
 * dispara en paralelo.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(now)
  const day = startOfWeek.getDay() || 7 // domingo = 7
  startOfWeek.setDate(startOfWeek.getDate() - (day - 1))
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    ordersToday,
    ordersThisWeek,
    ordersThisMonth,
    revenueAgg,
    ordersPending,
    productsLowStock,
    recentRaw,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: startOfMonth },
        status: { in: ["PAGADO", "EN_PREPARACION", "ENVIADO", "ENTREGADO"] },
      },
    }),
    prisma.order.count({
      where: { status: { in: ["PAGADO", "EN_PREPARACION"] } },
    }),
    prisma.product.count({
      where: { isActive: true, stock: { lt: LOW_STOCK_THRESHOLD } },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        firstName: true,
        lastName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    }),
  ])

  const recentOrders: RecentOrderRow[] = recentRaw.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: `${o.firstName} ${o.lastName}`.trim(),
    total: o.total,
    status: o.status as OrderStatus,
    createdAt: o.createdAt,
  }))

  return {
    ordersToday,
    ordersThisWeek,
    ordersThisMonth,
    revenueThisMonth: revenueAgg._sum.total ?? 0,
    ordersPending,
    productsLowStock,
    recentOrders,
  }
}
