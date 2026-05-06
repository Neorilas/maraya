"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { deleteProductAction } from "@/lib/admin/products"

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition()
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null)
  const router = useRouter()

  function onClick() {
    if (!confirm(`¿Eliminar el producto "${name}"?\n\nSi está en pedidos, se desactivará en lugar de borrar.`)) return
    start(async () => {
      try {
        const res = await deleteProductAction(id)
        setFeedback(res)
        if (res.ok) router.refresh()
      } catch {
        setFeedback({ ok: false, message: "Error de conexión. Recarga e inténtalo de nuevo." })
      }
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={
        "p-2 rounded-full transition disabled:opacity-60 " +
        (feedback && !feedback.ok
          ? "text-red-600 bg-red-50"
          : "text-red-600 hover:bg-red-50")
      }
      aria-label="Eliminar"
      title={feedback?.message ?? "Eliminar"}
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  )
}
