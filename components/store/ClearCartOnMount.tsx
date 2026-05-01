"use client"

import { useEffect } from "react"
import { useCart } from "@/lib/store/cart"

/** Vacía el carrito al montar. Se usa en /pedido-confirmado para asegurar reset. */
export function ClearCartOnMount() {
  const clear = useCart((s) => s.clear)
  useEffect(() => {
    clear()
  }, [clear])
  return null
}
