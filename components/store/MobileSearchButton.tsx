"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"

/**
 * Botón lupa para móvil que despliega un buscador inline encima del nav.
 * En desktop está oculto (el form está embebido en el header en md+).
 */
export function MobileSearchButton() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Cerrar buscador" : "Buscar"}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-pink-light hover:bg-pink-primary hover:text-white text-pink-deep transition"
      >
        {open ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
      </button>

      {open && (
        <form
          action="/bolsos"
          onSubmit={() => setOpen(false)}
          className="md:hidden absolute left-3 right-3 top-full mt-1 z-30 flex items-center gap-2 bg-white border-2 border-pink-primary rounded-full px-4 py-2 shadow-[0_8px_24px_rgba(244,114,182,0.25)]"
        >
          <Search className="w-4 h-4 text-pink-deep shrink-0" />
          <input
            ref={inputRef}
            type="search"
            name="q"
            placeholder="Buscar bolsos…"
            className="flex-1 bg-transparent text-sm placeholder:text-text-mid outline-none min-w-0"
          />
        </form>
      )}
    </>
  )
}
