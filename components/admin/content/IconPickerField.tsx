"use client"

import { useState } from "react"
import { getStoreIcon, STORE_ICON_OPTIONS } from "@/lib/store/icons"
import { FieldShell } from "@/components/admin/forms/Field"

/** Select de icono con preview en vivo. Submit form value es el `name` del icono. */
export function IconPickerField({
  name,
  defaultValue,
  label = "Icono",
  error,
}: {
  name: string
  defaultValue: string
  label?: string
  error?: string
}) {
  const [val, setVal] = useState(defaultValue)
  const Icon = getStoreIcon(val)
  return (
    <FieldShell label={label} error={error}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-pink-light flex items-center justify-center text-pink-deep border-2 border-gold/40 shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <select
          name={name}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white border-2 border-pink-light text-sm outline-none focus:border-pink-primary"
        >
          {STORE_ICON_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </FieldShell>
  )
}
