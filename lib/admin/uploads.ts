"use server"

import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "node:crypto"
import { auth } from "@/lib/auth"
import { s3, bucketName, publicUrl } from "@/lib/s3"

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
])
const MAX_BYTES = 8 * 1024 * 1024 // 8 MB por imagen

export type PresignResult =
  | {
      ok: true
      uploadUrl: string
      publicUrl: string
      key: string
    }
  | { ok: false; error: string }

/**
 * Genera una URL firmada para subir UN archivo directo del navegador a Hetzner S3.
 * El cliente luego hace `PUT uploadUrl` con el body del archivo.
 *
 * @param prefix carpeta lógica dentro del bucket, p.ej. "products"
 */
export async function getProductImageUploadUrl(input: {
  filename: string
  contentType: string
  size: number
  prefix?: string
}): Promise<PresignResult> {
  const session = await auth()
  if (!session?.user) return { ok: false, error: "No autorizado" }

  if (!ALLOWED_MIME.has(input.contentType)) {
    return { ok: false, error: `Formato no permitido: ${input.contentType}` }
  }
  if (input.size > MAX_BYTES) {
    return { ok: false, error: "Archivo demasiado grande (máx 8 MB)" }
  }

  const ext = (input.filename.match(/\.([a-z0-9]+)$/i)?.[1] ?? "bin").toLowerCase()
  const safeExt = ext.length <= 5 ? ext : "bin"
  const id = crypto.randomBytes(12).toString("hex")
  const prefix = (input.prefix ?? "products").replace(/[^a-z0-9/_-]/gi, "")
  const key = `${prefix}/${Date.now()}-${id}.${safeExt}`

  const uploadUrl = await getSignedUrl(
    s3(),
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: key,
      ContentType: input.contentType,
      // Hetzner soporta ACL public-read; lo pedimos para que la imagen sea servible
      ACL: "public-read",
    }),
    { expiresIn: 60 * 5 }, // 5 minutos
  )

  return {
    ok: true,
    uploadUrl,
    publicUrl: publicUrl(key),
    key,
  }
}
