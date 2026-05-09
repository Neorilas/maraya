"use client"

import { useEffect, useState, useCallback } from "react"
import { CheckCircle2, AlertCircle, AlertTriangle, X } from "lucide-react"

export type ToastType = "success" | "error" | "warning"

export type ToastData = {
  message: string
  type: ToastType
}

const STYLES: Record<ToastType, string> = {
  success: "bg-emerald-500 text-white shadow-emerald-200",
  error: "bg-red-500 text-white shadow-red-200",
  warning: "bg-amber-500 text-white shadow-amber-200",
}

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
}

export function Toast({
  toast,
  onDismiss,
  duration = 4000,
}: {
  toast: ToastData | null
  onDismiss: () => void
  duration?: number
}) {
  const [visible, setVisible] = useState(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }, [onDismiss])

  useEffect(() => {
    if (!toast) {
      setVisible(false)
      return
    }
    const raf = requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(dismiss, duration)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [toast, duration, dismiss])

  if (!toast) return null

  const Icon = ICONS[toast.type]

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      }`}
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-lg text-sm font-semibold ${STYLES[toast.type]}`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span>{toast.message}</span>
        <button onClick={dismiss} className="ml-1 p-0.5 rounded hover:bg-white/20 transition">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
