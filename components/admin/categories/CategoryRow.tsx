"use client"

import { useActionState } from "react"
import { Loader2, Save, Trash2 } from "lucide-react"
import { Input, Toggle } from "@/components/admin/forms/Field"
import { InlineFlash } from "@/components/admin/content/InlineFlash"
import {
  saveCategory,
  deleteCategory,
  type ActionResult,
} from "@/lib/admin/product-categories"

const initial: ActionResult = { ok: false }

export type CategoryRowData = {
  id: string
  slug: string
  label: string
  sortOrder: number
  isActive: boolean
}

export function CategoryRow({ c }: { c: CategoryRowData }) {
  const [state, formAction, pending] = useActionState(saveCategory, initial)
  const errors = state.errors ?? {}

  async function onDelete() {
    if (!confirm(`¿Borrar la categoría "${c.label}"?\n\nSi tiene productos asignados se desactivará en lugar de borrar.`)) return
    await deleteCategory(c.id)
  }

  return (
    <form
      action={formAction}
      className="card-maraya p-3 grid grid-cols-1 sm:grid-cols-[1fr_1fr_5rem_auto] gap-3 items-start"
    >
      <input type="hidden" name="id" value={c.id} />

      <Input
        label="Slug"
        name="slug"
        defaultValue={c.slug}
        required
        error={errors.slug}
      />
      <Input
        label="Etiqueta"
        name="label"
        defaultValue={c.label}
        required
        error={errors.label}
      />
      <Input
        label="Orden"
        name="sortOrder"
        type="number"
        min={0}
        max={999}
        defaultValue={c.sortOrder}
        error={errors.sortOrder}
      />

      <div className="flex flex-col gap-2 sm:items-end sm:justify-between sm:h-full sm:pt-6">
        <Toggle name="isActive" defaultChecked={c.isActive} label="Activa" />
        <div className="flex items-center gap-2 flex-wrap">
          <InlineFlash ok={state.ok} message={state.message} />
          <button
            type="submit"
            disabled={pending}
            className="btn-pill btn-pink !px-3 !py-1.5 text-xs disabled:opacity-60"
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
            className="p-1.5 rounded-full text-red-600 hover:bg-red-50 transition"
            aria-label="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  )
}
