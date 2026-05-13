"use client"

import { useActionState, useState } from "react"
import { Loader2, Save, Trash2, KeyRound } from "lucide-react"
import { Input } from "@/components/admin/forms/Field"
import { InlineFlash } from "@/components/admin/content/InlineFlash"
import {
  updateAdminAction,
  deleteAdminAction,
  requestPasswordChangeAction,
  type ActionResult,
} from "@/lib/admin/admins"

const initial: ActionResult = { ok: false }

export type AdminRowData = {
  id: string
  email: string
  name: string
  createdAt: Date
}

export function AdminRow({
  admin,
  isSelf,
}: {
  admin: AdminRowData
  isSelf: boolean
}) {
  const [editState, editAction, editPending] = useActionState(updateAdminAction, initial)
  const [delState, delAction, delPending] = useActionState(deleteAdminAction, initial)
  const [pwState, pwAction, pwPending] = useActionState(requestPasswordChangeAction, initial)
  const [showPwForm, setShowPwForm] = useState(false)

  const editErrors = editState.errors ?? {}

  return (
    <div className="card-maraya p-4 space-y-3">
      <form action={editAction} className="space-y-3">
        <input type="hidden" name="id" value={admin.id} />
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <Input
            label="Nombre"
            name="name"
            defaultValue={admin.name}
            required
            error={editErrors.name}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            defaultValue={admin.email}
            required
            error={editErrors.email}
          />
          <div className="flex items-center gap-2 pb-0.5">
            <button
              type="submit"
              disabled={editPending}
              className="btn-pill btn-pink !px-4 !py-2 text-xs disabled:opacity-60"
            >
              {editPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setShowPwForm(!showPwForm)}
              className="p-2 rounded-full text-amber-600 hover:bg-amber-50 transition"
              aria-label="Cambiar contraseña"
              title="Cambiar contraseña"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            {!isSelf && (
              <form action={delAction}>
                <input type="hidden" name="id" value={admin.id} />
                <button
                  type="submit"
                  disabled={delPending}
                  onClick={(e) => {
                    if (!confirm(`¿Eliminar al admin "${admin.name}"?`)) {
                      e.preventDefault()
                    }
                  }}
                  className="p-2 rounded-full text-red-600 hover:bg-red-50 transition"
                  aria-label="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <InlineFlash ok={editState.ok} message={editState.message} />
          {delState.message && (
            <InlineFlash ok={delState.ok} message={delState.message} />
          )}
        </div>
      </form>

      {showPwForm && (
        <form action={pwAction} className="border-t border-pink-light pt-3 space-y-3">
          <input type="hidden" name="adminId" value={admin.id} />
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
            <Input
              label="Nueva contraseña"
              name="newPassword"
              type="password"
              required
              minLength={6}
              error={pwState.errors?.newPassword}
            />
            <button
              type="submit"
              disabled={pwPending}
              className="btn-pill btn-pink !px-4 !py-2 text-xs disabled:opacity-60"
            >
              {pwPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <KeyRound className="w-3.5 h-3.5" />
              )}
              Enviar confirmación
            </button>
          </div>
          <p className="text-xs text-text-mid italic">
            Se enviará un email de confirmación. La contraseña no se cambiará hasta que se confirme.
          </p>
          <InlineFlash ok={pwState.ok} message={pwState.message} />
        </form>
      )}

      <p className="text-xs text-text-mid">
        Creado: {admin.createdAt.toLocaleDateString("es-ES")}
        {isSelf && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold uppercase">
            Tu cuenta
          </span>
        )}
      </p>
    </div>
  )
}
