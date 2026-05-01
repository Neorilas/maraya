const FORMAT_EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})

export type OrderItemRow = {
  id: string
  productName: string
  price: number
  quantity: number
}

export function OrderItemsTable({ items }: { items: OrderItemRow[] }) {
  return (
    <div className="card-maraya overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-text-mid bg-cream/50">
            <th className="text-left px-4 py-2.5 font-bold">Producto</th>
            <th className="text-right px-4 py-2.5 font-bold">Precio</th>
            <th className="text-right px-4 py-2.5 font-bold">Cantidad</th>
            <th className="text-right px-4 py-2.5 font-bold">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-t border-pink-light/60">
              <td className="px-4 py-3 text-text-dark">{it.productName}</td>
              <td className="px-4 py-3 text-right text-text-dark">
                {FORMAT_EUR.format(it.price)}
              </td>
              <td className="px-4 py-3 text-right text-text-dark">{it.quantity}</td>
              <td className="px-4 py-3 text-right font-bold text-text-dark">
                {FORMAT_EUR.format(it.price * it.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
