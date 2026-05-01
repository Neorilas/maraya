"use client"

import { useActionState, useState } from "react"
import { Plus, Loader2, FolderTree, ChevronDown } from "lucide-react"
import { Input, Toggle } from "@/components/admin/forms/Field"
import { InlineFlash } from "@/components/admin/content/InlineFlash"
import { CategoryRow, type CategoryRowData } from "./CategoryRow"
import {
  createCategory,
  type ActionResult,
} from "@/lib/admin/product-categories"
import { slugify } from "@/lib/slug"

const initial: ActionResult = { ok: false }

/**
 * Editor de categorías de producto. Va plegable en la lista de productos
 * para no llenar la página cuando no se está usando.
 */
export function CategoriesEditor({
  categories,
}: {
  categories: CategoryRowData[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <section className="card-maraya">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-5 py-3 flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-pink-light text-pink-deep flex items-center justify-center">
            <FolderTree className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-display !text-text-dark text-base leading-tight">
              Categorías de producto
            </h2>
            <p className="text-xs text-text-mid">
              {categories.length} categoría(s) — clic para editar / añadir / borrar
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-text-mid transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-pink-light p-4 space-y-3">
          <NewCategoryForm />
          {categories.length === 0 ? (
            <div className="text-center text-text-mid text-sm py-4">
              Sin categorías. Añade la primera arriba.
            </div>
          ) : (
            categories.map((c) => <CategoryRow key={c.id} c={c} />)
          )}
        </div>
      )}
    </section>
  )
}

function NewCategoryForm() {
  const [state, formAction, pending] = useActionState(createCategory, initial)
  const errors = state.errors ?? {}
  const [label, setLabel] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)

  function onLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setLabel(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  return (
    <details className="rounded-xl bg-pink-light/40 p-3" open>
      <summary className="cursor-pointer flex items-center gap-2 font-semibold text-pink-deep text-sm py-1">
        <Plus className="w-4 h-4" />
        Añadir categoría
      </summary>
      <form
        action={formAction}
        className="pt-3 grid grid-cols-1 sm:grid-cols-[1fr_1fr_5rem_auto] gap-3 items-start"
      >
        <Input
          label="Etiqueta"
          name="label"
          value={label}
          onChange={onLabelChange}
          required
          placeholder="Bolsos de fiesta"
          error={errors.label}
        />
        <Input
          label="Slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugTouched(true)
          }}
          required
          hint="Auto desde la etiqueta"
          error={errors.slug}
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
        <div className="flex flex-col gap-2 sm:items-end sm:pt-6">
          <Toggle name="isActive" defaultChecked={true} label="Activa" />
          <div className="flex items-center gap-2">
            <InlineFlash ok={state.ok} message={state.message} />
            <button
              type="submit"
              disabled={pending}
              className="btn-pill btn-teal !px-3 !py-1.5 text-xs disabled:opacity-60"
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
