"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { UploadCloud, X, Loader2, AlertCircle, Plus, ImagePlus } from "lucide-react"
import { FieldShell } from "@/components/admin/forms/Field"
import { getProductImageUploadUrl } from "@/lib/admin/uploads"

type ItemStatus = "ready" | "uploading" | "error"
type Item = {
  url: string
  alt: string
  status: ItemStatus
  error?: string
}

/**
 * Editor de imágenes del producto. Soporta:
 *  - Drop / click para subir archivos a Hetzner S3 (vía presigned URL)
 *  - Pegar URL externa manualmente (fallback si S3 no está configurado o quieres reusar)
 *  - Alt-text por imagen (SEO + accesibilidad). Vacío usa el nombre del producto.
 *
 * El form serializa dos hidden inputs paralelos por índice:
 *  - `images`     → URLs separadas por \n
 *  - `imagesAlt`  → alts separados por \n (línea vacía = sin alt)
 */
export function ProductImagesField({
  initial,
  initialAlts,
  error,
}: {
  initial: string[]
  initialAlts?: string[]
  error?: string
}) {
  const [items, setItems] = useState<Item[]>(
    initial.length
      ? initial.map((u, i) => ({
          url: u,
          alt: initialAlts?.[i] ?? "",
          status: "ready",
        }))
      : [],
  )
  const [pasteUrl, setPasteUrl] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const liveItems = items.filter((i) => i.status === "ready")
  const liveUrls = liveItems.map((i) => i.url)
  const liveAlts = liveItems.map((i) => i.alt)

  function remove(idx: number) {
    setItems((xs) => xs.filter((_, i) => i !== idx))
  }

  function setAlt(idx: number, alt: string) {
    setItems((xs) => xs.map((it, i) => (i === idx ? { ...it, alt } : it)))
  }

  function addUrl(url: string) {
    const u = url.trim()
    if (!u) return
    if (!u.startsWith("http")) {
      alert("La URL debe empezar por http:// o https://")
      return
    }
    setItems((xs) => [...xs, { url: u, alt: "", status: "ready" }])
    setPasteUrl("")
  }

  async function uploadFile(file: File) {
    // Item temporal mientras subimos
    const tempUrl = URL.createObjectURL(file)
    let tempIdx = -1
    setItems((xs) => {
      tempIdx = xs.length
      return [...xs, { url: tempUrl, alt: "", status: "uploading" }]
    })

    try {
      const presign = await getProductImageUploadUrl({
        filename: file.name,
        contentType: file.type,
        size: file.size,
      })
      if (!presign.ok) throw new Error(presign.error)

      const put = await fetch(presign.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type, "x-amz-acl": "public-read" },
      })
      if (!put.ok) throw new Error(`Subida fallida (${put.status})`)

      setItems((xs) =>
        xs.map((it, i) =>
          i === tempIdx
            ? { ...it, url: presign.publicUrl, status: "ready" }
            : it,
        ),
      )
    } catch (err) {
      setItems((xs) =>
        xs.map((it, i) =>
          i === tempIdx
            ? {
                ...it,
                status: "error",
                error: err instanceof Error ? err.message : "Error",
              }
            : it,
        ),
      )
    } finally {
      URL.revokeObjectURL(tempUrl)
    }
  }

  function onPick(files: FileList | null) {
    if (!files) return
    for (const f of Array.from(files)) uploadFile(f)
    if (fileInput.current) fileInput.current.value = ""
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    onPick(e.dataTransfer.files)
  }

  return (
    <FieldShell
      label="Imágenes del producto"
      hint="Arrastra archivos o pega URLs. La primera es la principal. Añade un texto alternativo por imagen para SEO y accesibilidad."
      error={error}
    >
      <input type="hidden" name="images" value={liveUrls.join("\n")} />
      <input type="hidden" name="imagesAlt" value={liveAlts.join("\n")} />

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center gap-2 px-6 py-8 rounded-2xl border-2 border-dashed transition cursor-pointer ${
          dragOver
            ? "border-pink-primary bg-pink-light/60"
            : "border-pink-light bg-cream/50 hover:border-pink-primary"
        }`}
      >
        <UploadCloud className="w-8 h-8 text-pink-deep" />
        <p className="font-semibold text-text-dark text-sm">
          Suelta tus fotos aquí o haz click para elegir
        </p>
        <p className="text-xs text-text-mid">
          JPG/PNG/WEBP/AVIF/GIF · máx 8 MB cada una
        </p>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          onChange={(e) => onPick(e.target.files)}
        />
      </div>

      {items.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((it, i) => (
            <ItemCard
              key={i}
              item={it}
              index={i}
              onRemove={() => remove(i)}
              onAltChange={(alt) => setAlt(i, alt)}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <input
          type="url"
          value={pasteUrl}
          onChange={(e) => setPasteUrl(e.target.value)}
          placeholder="O pega una URL externa…"
          className="flex-1 px-4 py-2.5 rounded-full bg-white border-2 border-pink-light text-sm outline-none focus:border-pink-primary placeholder:text-text-mid/50"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addUrl(pasteUrl)
            }
          }}
        />
        <button
          type="button"
          onClick={() => addUrl(pasteUrl)}
          className="btn-pill btn-teal !px-4 !py-2 text-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Añadir URL
        </button>
      </div>
    </FieldShell>
  )
}

function ItemCard({
  item,
  index,
  onRemove,
  onAltChange,
}: {
  item: Item
  index: number
  onRemove: () => void
  onAltChange: (alt: string) => void
}) {
  const isReady = item.status === "ready"
  return (
    <div className="card-maraya gold-border p-2 flex flex-col gap-2">
      <div className="relative aspect-square rounded-xl overflow-hidden group">
        {item.status === "uploading" ? (
          <>
            <Image
              src={item.url}
              alt=""
              fill
              sizes="200px"
              className="object-cover opacity-50"
              unoptimized
            />
            <div className="absolute inset-0 flex items-center justify-center bg-pink-light/40">
              <Loader2 className="w-6 h-6 text-pink-deep animate-spin" />
            </div>
          </>
        ) : item.status === "error" ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-red-50 text-red-700 p-3 text-center">
            <AlertCircle className="w-6 h-6" />
            <span className="text-[10px] leading-tight">
              {item.error ?? "Error"}
            </span>
          </div>
        ) : item.url.startsWith("http") ? (
          <Image
            src={item.url}
            alt={item.alt || `imagen ${index + 1}`}
            fill
            sizes="200px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-pink-light text-pink-deep">
            <ImagePlus className="w-6 h-6" />
          </div>
        )}

        {index === 0 && isReady && (
          <span className="absolute top-1.5 left-1.5 bg-gold text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            Principal
          </span>
        )}

        {item.status !== "uploading" && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Quitar"
            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isReady && (
        <input
          type="text"
          value={item.alt}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Texto alternativo (alt)…"
          maxLength={200}
          className="w-full px-3 py-1.5 rounded-lg bg-white border border-pink-light text-xs text-text-dark outline-none focus:border-pink-primary placeholder:text-text-mid/60"
        />
      )}
    </div>
  )
}
