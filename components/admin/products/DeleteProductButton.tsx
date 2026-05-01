"use client"

import { useTransition, useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { deleteProductAction } from "@/lib/admin/products"

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)

  function onClick() {
    if (!confirm(`¿Eliminar el producto "${name}"?\n\nSi está en pedidos, se desactivará en lugar de borrar.`)) return
    start(async () => {
      const res = await deleteProductAction(id)
      setFeedback(res.message)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition disabled:opacity-60"
        aria-label="Eliminar"
        title={feedback ?? "Eliminar"}
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </>
  )
}
