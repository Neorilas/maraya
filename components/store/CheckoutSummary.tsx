"use client"

import Image from "next/image"
import { Loader2, Tag, AlertCircle } from "lucide-react"
import type { CartItem } from "@/lib/store/cart"

const FORMAT_EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})

export type ShippingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; cost: number; isFree: boolean; zoneName: string; estimatedDays: string; freeFrom: number | null }
  | { status: "error"; message: string }

export function CheckoutSummary({
  items,
  subtotal,
  shipping,
}: {
  items: CartItem[]
  subtotal: number
  shipping: ShippingState
}) {
  const shippingCost = shipping.status === "ok" ? shipping.cost : 0
  const total = subtotal + shippingCost

  return (
    <aside className="card-maraya gold-border p-4 sm:p-5 h-fit lg:sticky lg:top-20 space-y-3 sm:space-y-4">
      <h2 className="font-display !text-text-dark text-base sm:text-lg">Tu pedido</h2>

      <ul className="space-y-2 sm:space-y-3 max-h-56 sm:max-h-72 overflow-y-auto pr-1">
        {items.map((it) => (
          <li key={it.productId} className="flex gap-3 items-center">
            <div className="relative w-12 h-12 rounded-lg bg-pink-light overflow-hidden gold-border shrink-0">
              {it.image ? (
                <Image src={it.image} alt={it.name} fill sizes="48px" className="object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-pink-deep">
                  <Tag className="w-4 h-4" />
                </span>
              )}
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center">
                {it.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-text-dark truncate">{it.name}</div>
              <div className="text-xs text-text-mid">
                {FORMAT_EUR.format(it.unitPrice)} c/u
              </div>
            </div>
            <div className="text-sm font-bold text-text-dark">
              {FORMAT_EUR.format(it.unitPrice * it.quantity)}
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-1.5 text-sm pt-3 border-t border-pink-light">
        <Row label="Subtotal" value={FORMAT_EUR.format(subtotal)} />
        <ShippingRow shipping={shipping} />
      </div>

      {shipping.status === "ok" && shipping.freeFrom && !shipping.isFree && (
        <div className="text-xs text-pink-deep bg-pink-light/60 rounded-lg p-2">
          Te faltan {FORMAT_EUR.format(shipping.freeFrom - subtotal)} para envío gratis 💛
        </div>
      )}

      <div className="pt-3 border-t border-pink-light flex items-baseline justify-between">
        <span className="font-bold text-text-dark">Total</span>
        <span className="font-display italic text-pink-deep text-2xl">
          {FORMAT_EUR.format(total)}
        </span>
      </div>
    </aside>
  )
}

function ShippingRow({ shipping }: { shipping: ShippingState }) {
  if (shipping.status === "idle") {
    return <Row label="Envío" value="Selecciona país" muted />
  }
  if (shipping.status === "loading") {
    return (
      <div className="flex items-center justify-between">
        <span className="text-text-dark">Envío</span>
        <Loader2 className="w-3.5 h-3.5 text-pink-deep animate-spin" />
      </div>
    )
  }
  if (shipping.status === "error") {
    return (
      <div className="flex items-start gap-2 text-xs text-red-700">
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>{shipping.message}</span>
      </div>
    )
  }
  // ok
  return (
    <>
      <Row
        label={`Envío · ${shipping.zoneName}`}
        value={shipping.isFree ? "GRATIS" : FORMAT_EUR.format(shipping.cost)}
      />
      <div className="text-xs text-text-mid italic">
        Estimado: {shipping.estimatedDays}
      </div>
    </>
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
