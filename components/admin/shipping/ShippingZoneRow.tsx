"use client"

import { useActionState } from "react"
import { Loader2, Save, Trash2 } from "lucide-react"
import { Input, Toggle } from "@/components/admin/forms/Field"
import { InlineFlash } from "@/components/admin/content/InlineFlash"
import {
  saveShippingZone,
  deleteShippingZone,
  type ActionResult,
} from "@/lib/admin/shipping-zones"

const initial: ActionResult = { ok: false }

export type ShippingZoneRowData = {
  id: string
  code: string
  name: string
  price: number
  freeFrom: number | null
  days: string
  isActive: boolean
}

export function ShippingZoneRow({ z }: { z: ShippingZoneRowData }) {
  const [state, formAction, pending] = useActionState(saveShippingZone, initial)
  const errors = state.errors ?? {}

  async function onDelete() {
    if (!confirm(`¿Eliminar la zona "${z.name}"?`)) return
    await deleteShippingZone(z.id)
  }

  return (
    <form action={formAction} className="card-maraya p-4 space-y-3">
      <input type="hidden" name="id" value={z.id} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_8rem_8rem_8rem_8rem] gap-3">
        <Input
          label="Nombre"
          name="name"
          defaultValue={z.name}
          required
          error={errors.name}
        />
        <Input
          label="Código"
          name="code"
          defaultValue={z.code}
          required
          hint="MAYÚSCULAS"
          error={errors.code}
        />
        <Input
          label="Precio (€)"
          name="price"
          type="number"
          step={0.01}
          min={0}
          defaultValue={z.price}
          required
          error={errors.price}
        />
        <Input
          label="Gratis desde (€)"
          name="freeFrom"
          type="number"
          step={0.01}
          min={0}
          defaultValue={z.freeFrom ?? ""}
          hint="Vacío = nunca"
          error={errors.freeFrom}
        />
        <Input
          label="Días estimados"
          name="days"
          defaultValue={z.days}
          required
          error={errors.days}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-pink-light">
        <Toggle
          name="isActive"
          defaultChecked={z.isActive}
          label="Zona activa (visible en checkout)"
        />
        <div className="flex items-center gap-2">
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
            Guardar
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-full text-red-600 hover:bg-red-50 transition"
            aria-label="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  )
}
