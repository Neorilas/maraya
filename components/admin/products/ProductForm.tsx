"use client"

import { useActionState, useState } from "react"
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import {
  Input,
  Textarea,
  Select,
  Toggle,
} from "@/components/admin/forms/Field"
import { ProductImagesField } from "./ProductImagesField"
import {
  createProductAction,
  updateProductAction,
} from "@/lib/admin/products"
import type { ProductFormState } from "@/lib/admin/products-schema"
import { slugify } from "@/lib/slug"

const initial: ProductFormState = { ok: false }

const NO_CATEGORY = { value: "", label: "— Sin categoría —" }

export type ProductFormDefaults = {
  id?: string
  sku: string
  name: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  stock: number
  category: string | null
  tags: string[]
  images: string[]
  imagesAlt: string[]
  isActive: boolean
  isFeatured: boolean
}

export function ProductForm({
  defaults,
  mode,
  categories,
}: {
  defaults: ProductFormDefaults
  mode: "create" | "edit"
  /** Categorías disponibles (vienen de BD desde la page padre). */
  categories: Array<{ slug: string; label: string }>
}) {
  const action = mode === "create" ? createProductAction : updateProductAction
  const [state, formAction, pending] = useActionState(action, initial)
  const errors = state.errors ?? {}

  const categoryOptions = [
    NO_CATEGORY,
    ...categories.map((c) => ({ value: c.slug, label: c.label })),
  ]

  // Slug auto-suggest desde name
  const [name, setName] = useState(defaults.name)
  const [slug, setSlug] = useState(defaults.slug)
  const [slugTouched, setSlugTouched] = useState(mode === "edit")

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setName(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  return (
    <form action={formAction} className="space-y-6">
      {defaults.id && <input type="hidden" name="id" value={defaults.id} />}

      <div className="card-maraya p-5 sm:p-6 space-y-4">
        <h2 className="font-display !text-text-dark text-lg">Datos básicos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="SKU / Referencia"
            name="sku"
            defaultValue={defaults.sku}
            required
            placeholder="BOL-001"
            error={errors.sku}
          />
          <Input
            label="Nombre"
            name="name"
            value={name}
            onChange={onNameChange}
            required
            placeholder="Bolso de mano dorado"
            error={errors.name}
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
            hint="URL del producto. Auto-generado desde el nombre."
            error={errors.slug}
          />
          <Select
            label="Categoría"
            name="category"
            defaultValue={defaults.category ?? ""}
            options={categoryOptions}
            error={errors.category}
          />
          <Textarea
            label="Descripción"
            name="description"
            defaultValue={defaults.description}
            rows={6}
            required
            error={errors.description}
            className="sm:col-span-2"
          />
          <Input
            label="Tags (separados por coma)"
            name="tags"
            defaultValue={defaults.tags.join(", ")}
            placeholder="dorado, fiesta, edición limitada"
            error={errors.tags}
            className="sm:col-span-2"
          />
        </div>
      </div>

      <div className="card-maraya p-5 sm:p-6 space-y-4">
        <h2 className="font-display !text-text-dark text-lg">Precio y stock</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Precio (€)"
            name="price"
            type="number"
            step={0.01}
            min={0}
            defaultValue={defaults.price}
            required
            error={errors.price}
          />
          <Input
            label="Precio rebajado (€)"
            name="salePrice"
            type="number"
            step={0.01}
            min={0}
            defaultValue={defaults.salePrice ?? ""}
            hint="Vacío = sin oferta"
            error={errors.salePrice}
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            min={0}
            defaultValue={defaults.stock}
            required
            error={errors.stock}
          />
        </div>
      </div>

      <div className="card-maraya p-5 sm:p-6 space-y-4">
        <h2 className="font-display !text-text-dark text-lg">Imágenes</h2>
        <ProductImagesField
          initial={defaults.images}
          initialAlts={defaults.imagesAlt}
          error={errors.images}
        />
      </div>

      <div className="card-maraya p-5 sm:p-6 space-y-1">
        <h2 className="font-display !text-text-dark text-lg mb-3">Visibilidad</h2>
        <Toggle
          name="isActive"
          defaultChecked={defaults.isActive}
          label="Producto activo (visible en la tienda)"
        />
        <Toggle
          name="isFeatured"
          defaultChecked={defaults.isFeatured}
          label="Destacado (sale en home como recomendado)"
        />
      </div>

      <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-cream/95 backdrop-blur border-t border-pink-light flex items-center justify-end gap-3 z-20">
        <Flash state={state} pending={pending} />
        <button
          type="submit"
          disabled={pending}
          className="btn-pill btn-pink disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Guardando…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {mode === "create" ? "Crear producto" : "Guardar cambios"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

function Flash({
  state,
  pending,
}: {
  state: ProductFormState
  pending: boolean
}) {
  if (pending || !state.message) return null
  const tone = state.ok
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : "text-red-700 bg-red-50 border-red-200"
  const Icon = state.ok ? CheckCircle2 : AlertCircle
  return (
    <div
      className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border ${tone}`}
    >
      <Icon className="w-4 h-4" />
      {state.message}
    </div>
  )
}
