import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import sharp from "sharp"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
])
const MAX_BYTES = 8 * 1024 * 1024

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./uploads")

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json(
      { ok: false, error: "No autorizado" },
      { status: 401 },
    )
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) {
    return NextResponse.json(
      { ok: false, error: "No se recibió archivo" },
      { status: 400 },
    )
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: `Formato no permitido: ${file.type}` },
      { status: 400 },
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Archivo demasiado grande (máx 8 MB)" },
      { status: 400 },
    )
  }

  ensureDir()

  const id = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`
  const buffer = Buffer.from(await file.arrayBuffer())

  if (file.type === "image/gif") {
    const filename = `${id}.gif`
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer)
    return NextResponse.json({ ok: true, url: `/api/uploads/${filename}` })
  }

  const filename = `${id}.webp`
  await sharp(buffer).webp({ quality: 85 }).toFile(path.join(UPLOAD_DIR, filename))

  return NextResponse.json({ ok: true, url: `/api/uploads/${filename}` })
}
