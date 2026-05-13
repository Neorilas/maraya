import { NextRequest, NextResponse } from "next/server"
import { confirmPasswordChange } from "@/lib/admin/admins"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!token) {
    return htmlResponse(false, "Falta el token de confirmación.")
  }

  const result = await confirmPasswordChange(token)
  return htmlResponse(result.ok, result.message)
}

function htmlResponse(ok: boolean, message: string) {
  const color = ok ? "#10B981" : "#EF4444"
  const icon = ok ? "&#10003;" : "&#10007;"
  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${ok ? "Contraseña actualizada" : "Error"} — Maraya Admin</title></head>
<body style="margin:0;padding:0;background:#FFF8F0;font-family:Nunito,Arial,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;">
  <div style="background:#fff;border-radius:18px;padding:48px;max-width:440px;text-align:center;box-shadow:0 4px 14px rgba(31,31,31,0.06);">
    <div style="font-size:48px;color:${color};margin-bottom:16px;">${icon}</div>
    <h1 style="font-family:Georgia,serif;font-style:italic;color:#1F1F1F;margin:0 0 12px 0;font-size:22px;">${ok ? "Contraseña actualizada" : "No se pudo cambiar"}</h1>
    <p style="color:#6B7280;line-height:1.6;">${message}</p>
    <a href="/admin" style="display:inline-block;margin-top:24px;padding:10px 24px;background:#F472B6;color:#fff;text-decoration:none;border-radius:9999px;font-weight:bold;font-size:14px;">Ir al panel</a>
  </div>
</body>
</html>`
  return new NextResponse(html, {
    status: ok ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
