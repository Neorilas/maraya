"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Check, Minus, Plus, Zap } from "lucide-react"
import { useCart, type CartItem } from "@/lib/store/cart"

export function AddToCartButton({
  item,
  disabled,
  full,
  showBuyNow,
}: {
  item: Omit<CartItem, "quantity">
  disabled?: boolean
  full?: boolean
  showBuyNow?: boolean
}) {
  const addItem = useCart((s) => s.addItem)
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const max = item.stockAtAdd || 999

  function add() {
    addItem(item, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function buyNow() {
    addItem(item, qty)
    router.push("/checkout")
  }

  return (
    <div className={full ? "flex flex-col gap-3" : "flex items-center gap-3"}>
      <div className="inline-flex items-center bg-white border-2 border-pink-light rounded-full overflow-hidden">
        <QtyButton onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Reducir cantidad">
          <Minus className="w-3.5 h-3.5" />
        </QtyButton>
        <span className="w-8 text-center font-bold text-text-dark">{qty}</span>
        <QtyButton onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label="Aumentar cantidad">
          <Plus className="w-3.5 h-3.5" />
        </QtyButton>
      </div>

      <button
        type="button"
        onClick={add}
        disabled={disabled || added}
        aria-label={`Añadir ${item.name} al carrito`}
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

      {showBuyNow && (
        <button
          type="button"
          onClick={buyNow}
          disabled={disabled}
          className={`btn-pill btn-gold ${full ? "w-full justify-center" : ""} disabled:opacity-60`}
        >
          <Zap className="w-4 h-4" /> Comprar ahora
        </button>
      )}
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
