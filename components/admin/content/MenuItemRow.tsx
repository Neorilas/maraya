"use client"

import { useActionState } from "react"
import { Loader2, Save, Trash2 } from "lucide-react"
import { Input, Toggle } from "@/components/admin/forms/Field"
import { InlineFlash } from "./InlineFlash"
import { saveMenuItem, deleteMenuItem, type ActionResult } from "@/lib/admin/menu-items"

const initial: ActionResult = { ok: false }

export type MenuItemRowData = {
  id: string
  label: string
  href: string
  sortOrder: number
  isActive: boolean
  hasDropdown: boolean
}

export function MenuItemRow({ item }: { item: MenuItemRowData }) {
  const [state, formAction, pending] = useActionState(saveMenuItem, initial)
  const errors = state.errors ?? {}

  async function onDelete() {
    if (!confirm(`¿Borrar el item "${item.label}"?`)) return
    await deleteMenuItem(item.id)
  }

  return (
    <form
      action={formAction}
      className="card-maraya p-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr_5rem_auto] gap-3 items-start"
    >
      <input type="hidden" name="id" value={item.id} />

      <Input
        label="Etiqueta"
        name="label"
        defaultValue={item.label}
        required
        error={errors.label}
      />
      <Input
        label="URL"
        name="href"
        defaultValue={item.href}
        required
        hint="Ej: /bolsos, /bolsos?cat=clutch, /sobre-nosotros"
        error={errors.href}
      />
      <Input
        label="Orden"
        name="sortOrder"
        type="number"
        min={0}
        max={999}
        defaultValue={item.sortOrder}
        error={errors.sortOrder}
      />

      <div className="flex flex-col gap-2 lg:items-end lg:justify-between lg:h-full lg:pt-6">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Toggle name="isActive" defaultChecked={item.isActive} label="Visible" />
          <Toggle
            name="hasDropdown"
            defaultChecked={item.hasDropdown}
            label="Flecha ▼"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
