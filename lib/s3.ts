import { S3Client } from "@aws-sdk/client-s3"

/**
 * Cliente S3 para Hetzner Object Storage.
 * Hetzner es S3-compatible, requiere `forcePathStyle: false` (usa virtual-host style).
 *
 * Variables de entorno requeridas:
 *   S3_ENDPOINT          ej. https://nbg1.your-objectstorage.com
 *   S3_REGION            ej. nbg1
 *   S3_BUCKET            nombre del bucket
 *   S3_ACCESS_KEY_ID
 *   S3_SECRET_ACCESS_KEY
 *   S3_PUBLIC_URL        (opcional) URL pública para servir, ej. https://BUCKET.REGION.your-objectstorage.com
 */

export function isS3Configured(): boolean {
  return !!(
    process.env.S3_REGION &&
    process.env.S3_ENDPOINT &&
    process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  )
}

function need(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Falta variable de entorno: ${name}`)
  return v
}

let _client: S3Client | null = null

export function s3(): S3Client {
  if (_client) return _client
  _client = new S3Client({
    region: need("S3_REGION"),
    endpoint: need("S3_ENDPOINT"),
    credentials: {
      accessKeyId: need("S3_ACCESS_KEY_ID"),
      secretAccessKey: need("S3_SECRET_ACCESS_KEY"),
    },
    forcePathStyle: false,
  })
  return _client
}

export function bucketName(): string {
  return need("S3_BUCKET")
}

/**
 * URL pública del bucket (para mostrar imágenes). Si no se define S3_PUBLIC_URL,
 * la deriva del endpoint + bucket usando virtual-host style.
 */
export function publicBaseUrl(): string {
  const explicit = process.env.S3_PUBLIC_URL
  if (explicit) return explicit.replace(/\/$/, "")
  const endpoint = need("S3_ENDPOINT").replace(/^https?:\/\//, "").replace(/\/$/, "")
  return `https://${bucketName()}.${endpoint}`
}

/** Construye la URL pública de un object key. */
export function publicUrl(key: string): string {
  return `${publicBaseUrl()}/${key.replace(/^\/+/, "")}`
}
