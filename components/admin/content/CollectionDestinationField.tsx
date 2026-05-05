"use client"

import { useState } from "react"
import { FieldShell } from "@/components/admin/forms/Field"
import { cn } from "@/lib/cn"

const INPUT_BASE =
  "w-full px-4 py-2.5 rounded-xl bg-white border-2 border-pink-light text-sm text-text-dark outline-none transition focus:border-pink-primary placeholder:text-text-mid/50"

export type DestinationCategoryOption = { slug: string; label: string }

const DEFAULT_VALUE = "__default__"
const CUSTOM_VALUE = "__custom__"

const CATEGORY_HREF_RE = /^\/bolsos\?cat=([a-z0-9-]+)$/

function detectInitial(
  href: string | null,
  categories: DestinationCategoryOption[],
): { mode: string; customUrl: string } {
  if (!href) return { mode: DEFAULT_VALUE, customUrl: "" }
  const match = href.match(CATEGORY_HREF_RE)
  if (match && categories.some((c) => c.slug === match[1])) {
    return { mode: href, customUrl: "" }
  }
  return { mode: CUSTOM_VALUE, customUrl: href }
}

/**
 * Selector de destino para una HomeCollection.
 *  - "Por defecto" → guarda null (el público resuelve a /bolsos?cat=<slug-de-la-coleccion>)
 *  - "Categoría: <X>" → guarda /bolsos?cat=<slug-de-categoria>
 *  - "Personalizado" → muestra un input libre (URL o ruta)
 *
 * Emite el valor final por un hidden `name="href"` (vacío si es default).
 */
export function CollectionDestinationField({
  initialHref,
  categories,
  error,
}: {
  initialHref: string | null
  categories: DestinationCategoryOption[]
  error?: string
}) {
  const [{ mode, customUrl }, setState] = useState(() =>
    detectInitial(initialHref, categories),
  )

  const resolvedHref =
    mode === DEFAULT_VALUE
      ? ""
      : mode === CUSTOM_VALUE
        ? customUrl.trim()
        : mode

  const hint =
    mode === DEFAULT_VALUE
      ? "Llevará a /bolsos?cat=<slug de la colección>"
      : mode === CUSTOM_VALUE
        ? "Ruta interna (/algo) o URL completa (https://…)"
        : "Llevará al filtro de catálogo de esta categoría"

  return (
    <div className="sm:col-span-2 space-y-2">
      <FieldShell label="Destino del enlace" hint={hint} error={error}>
        <select
          value={mode}
          onChange={(e) =>
            setState((s) => ({ ...s, mode: e.target.value }))
          }
          className={cn(INPUT_BASE, "bg-white", error && "border-red-300")}
        >
          <option value={DEFAULT_VALUE}>
            — Por defecto (slug de la colección) —
          </option>
          {categories.length > 0 && (
            <optgroup label="Categorías de producto">
              {categories.map((c) => (
                <option key={c.slug} value={`/bolsos?cat=${c.slug}`}>
                  {c.label}
                </option>
              ))}
            </optgroup>
          )}
          <option value={CUSTOM_VALUE}>Personalizado…</option>
        </select>
      </FieldShell>

      {mode === CUSTOM_VALUE && (
        <input
          type="text"
          value={customUrl}
          onChange={(e) =>
            setState((s) => ({ ...s, customUrl: e.target.value }))
          }
          placeholder="/ruta o https://…"
          className={cn(INPUT_BASE)}
        />
      )}

      <input type="hidden" name="href" value={resolvedHref} />
    </div>
  )
}
