"use client"

import { useActionState } from "react"
import { Loader2, UserPlus } from "lucide-react"
import { Input } from "@/components/admin/forms/Field"
import { InlineFlash } from "@/components/admin/content/InlineFlash"
import { createAdminAction, type ActionResult } from "@/lib/admin/admins"

const initial: ActionResult = { ok: false }

export function CreateAdminForm() {
  const [state, formAction, pending] = useActionState(createAdminAction, initial)
  const errors = state.errors ?? {}

  return (
    <details className="card-maraya">
      <summary className="px-4 py-3 cursor-pointer select-none font-bold text-sm text-text-dark hover:text-pink-primary transition flex items-center gap-2">
        <UserPlus className="w-4 h-4" />
        Crear nuevo administrador
      </summary>
      <form action={formAction} className="p-4 pt-0 space-y-3 border-t border-pink-light">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Nombre"
            name="name"
            required
            error={errors.name}
            placeholder="Ej: Ana García"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            required
            error={errors.email}
            placeholder="ana@marayastore.com"
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            required
            minLength={6}
            error={errors.password}
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="btn-pill btn-pink !px-5 !py-2 text-xs disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" />
            )}
            Crear admin
          </button>
          <InlineFlash ok={state.ok} message={state.message} />
        </div>
      </form>
    </details>
  )
}
