"use client"

import { useActionState, useState } from "react"
import { Loader2, Save, Truck } from "lucide-react"
import { Select, Input, Textarea } from "@/components/admin/forms/Field"
import { InlineFlash } from "@/components/admin/content/InlineFlash"
import { updateOrderStatus, type ActionResult } from "@/lib/admin/orders"
import type { OrderStatus } from "@/components/admin/OrderStatusBadge"

const initial: ActionResult = { ok: false }

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: "PENDIENTE",      label: "Pendiente" },
  { value: "PAGADO",         label: "Pagado" },
  { value: "EN_PREPARACION", label: "En preparación" },
  { value: "ENVIADO",        label: "Enviado" },
  { value: "ENTREGADO",      label: "Entregado" },
  { value: "CANCELADO",      label: "Cancelado" },
  { value: "REEMBOLSADO",    label: "Reembolsado" },
]

const SHIPPING_COMPANIES = [
  "",
  "SEUR",
  "Correos",
  "Correos Express",
  "MRW",
  "GLS",
  "DHL",
  "UPS",
  "FedEx",
  "Nacex",
  "Envialia",
  "Otro",
]

export function OrderStatusForm({
  orderId,
  currentStatus,
  trackingNumber,
  shippingCompany,
}: {
  orderId: string
  currentStatus: OrderStatus
  trackingNumber: string | null
  shippingCompany: string | null
}) {
  const [state, formAction, pending] = useActionState(updateOrderStatus, initial)
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus)

  const showShippingFields = selectedStatus === "ENVIADO"

  return (
    <form action={formAction} className="card-maraya p-5 space-y-4">
      <input type="hidden" name="orderId" value={orderId} />

      <h2 className="font-display !text-text-dark text-lg">Cambiar estado</h2>

      <Select
        label="Nuevo estado"
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
        hint="Algunos estados envían email automático al cliente."
      />

      {showShippingFields && (
        <div className="space-y-3 p-3 rounded-xl bg-teal-50/60 border-2 border-teal-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700">
            <Truck className="w-4 h-4" />
            Datos de envío
          </div>

          <Select
            label="Compañía de envío"
            name="shippingCompany"
            defaultValue={shippingCompany ?? ""}
            options={SHIPPING_COMPANIES.map((c) => ({
              value: c,
              label: c || "— Seleccionar —",
            }))}
          />

          <Input
            label="Número de seguimiento"
            name="trackingNumber"
            defaultValue={trackingNumber ?? ""}
            placeholder="Ej: SEUR123456789"
            hint="Se incluye en el email al cliente."
          />
        </div>
      )}

      {!showShippingFields && (
        <>
          <input type="hidden" name="trackingNumber" value={trackingNumber ?? ""} />
          <input type="hidden" name="shippingCompany" value={shippingCompany ?? ""} />
        </>
      )}

      <Textarea
        label="Nota interna (opcional)"
        name="note"
        rows={2}
        placeholder="Visible solo en el historial del admin."
      />

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-pink-light">
        <InlineFlash ok={state.ok} message={state.message} />
        <button
          type="submit"
          disabled={pending}
          className="btn-pill btn-pink !px-4 !py-2 text-xs disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Actualizar estado
        </button>
      </div>
    </form>
  )
}
