"use client"

import { useActionState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Input, Toggle } from "@/components/admin/forms/Field"
import { InlineFlash } from "@/components/admin/content/InlineFlash"
import { ShippingZoneRow, type ShippingZoneRowData } from "./ShippingZoneRow"
import {
  createShippingZone,
  type ActionResult,
} from "@/lib/admin/shipping-zones"

const initial: ActionResult = { ok: false }

export function ShippingZonesEditor({
  zones,
}: {
  zones: ShippingZoneRowData[]
}) {
  return (
    <div className="space-y-4">
      <NewZoneForm />
      {zones.length === 0 ? (
        <div className="card-maraya p-8 text-center text-text-mid text-sm">
          No hay zonas. Añade la primera arriba.
        </div>
      ) : (
        zones.map((z) => <ShippingZoneRow key={z.id} z={z} />)
      )}
    </div>
  )
}

function NewZoneForm() {
  const [state, formAction, pending] = useActionState(createShippingZone, initial)
  const errors = state.errors ?? {}

  return (
    <details className="card-maraya gold-border">
      <summary className="px-4 py-3 cursor-pointer flex items-center gap-2 font-semibold text-pink-deep text-sm">
        <Plus className="w-4 h-4" />
        Añadir zona de envío
      </summary>
      <form action={formAction} className="p-4 border-t border-pink-light space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_8rem_8rem_8rem_8rem] gap-3">
          <Input
            label="Nombre"
            name="name"
            placeholder="Andorra"
            required
            error={errors.name}
          />
          <Input
            label="Código"
            name="code"
            placeholder="ANDORRA"
            required
            error={errors.code}
          />
          <Input
            label="Precio (€)"
            name="price"
            type="number"
            step={0.01}
            min={0}
            defaultValue={9.99}
            required
            error={errors.price}
          />
          <Input
            label="Gratis desde (€)"
            name="freeFrom"
            type="number"
            step={0.01}
            min={0}
            placeholder="(vacío)"
            error={errors.freeFrom}
          />
          <Input
            label="Días estimados"
            name="days"
            placeholder="3-5 días"
            required
            error={errors.days}
          />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-pink-light">
          <Toggle name="isActive" defaultChecked={true} label="Activa" />
          <div className="flex items-center gap-2">
            <InlineFlash ok={state.ok} message={state.message} />
            <button
              type="submit"
              disabled={pending}
              className="btn-pill btn-teal !px-4 !py-2 text-xs disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              Crear zona
            </button>
          </div>
        </div>
      </form>
    </details>
  )
}
