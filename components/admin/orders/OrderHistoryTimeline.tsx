import { OrderStatusBadge, type OrderStatus } from "@/components/admin/OrderStatusBadge"

export type HistoryEvent = {
  id: string
  status: OrderStatus
  note: string | null
  createdAt: Date
}

export function OrderHistoryTimeline({ events }: { events: HistoryEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="text-sm text-text-mid italic">Sin historial todavía.</div>
    )
  }
  return (
    <ol className="space-y-3 relative pl-5">
      <span
        className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-pink-light"
        aria-hidden
      />
      {events.map((e) => (
        <li key={e.id} className="relative">
          <span
            className="absolute -left-3.5 top-1.5 w-2.5 h-2.5 rounded-full bg-pink-primary ring-2 ring-white"
            aria-hidden
          />
          <div className="flex flex-wrap items-baseline gap-2">
            <OrderStatusBadge status={e.status} />
            <time className="text-xs text-text-mid">{formatDate(e.createdAt)}</time>
          </div>
          {e.note && (
            <p className="text-sm text-text-dark mt-1 italic">"{e.note}"</p>
          )}
        </li>
      ))}
    </ol>
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
