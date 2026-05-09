import { NextRequest, NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./uploads")

const MIME_MAP: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".avif": "image/avif",
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params
  const filename = path.basename(segments.join("/"))
  const filepath = path.join(UPLOAD_DIR, filename)

  if (!fs.existsSync(filepath)) {
    return new NextResponse("Not found", { status: 404 })
  }

  const ext = path.extname(filename).toLowerCase()
  const contentType = MIME_MAP[ext] || "application/octet-stream"
  const data = fs.readFileSync(filepath)

  return new NextResponse(data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
