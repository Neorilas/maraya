"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react"
import type { SettingsFormState } from "@/lib/admin/settings"

/** Barra inferior fija con submit + feedback de estado. Compartida entre forms. */
export function SettingsStickyBar({
  state,
  pending,
}: {
  state: SettingsFormState
  pending: boolean
}) {
  return (
    <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-cream/95 backdrop-blur border-t border-pink-light flex items-center justify-end gap-3 z-20">
      <FlashMessage state={state} pending={pending} />
      <button
        type="submit"
        disabled={pending}
        className="btn-pill btn-pink disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Guardando…
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Guardar cambios
          </>
        )}
      </button>
    </div>
  )
}

function FlashMessage({
  state,
  pending,
}: {
  state: SettingsFormState
  pending: boolean
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (pending || !state.message) return
    setVisible(true)
    if (state.ok) {
      const t = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(t)
    }
  }, [state, pending])

  if (!visible || !state.message) return null
  const tone = state.ok
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : "text-red-700 bg-red-50 border-red-200"
  const Icon = state.ok ? CheckCircle2 : AlertCircle
  return (
    <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border ${tone}`}>
      <Icon className="w-4 h-4" />
      {state.message}
    </div>
  )
}
