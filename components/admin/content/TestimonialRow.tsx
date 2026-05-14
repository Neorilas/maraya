"use client"

import { useActionState } from "react"
import { Loader2, Save, Trash2 } from "lucide-react"
import { Input, Textarea, Toggle } from "@/components/admin/forms/Field"
import { InlineFlash } from "./InlineFlash"
import {
  saveTestimonial,
  deleteTestimonial,
  type ActionResult,
} from "@/lib/admin/testimonials"

const initial: ActionResult = { ok: false }

export type TestimonialRowData = {
  id: string
  author: string
  text: string
  rating: number
  source: string | null
  sourceUrl: string | null
  sortOrder: number
  isActive: boolean
}

export function TestimonialRow({ testimonial }: { testimonial: TestimonialRowData }) {
  const [state, formAction, pending] = useActionState(saveTestimonial, initial)
  const errors = state.errors ?? {}

  async function onDelete() {
    if (!confirm(`¿Borrar la reseña de "${testimonial.author}"?`)) return
    await deleteTestimonial(testimonial.id)
  }

  return (
    <form
      action={formAction}
      className="card-maraya p-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr_5rem_auto] gap-3 items-start"
    >
      <input type="hidden" name="id" value={testimonial.id} />

      <Input
        label="Autor"
        name="author"
        defaultValue={testimonial.author}
        required
        error={errors.author}
      />
      <Textarea
        label="Reseña"
        name="text"
        defaultValue={testimonial.text}
        required
        rows={2}
        error={errors.text}
      />

      <Input
        label="Nota"
        name="rating"
        type="number"
        min={1}
        max={5}
        defaultValue={testimonial.rating}
        error={errors.rating}
      />

      <div className="flex flex-col gap-2 lg:items-end lg:pt-6">
        <Toggle
          name="isActive"
          defaultChecked={testimonial.isActive}
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

      {/* Campos colapsados en una fila secundaria */}
      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Fuente"
          name="source"
          defaultValue={testimonial.source ?? ""}
          hint="Ej: Etsy, Google"
          error={errors.source}
        />
        <Input
          label="URL fuente"
          name="sourceUrl"
          defaultValue={testimonial.sourceUrl ?? ""}
          hint="Enlace a la reseña original"
          error={errors.sourceUrl}
        />
        <Input
          label="Orden"
          name="sortOrder"
          type="number"
          min={0}
          max={99}
          defaultValue={testimonial.sortOrder}
          error={errors.sortOrder}
        />
      </div>
    </form>
  )
}
