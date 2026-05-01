import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Star, Pencil, Tag } from "lucide-react"
import { cn } from "@/lib/cn"
import { DeleteProductButton } from "./DeleteProductButton"

export type ProductTableRow = {
  id: string
  sku: string
  slug: string
  name: string
  price: number
  salePrice: number | null
  stock: number
  isActive: boolean
  isFeatured: boolean
  category: string | null
  primaryImage: string | null
}

const FORMAT_EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})

export function ProductsTable({ rows }: { rows: ProductTableRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="card-maraya p-10 text-center">
        <p className="font-display !text-text-dark text-lg">
          Aún no hay productos
        </p>
        <p className="text-sm text-text-mid mt-1">
          Empieza creando tu primer bolso.
        </p>
        <Link href="/admin/productos/nuevo" className="btn-pill btn-pink mt-5 inline-flex">
          Crear producto
        </Link>
      </div>
    )
  }

  return (
    <div className="card-maraya overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-text-mid bg-cream/50">
              <th className="text-left px-4 py-2.5 font-bold">Producto</th>
              <th className="text-left px-4 py-2.5 font-bold">SKU</th>
              <th className="text-right px-4 py-2.5 font-bold">Precio</th>
              <th className="text-right px-4 py-2.5 font-bold">Stock</th>
              <th className="text-center px-4 py-2.5 font-bold">Estado</th>
              <th className="text-right px-4 py-2.5 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <Row key={p.id} p={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Row({ p }: { p: ProductTableRow }) {
  return (
    <tr className="border-t border-pink-light/60 hover:bg-pink-light/30 transition">
      <td className="px-4 py-3">
        <Link href={`/admin/productos/${p.id}`} className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-lg bg-pink-light overflow-hidden shrink-0 relative gold-border">
            {p.primaryImage ? (
              <Image
                src={p.primaryImage}
                alt={p.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-pink-deep">
                <Tag className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-text-dark group-hover:text-pink-deep transition truncate max-w-xs">
              {p.name}
            </div>
            {p.category && (
              <div className="text-xs text-text-mid">{p.category}</div>
            )}
          </div>
        </Link>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-text-mid">{p.sku}</td>
      <td className="px-4 py-3 text-right">
        {p.salePrice ? (
          <>
            <div className="font-bold text-pink-deep">
              {FORMAT_EUR.format(p.salePrice)}
            </div>
            <div className="text-xs text-text-mid line-through">
              {FORMAT_EUR.format(p.price)}
            </div>
          </>
        ) : (
          <div className="font-bold text-text-dark">
            {FORMAT_EUR.format(p.price)}
          </div>
        )}
      </td>
      <td
        className={cn(
          "px-4 py-3 text-right font-bold",
          p.stock === 0 && "text-red-600",
          p.stock > 0 && p.stock < 3 && "text-orange-600",
          p.stock >= 3 && "text-text-dark",
        )}
      >
        {p.stock}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="inline-flex items-center gap-1.5">
          <span
            title={p.isActive ? "Visible" : "Oculto"}
            className={cn(
              "p-1 rounded-full",
              p.isActive ? "text-emerald-600 bg-emerald-50" : "text-gray-400 bg-gray-100",
            )}
          >
            {p.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </span>
          {p.isFeatured && (
            <span title="Destacado" className="p-1 rounded-full text-gold bg-gold-light">
              <Star className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/productos/${p.id}`}
            className="p-2 rounded-full text-pink-deep hover:bg-pink-light transition"
            aria-label="Editar"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <DeleteProductButton id={p.id} name={p.name} />
        </div>
      </td>
    </tr>
  )
}
