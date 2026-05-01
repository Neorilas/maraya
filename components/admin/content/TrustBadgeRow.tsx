"use client"

import { useActionState } from "react"
import { Loader2, Save, Trash2 } from "lucide-react"
import { Input, Toggle } from "@/components/admin/forms/Field"
import { IconPickerField } from "./IconPickerField"
import { InlineFlash } from "./InlineFlash"
import {
  saveTrustBadge,
  deleteTrustBadge,
  type ActionResult,
} from "@/lib/admin/trust-badges"

const initial: ActionResult = { ok: false }

export type TrustBadgeRowData = {
  id: string
  icon: string
  title: string
  text: string
  sortOrder: number
  isActive: boolean
}

export function TrustBadgeRow({ badge }: { badge: TrustBadgeRowData }) {
  const [state, formAction, pending] = useActionState(saveTrustBadge, initial)
  const errors = state.errors ?? {}

  async function onDelete() {
    if (!confirm(`¿Borrar la trust badge "${badge.title}"?`)) return
    await deleteTrustBadge(badge.id)
  }

  return (
    <form
      action={formAction}
      className="card-maraya p-4 grid grid-cols-1 lg:grid-cols-[auto_1fr_1fr_5rem_auto] gap-3 items-start"
    >
      <input type="hidden" name="id" value={badge.id} />

      <IconPickerField name="icon" defaultValue={badge.icon} error={errors.icon} />

      <Input
        label="Título"
        name="title"
        defaultValue={badge.title}
        required
        error={errors.title}
      />
      <Input
        label="Texto"
        name="text"
        defaultValue={badge.text}
        required
        error={errors.text}
      />
      <Input
        label="Orden"
        name="sortOrder"
        type="number"
        min={0}
        max={99}
        defaultValue={badge.sortOrder}
        error={errors.sortOrder}
      />

      <div className="flex flex-col gap-2 lg:items-end lg:justify-between lg:h-full lg:pt-6">
        <Toggle
          name="isActive"
          defaultChecked={badge.isActive}
          label="Visible"
        />
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
