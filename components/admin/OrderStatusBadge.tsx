import { cn } from "@/lib/cn"

export type OrderStatus =
  | "PENDIENTE"
  | "PAGADO"
  | "EN_PREPARACION"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO"
  | "REEMBOLSADO"

const STATUS_STYLE: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  PENDIENTE:      { bg: "bg-gold-light",    text: "text-gold",        label: "Pendiente" },
  PAGADO:         { bg: "bg-teal-light",    text: "text-teal-primary", label: "Pagado" },
  EN_PREPARACION: { bg: "bg-pink-light",    text: "text-pink-deep",   label: "Preparando" },
  ENVIADO:        { bg: "bg-blue-100",      text: "text-blue-700",    label: "Enviado" },
  ENTREGADO:      { bg: "bg-emerald-100",   text: "text-emerald-700", label: "Entregado" },
  CANCELADO:      { bg: "bg-gray-100",      text: "text-gray-600",    label: "Cancelado" },
  REEMBOLSADO:    { bg: "bg-orange-100",    text: "text-orange-700",  label: "Reembolsado" },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
        s.bg,
        s.text,
      )}
    >
      {s.label}
    </span>
  )
}
