"use client"

import { useActionState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Input, Toggle } from "@/components/admin/forms/Field"
import { IconPickerField } from "./IconPickerField"
import { InlineFlash } from "./InlineFlash"
import { TrustBadgeRow, type TrustBadgeRowData } from "./TrustBadgeRow"
import { createTrustBadge, type ActionResult } from "@/lib/admin/trust-badges"

const initial: ActionResult = { ok: false }

export function TrustBadgesEditor({
  badges,
}: {
  badges: TrustBadgeRowData[]
}) {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-display !text-text-dark text-xl">
            Trust badges
          </h2>
          <p className="text-xs text-text-mid">
            Las 4 cápsulas con icono entre el hero y las colecciones.
          </p>
        </div>
      </header>

      <div className="space-y-3">
        {badges.map((b) => (
          <TrustBadgeRow key={b.id} badge={b} />
        ))}
      </div>

      <NewTrustBadgeForm />
    </div>
  )
}

function NewTrustBadgeForm() {
  const [state, formAction, pending] = useActionState(createTrustBadge, initial)
  const errors = state.errors ?? {}

  return (
    <details className="card-maraya gold-border">
      <summary className="px-4 py-3 cursor-pointer flex items-center gap-2 font-semibold text-pink-deep text-sm">
        <Plus className="w-4 h-4" />
        Añadir trust badge
      </summary>
      <form
        action={formAction}
        className="p-4 border-t border-pink-light grid grid-cols-1 lg:grid-cols-[auto_1fr_1fr_5rem_auto] gap-3 items-start"
      >
        <IconPickerField name="icon" defaultValue="Sparkles" error={errors.icon} />
        <Input label="Título" name="title" required error={errors.title} />
        <Input label="Texto" name="text" required error={errors.text} />
        <Input
          label="Orden"
          name="sortOrder"
          type="number"
          min={0}
          max={99}
          defaultValue={99}
          error={errors.sortOrder}
        />
        <div className="flex flex-col gap-2 lg:items-end lg:pt-6">
          <Toggle name="isActive" defaultChecked={true} label="Visible" />
          <div className="flex items-center gap-2 flex-wrap">
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
