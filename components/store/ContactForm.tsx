"use client"

import { useActionState } from "react"
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { sendContactAction, type ContactFormState } from "@/lib/contact"

const initialState: ContactFormState = { ok: false }

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactAction,
    initialState,
  )

  if (state.ok && state.message) {
    return (
      <div className="card-maraya p-6 sm:p-8 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
        <p className="font-display text-lg text-text-dark">{state.message}</p>
      </div>
    )
  }

  const errors = state.errors ?? {}

  return (
    <form action={formAction} className="card-maraya p-5 sm:p-8 space-y-5">
      <h2 className="font-display italic text-xl text-text-dark">
        Envíanos un mensaje
      </h2>

      {state.message && !state.ok && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.message}
        </div>
      )}

      {/* Honeypot anti-spam */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-text-mid mb-1.5 block">
            Nombre <span className="text-pink-deep">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-pink-light text-sm text-text-dark outline-none transition focus:border-pink-primary"
          />
          {errors.name && (
            <span className="text-xs text-red-600 mt-1 block">{errors.name}</span>
          )}
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-text-mid mb-1.5 block">
            Email <span className="text-pink-deep">*</span>
          </span>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-pink-light text-sm text-text-dark outline-none transition focus:border-pink-primary"
          />
          {errors.email && (
            <span className="text-xs text-red-600 mt-1 block">{errors.email}</span>
          )}
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-text-mid mb-1.5 block">
          Mensaje <span className="text-pink-deep">*</span>
        </span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-pink-light text-sm text-text-dark outline-none transition focus:border-pink-primary resize-y"
        />
        {errors.message && (
          <span className="text-xs text-red-600 mt-1 block">{errors.message}</span>
        )}
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="btn-pill btn-pink disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Enviar mensaje
          </>
        )}
      </button>
    </form>
  )
}
