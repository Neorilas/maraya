"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Email o contraseña incorrectos.",
  Configuration: "Error de configuración. Avisa al administrador.",
}

export function LoginForm({
  callbackUrl,
  error: initialError,
}: {
  callbackUrl: string
  error?: string
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>(
    initialError ? (ERROR_MESSAGES[initialError] ?? "Error desconocido") : undefined,
  )

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(undefined)
    setSubmitting(true)

    const data = new FormData(e.currentTarget)
    const res = await signIn("credentials", {
      email: String(data.get("email") ?? "").toLowerCase().trim(),
      password: String(data.get("password") ?? ""),
      redirect: false,
    })

    if (res?.error) {
      setError(ERROR_MESSAGES[res.error] ?? "Email o contraseña incorrectos.")
      setSubmitting(false)
      return
    }

    // Éxito: vamos al callback
    window.location.href = callbackUrl
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field
        name="email"
        type="email"
        label="Email"
        placeholder="admin@marayastore.com"
        icon={<Mail className="w-4 h-4" />}
        required
        autoComplete="email"
      />
      <Field
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        icon={<Lock className="w-4 h-4" />}
        required
        autoComplete="current-password"
      />

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-pill btn-pink w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Entrando…
          </>
        ) : (
          "Entrar"
        )}
      </button>
    </form>
  )
}

function Field({
  name,
  label,
  icon,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold tracking-wider uppercase text-text-mid">
        {label}
      </span>
      <div className="mt-1.5 flex items-center gap-2 px-4 py-3 rounded-full bg-white border-2 border-pink-light focus-within:border-pink-primary transition">
        <span className="text-pink-deep">{icon}</span>
        <input
          name={name}
          {...rest}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-mid/60"
        />
      </div>
    </label>
  )
}
