"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { UploadCloud, X, Loader2, AlertCircle, Plus } from "lucide-react"
import { FieldShell } from "@/components/admin/forms/Field"
import { getProductImageUploadUrl } from "@/lib/admin/uploads"

type Status = "empty" | "ready" | "uploading" | "error"

export function CollectionImageField({
  initialUrl,
  initialAlt,
  errorUrl,
  errorAlt,
}: {
  initialUrl: string | null
  initialAlt: string | null
  errorUrl?: string
  errorAlt?: string
}) {
  const [url, setUrl] = useState(initialUrl ?? "")
  const [alt, setAlt] = useState(initialAlt ?? "")
  const [status, setStatus] = useState<Status>(initialUrl ? "ready" : "empty")
  const [errMsg, setErrMsg] = useState("")
  const [pasteUrl, setPasteUrl] = useState("")
  const fileInput = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setStatus("uploading")
    setErrMsg("")
    try {
      const presign = await getProductImageUploadUrl({
        filename: file.name,
        contentType: file.type,
        size: file.size,
        prefix: "collections",
      })
      if (!presign.ok) throw new Error(presign.error)

      const put = await fetch(presign.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type, "x-amz-acl": "public-read" },
      })
      if (!put.ok) throw new Error(`Subida fallida (${put.status})`)

      setUrl(presign.publicUrl)
      setStatus("ready")
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Error al subir")
      setStatus("error")
    }
  }

  function onPick(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    uploadFile(file)
    if (fileInput.current) fileInput.current.value = ""
  }

  function addUrl() {
    const u = pasteUrl.trim()
    if (!u) return
    if (!u.startsWith("http")) {
      alert("La URL debe empezar por http:// o https://")
      return
    }
    setUrl(u)
    setStatus("ready")
    setPasteUrl("")
  }

  function remove() {
    setUrl("")
    setAlt("")
    setStatus("empty")
  }

  return (
    <div className="sm:col-span-2 space-y-3">
      <input type="hidden" name="imageUrl" value={url} />
      <input type="hidden" name="imageAlt" value={alt} />

      <FieldShell
        label="Imagen de la colección"
        hint={status === "empty" ? "Sube una imagen o pega una URL. Vacío = solo gradient." : undefined}
        error={errorUrl}
      >
        {status === "empty" && (
          <>
            <div
              className="relative flex flex-col items-center justify-center gap-1.5 px-4 py-6 rounded-xl border-2 border-dashed border-pink-light bg-cream/50 hover:border-pink-primary transition cursor-pointer"
            >
              <UploadCloud className="w-6 h-6 text-pink-deep" />
              <p className="font-semibold text-text-dark text-xs">
                Suelta una foto o haz click
              </p>
              <p className="text-[10px] text-text-mid">JPG/PNG/WEBP · máx 8 MB</p>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => onPick(e.target.files)}
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="url"
                value={pasteUrl}
                onChange={(e) => setPasteUrl(e.target.value)}
                placeholder="O pega una URL…"
                className="flex-1 px-3 py-2 rounded-full bg-white border-2 border-pink-light text-xs outline-none focus:border-pink-primary placeholder:text-text-mid/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addUrl()
                  }
                }}
              />
              <button
                type="button"
                onClick={addUrl}
                className="btn-pill btn-teal !px-3 !py-1.5 text-[10px]"
              >
                <Plus className="w-3 h-3" /> Añadir
              </button>
            </div>
          </>
        )}

        {status === "uploading" && (
          <div className="flex items-center justify-center gap-2 py-6 rounded-xl bg-pink-light/40">
            <Loader2 className="w-5 h-5 text-pink-deep animate-spin" />
            <span className="text-sm text-text-mid">Subiendo…</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-2 py-6 rounded-xl bg-red-50 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-xs">{errMsg}</span>
            <button
              type="button"
              onClick={() => setStatus("empty")}
              className="text-xs font-bold underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {status === "ready" && url && (
          <div className="flex items-start gap-3">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden gold-border shrink-0 group cursor-pointer">
              <Image
                src={url}
                alt={alt || ""}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => onPick(e.target.files)}
              />
              <button
                type="button"
                onClick={remove}
                aria-label="Quitar imagen"
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600 hover:text-white z-20"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-[10px] text-text-mid truncate max-w-xs">{url}</p>
              <FieldShell
                label="Alt de la imagen"
                hint="Texto alternativo (SEO). Vacío = decorativa."
                error={errorAlt}
              >
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Bolsos de fiesta artesanales"
                  maxLength={200}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-pink-light text-sm outline-none focus:border-pink-primary placeholder:text-text-mid/50"
                />
              </FieldShell>
            </div>
          </div>
        )}
      </FieldShell>
    </div>
  )
}
