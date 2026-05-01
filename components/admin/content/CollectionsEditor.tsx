"use client"

import { useActionState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Input, Toggle } from "@/components/admin/forms/Field"
import { InlineFlash } from "./InlineFlash"
import { CollectionRow, type CollectionRowData } from "./CollectionRow"
import { createCollection, type ActionResult } from "@/lib/admin/collections"

const initial: ActionResult = { ok: false }

export function CollectionsEditor({
  collections,
}: {
  collections: CollectionRowData[]
}) {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-display !text-text-dark text-xl">
            Colecciones del home
          </h2>
          <p className="text-xs text-text-mid">
            Las cards del grid "Nuestras colecciones".
          </p>
        </div>
      </header>

      <NewCollectionForm />

      <div className="space-y-3">
        {collections.length === 0 ? (
          <div className="card-maraya p-8 text-center text-text-mid text-sm">
            Aún no hay colecciones. Añade la primera arriba.
          </div>
        ) : (
          collections.map((c) => <CollectionRow key={c.id} c={c} />)
        )}
      </div>
    </div>
  )
}

function NewCollectionForm() {
  const [state, formAction, pending] = useActionState(createCollection, initial)
  const errors = state.errors ?? {}

  return (
    <details className="card-maraya gold-border">
      <summary className="px-4 py-3 cursor-pointer flex items-center gap-2 font-semibold text-pink-deep text-sm">
        <Plus className="w-4 h-4" />
        Añadir colección
      </summary>
      <form action={formAction} className="p-4 border-t border-pink-light space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Slug"
            name="slug"
            required
            placeholder="ej: bolsos-fiesta"
            error={errors.slug}
          />
          <Input
            label="Nombre"
            name="name"
            required
            placeholder="Bolsos de fiesta"
            error={errors.name}
          />
          <Input
            label="Tag"
            name="tag"
            placeholder="Para tus noches especiales"
            error={errors.tag}
          />
          <Input
            label="Gradient"
            name="gradient"
            required
            defaultValue="from-pink-primary to-pink-deep"
            error={errors.gradient}
          />
          <Input
            label="Imagen URL"
            name="imageUrl"
            placeholder="(vacío para usar gradient)"
            error={errors.imageUrl}
          />
          <Input
            label="Link"
            name="href"
            placeholder="(vacío para usar /bolsos?cat=slug)"
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
              defaultValue={99}
              className="w-24"
              error={errors.sortOrder}
            />
            <Toggle name="isActive" defaultChecked={true} label="Visible" />
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
              Crear colección
            </button>
          </div>
        </div>
      </form>
    </details>
  )
}
