"use client"

import { useActionState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Input, Toggle } from "@/components/admin/forms/Field"
import { InlineFlash } from "./InlineFlash"
import { MenuItemRow, type MenuItemRowData } from "./MenuItemRow"
import { createMenuItem, type ActionResult } from "@/lib/admin/menu-items"

const initial: ActionResult = { ok: false }

export function MenuItemsEditor({ items }: { items: MenuItemRowData[] }) {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-display !text-text-dark text-xl">
            Menú principal
          </h2>
          <p className="text-xs text-text-mid">
            Items del header. Desactiva el toggle "Visible" para ocultar uno sin borrarlo.
          </p>
        </div>
      </header>

      <NewMenuItemForm />

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="card-maraya p-8 text-center text-text-mid text-sm">
            Sin items. Añade el primero arriba.
          </div>
        ) : (
          items.map((it) => <MenuItemRow key={it.id} item={it} />)
        )}
      </div>
    </div>
  )
}

function NewMenuItemForm() {
  const [state, formAction, pending] = useActionState(createMenuItem, initial)
  const errors = state.errors ?? {}

  return (
    <details className="card-maraya gold-border">
      <summary className="px-4 py-3 cursor-pointer flex items-center gap-2 font-semibold text-pink-deep text-sm">
        <Plus className="w-4 h-4" />
        Añadir item al menú
      </summary>
      <form
        action={formAction}
        className="p-4 border-t border-pink-light grid grid-cols-1 lg:grid-cols-[1fr_2fr_5rem_auto] gap-3 items-start"
      >
        <Input label="Etiqueta" name="label" required placeholder="Outfits" error={errors.label} />
        <Input
          label="URL"
          name="href"
          required
          placeholder="/outfits"
          error={errors.href}
        />
        <Input
          label="Orden"
          name="sortOrder"
          type="number"
          min={0}
          max={999}
          defaultValue={99}
          error={errors.sortOrder}
        />
        <div className="flex flex-col gap-2 lg:items-end lg:pt-6">
          <div className="flex gap-x-4 flex-wrap">
            <Toggle name="isActive" defaultChecked={true} label="Visible" />
            <Toggle name="hasDropdown" defaultChecked={false} label="Flecha ▼" />
          </div>
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
              Crear
            </button>
          </div>
        </div>
      </form>
    </details>
  )
}
