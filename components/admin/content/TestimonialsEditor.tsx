"use client"

import { useActionState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Input, Textarea, Toggle } from "@/components/admin/forms/Field"
import { InlineFlash } from "./InlineFlash"
import { TestimonialRow, type TestimonialRowData } from "./TestimonialRow"
import { createTestimonial, type ActionResult } from "@/lib/admin/testimonials"

const initial: ActionResult = { ok: false }

export function TestimonialsEditor({
  testimonials,
}: {
  testimonials: TestimonialRowData[]
}) {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-display !text-text-dark text-xl">
            Reseñas / Testimonios
          </h2>
          <p className="text-xs text-text-mid">
            Reseñas de clientes que se muestran en el home. Puedes copiarlas desde Etsy u otras plataformas.
          </p>
        </div>
      </header>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <TestimonialRow key={t.id} testimonial={t} />
        ))}
      </div>

      <NewTestimonialForm />
    </div>
  )
}

function NewTestimonialForm() {
  const [state, formAction, pending] = useActionState(createTestimonial, initial)
  const errors = state.errors ?? {}

  return (
    <details className="card-maraya gold-border">
      <summary className="px-4 py-3 cursor-pointer flex items-center gap-2 font-semibold text-pink-deep text-sm">
        <Plus className="w-4 h-4" />
        Añadir reseña
      </summary>
      <form
        action={formAction}
        className="p-4 border-t border-pink-light space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_5rem] gap-3">
          <Input label="Autor" name="author" required error={errors.author} />
          <Textarea label="Reseña" name="text" required rows={2} error={errors.text} />
          <Input
            label="Nota"
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={5}
            error={errors.rating}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_5rem] gap-3">
          <Input
            label="Fuente"
            name="source"
            hint="Ej: Etsy, Google"
            error={errors.source}
          />
          <Input
            label="URL fuente"
            name="sourceUrl"
            hint="Enlace a la reseña original"
            error={errors.sourceUrl}
          />
          <Input
            label="Orden"
            name="sortOrder"
            type="number"
            min={0}
            max={99}
            defaultValue={99}
            error={errors.sortOrder}
          />
        </div>
        <div className="flex items-center gap-4">
          <Toggle name="isActive" defaultChecked={true} label="Visible" />
          <div className="flex items-center gap-2 ml-auto">
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
