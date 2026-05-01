"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from "lucide-react"
import { useCart } from "@/lib/store/cart"

const FORMAT_EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})

export function CartView() {
  const items = useCart((s) => s.items)
  const setQuantity = useCart((s) => s.setQuantity)
  const removeItem = useCart((s) => s.removeItem)
  const subtotal = useCart((s) => s.subtotal)

  // Evitar mismatch SSR (estado en localStorage)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="text-center text-text-mid py-12">Cargando carrito…</div>
  }

  if (items.length === 0) return <EmptyCart />

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-8">
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.productId} className="card-maraya p-4 flex gap-4 items-center">
            <Link
              href={`/bolsos/${it.slug}`}
              className="relative w-20 h-20 rounded-xl overflow-hidden bg-pink-light shrink-0 gold-border"
            >
              {it.image ? (
                <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-pink-deep">
                  <Tag className="w-5 h-5" />
                </span>
              )}
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                href={`/bolsos/${it.slug}`}
                className="font-display !text-text-dark text-base hover:text-pink-deep transition line-clamp-1 block"
              >
                {it.name}
              </Link>
              <div className="text-sm text-text-mid mt-0.5">
                {FORMAT_EUR.format(it.unitPrice)} c/u
              </div>

              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center bg-white border-2 border-pink-light rounded-full overflow-hidden">
                  <QtyBtn onClick={() => setQuantity(it.productId, it.quantity - 1)}>
                    <Minus className="w-3.5 h-3.5" />
                  </QtyBtn>
                  <span className="w-8 text-center font-bold text-text-dark text-sm">
                    {it.quantity}
                  </span>
                  <QtyBtn
                    onClick={() => setQuantity(it.productId, it.quantity + 1)}
                    disabled={it.quantity >= it.stockAtAdd}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </QtyBtn>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(it.productId)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Quitar
                </button>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-bold text-text-dark">
                {FORMAT_EUR.format(it.unitPrice * it.quantity)}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Summary subtotal={subtotal()} />
    </div>
  )
}

function Summary({ subtotal }: { subtotal: number }) {
  return (
    <aside className="card-maraya gold-border p-5 h-fit lg:sticky lg:top-20 space-y-4">
      <h2 className="font-display !text-text-dark text-lg">Resumen</h2>

      <div className="space-y-1.5 text-sm">
        <Row label="Subtotal" value={FORMAT_EUR.format(subtotal)} />
        <Row
          label="Gastos de envío"
          value="Se calculan en checkout"
          muted
        />
      </div>

      <div className="pt-3 border-t border-pink-light flex items-baseline justify-between">
        <span className="font-bold text-text-dark">Total estimado</span>
        <span className="font-display italic text-pink-deep text-2xl">
          {FORMAT_EUR.format(subtotal)}
        </span>
      </div>

      <Link href="/checkout" className="btn-pill btn-pink w-full justify-center">
        Tramitar pedido
        <ArrowRight className="w-4 h-4" />
      </Link>

      <Link
        href="/bolsos"
        className="block text-center text-xs font-semibold text-text-mid hover:text-pink-deep transition"
      >
        ← Seguir comprando
      </Link>
    </aside>
  )
}

function Row({
  label,
  value,
  muted,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex justify-between">
      <span className={muted ? "text-text-mid" : "text-text-dark"}>{label}</span>
      <span className={muted ? "text-text-mid italic text-xs" : "font-semibold text-text-dark"}>
        {value}
      </span>
    </div>
  )
}

function QtyBtn({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="w-8 h-8 flex items-center justify-center text-pink-deep hover:bg-pink-light disabled:opacity-40 transition"
    >
      {children}
    </button>
  )
}

function EmptyCart() {
  return (
    <div className="card-maraya p-12 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 mx-auto rounded-full bg-pink-light flex items-center justify-center text-pink-deep mb-4">
        <ShoppingBag className="w-7 h-7" />
      </div>
      <h2 className="font-display !text-text-dark text-2xl">
        Tu carrito está vacío
      </h2>
      <p className="text-sm text-text-mid mt-2">
        Echa un vistazo al catálogo, hay bolsos esperándote.
      </p>
      <Link href="/bolsos" className="btn-pill btn-pink mt-6 inline-flex">
        Ver bolsos
      </Link>
    </div>
  )
}
