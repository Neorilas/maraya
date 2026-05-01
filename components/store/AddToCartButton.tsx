"use client"

import { useState } from "react"
import { ShoppingBag, Check, Minus, Plus } from "lucide-react"
import { useCart, type CartItem } from "@/lib/store/cart"

/**
 * Botón añadir al carrito con selector de cantidad.
 * Acepta un `item` ya construido (sin quantity) — se la inyectamos al store.
 */
export function AddToCartButton({
  item,
  disabled,
  full,
}: {
  item: Omit<CartItem, "quantity">
  disabled?: boolean
  /** Si true ocupa el ancho completo (móvil). */
  full?: boolean
}) {
  const addItem = useCart((s) => s.addItem)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const max = item.stockAtAdd || 999

  function add() {
    addItem(item, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className={full ? "flex flex-col gap-3" : "flex items-center gap-3"}>
      <div className="inline-flex items-center bg-white border-2 border-pink-light rounded-full overflow-hidden">
        <QtyButton onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
          <Minus className="w-3.5 h-3.5" />
        </QtyButton>
        <span className="w-8 text-center font-bold text-text-dark">{qty}</span>
        <QtyButton onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max}>
          <Plus className="w-3.5 h-3.5" />
        </QtyButton>
      </div>

      <button
        type="button"
        onClick={add}
        disabled={disabled || added}
        className={`btn-pill btn-pink ${full ? "w-full justify-center" : ""} disabled:opacity-60`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" /> Añadido
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" /> Añadir al carrito
          </>
        )}
      </button>
    </div>
  )
}

function QtyButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="w-8 h-9 flex items-center justify-center text-pink-deep hover:bg-pink-light disabled:opacity-40 transition"
    >
      {children}
    </button>
  )
}
