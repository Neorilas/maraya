"use client"

import { useState } from "react"
import Image from "next/image"
import { Tag } from "lucide-react"
import { cn } from "@/lib/cn"

/** Galería con imagen principal grande y miniaturas seleccionables. */
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
    <div className="grid grid-cols-[5rem_1fr] sm:grid-cols-[6rem_1fr] gap-3">
      <div className="flex flex-col gap-2 max-h-[28rem] overflow-y-auto">
        {visible.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Imagen ${i + 1}`}
            className={cn(
              "relative aspect-square rounded-xl overflow-hidden border-2 shrink-0 transition",
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
