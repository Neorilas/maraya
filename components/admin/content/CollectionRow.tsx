"use client"

import { useActionState } from "react"
import { Loader2, Save, Trash2 } from "lucide-react"
import { Input, Toggle } from "@/components/admin/forms/Field"
import { InlineFlash } from "./InlineFlash"
import { CollectionImageField } from "./CollectionImageField"
import {
  CollectionDestinationField,
  type DestinationCategoryOption,
} from "./CollectionDestinationField"
import {
  saveCollection,
  deleteCollection,
  type ActionResult,
} from "@/lib/admin/collections"

const initial: ActionResult = { ok: false }

export type CollectionRowData = {
  id: string
  slug: string
  name: string
  tag: string | null
  gradient: string
  imageUrl: string | null
  imageAlt: string | null
  href: string | null
  sortOrder: number
  isActive: boolean
}

export function CollectionRow({
  c,
  categories,
}: {
  c: CollectionRowData
  categories: DestinationCategoryOption[]
}) {
  const [state, formAction, pending] = useActionState(saveCollection, initial)
  const errors = state.errors ?? {}

  async function onDelete() {
    if (!confirm(`¿Borrar la colección "${c.name}"?`)) return
    await deleteCollection(c.id)
  }

  return (
    <form action={formAction} className="card-maraya p-5 space-y-4">
      <input type="hidden" name="id" value={c.id} />

      {/* Preview rápido del gradient */}
      <div className="flex items-center gap-3">
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${c.gradient} gold-border shrink-0`}
          aria-hidden
        />
        <div className="min-w-0">
          <div className="font-display !text-text-dark text-lg leading-tight truncate">
            {c.name}
          </div>
          <div className="text-xs text-text-mid font-mono">/bolsos?cat={c.slug}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Slug" name="slug" defaultValue={c.slug} required error={errors.slug} />
        <Input label="Nombre" name="name" defaultValue={c.name} required error={errors.name} />
        <Input
          label="Tag (texto pequeño)"
          name="tag"
          defaultValue={c.tag ?? ""}
          hint="Frase corta sobre el nombre"
          error={errors.tag}
        />
        <Input
          label="Gradient (clases Tailwind)"
          name="gradient"
          defaultValue={c.gradient}
          required
          hint="Ej: from-pink-primary to-pink-deep"
          error={errors.gradient}
        />
        <CollectionImageField
          initialUrl={c.imageUrl}
          initialAlt={c.imageAlt}
          errorUrl={errors.imageUrl}
          errorAlt={errors.imageAlt}
        />
        <CollectionDestinationField
          initialHref={c.href}
          categories={categories}
          error={errors.href}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-pink-light">
        <div className="flex items-center gap-4 flex-wrap">
          <Input
            label="Orden"
            name="sortOrder"
            type="number"
            min={0}
            max={99}
            defaultValue={c.sortOrder}
            className="w-24"
            error={errors.sortOrder}
          />
          <Toggle
            name="isActive"
            defaultChecked={c.isActive}
            label="Visible en home"
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
