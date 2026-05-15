"use client"

import { useState } from "react"
import { X, Construction } from "lucide-react"

export function DevDisclaimer() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-amber-50 border-t-2 border-amber-400 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <Construction className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800 flex-1">
          <strong>Sitio en construcción.</strong>{" "}
          Esta web es una demo en desarrollo. Los pagos no son reales y no se realizará ningún cobro.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-600 hover:text-amber-800 p-1 shrink-0"
          aria-label="Cerrar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
