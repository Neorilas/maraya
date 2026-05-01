"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"

/** Mensaje inline efímero para feedback de save/delete por fila. */
export function InlineFlash({
  ok,
  message,
}: {
  ok: boolean
  message?: string
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!message) return
    setVisible(true)
    if (ok) {
      const t = setTimeout(() => setVisible(false), 2500)
      return () => clearTimeout(t)
    }
  }, [ok, message])

  if (!visible || !message) return null
  const Icon = ok ? CheckCircle2 : AlertCircle
  const tone = ok
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : "text-red-700 bg-red-50 border-red-200"
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${tone}`}>
      <Icon className="w-3 h-3" />
      {message}
    </span>
  )
}
