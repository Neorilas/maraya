"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/store/cart"

/** Botón del carrito en el header, con contador en vivo desde el store. */
export function CartIconButton() {
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0))
  // Evitar mismatch SSR (el store está en localStorage del cliente)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const showCount = mounted && count > 0

  return (
    <Link
      href="/carrito"
      aria-label={`Carrito (${count} unidades)`}
      className="relative flex items-center justify-center w-11 h-11 rounded-full bg-pink-light hover:bg-pink-primary hover:text-white text-pink-deep transition"
    >
      <ShoppingBag className="w-5 h-5" />
      {showCount && (
        <span className="absolute -top-1 -right-1 min-w-[1.2rem] h-5 px-1 rounded-full bg-gold text-white text-[11px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  )
}
