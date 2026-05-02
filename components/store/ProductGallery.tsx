"use client"

import { useState } from "react"
import Image from "next/image"
import { Tag } from "lucide-react"
import { cn } from "@/lib/cn"

/**
 * Galería con imagen principal grande y miniaturas seleccionables.
 *
 * Móvil: imagen grande arriba, thumbs en fila debajo (scroll horizontal).
 * Desktop (sm+): thumbs en columna a la izquierda, imagen grande a la derecha.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const [active, setActive] = useState(0)
  const visible = images.length > 0 ? images : []

  if (visible.length === 0) {
    return (
      <div className="aspect-square rounded-2xl gold-border bg-pink-light flex items-center justify-center text-pink-deep">
        <Tag className="w-12 h-12" />
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse sm:grid sm:grid-cols-[6rem_1fr] gap-3">
      {/* Thumbs: row en móvil, column en sm+ */}
      <div className="flex sm:flex-col gap-2 sm:max-h-[28rem] overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {visible.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Imagen ${i + 1}`}
            className={cn(
              "relative w-16 h-16 sm:w-auto sm:h-auto sm:aspect-square rounded-xl overflow-hidden border-2 shrink-0 transition",
              active === i
                ? "border-pink-primary ring-2 ring-pink-primary/30"
                : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative aspect-square rounded-2xl gold-border overflow-hidden bg-cream">
        <Image
          src={visible[active]}
          alt={alt}
          fill
          sizes="(min-width:1024px) 40vw, 90vw"
          priority
          className="object-cover"
        />
      </div>
    </div>
  )
}
