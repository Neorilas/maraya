import { NextResponse } from "next/server"
import { z } from "zod"
import { getShippingQuote, NoShippingAvailableError } from "@/lib/shipping"

const querySchema = z.object({
  country: z.string().min(2).max(10),
  subtotal: z.coerce.number().min(0).max(1_000_000),
})

/** Endpoint público para que el checkout en cliente recalcule envío al cambiar país/subtotal. */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const parsed = querySchema.safeParse({
    country: url.searchParams.get("country"),
    subtotal: url.searchParams.get("subtotal"),
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 })
  }
  try {
    const quote = await getShippingQuote(parsed.data.country, parsed.data.subtotal)
    const res = NextResponse.json(quote)
    res.headers.set("Cache-Control", "public, max-age=300, s-maxage=600")
    return res
  } catch (err) {
    if (err instanceof NoShippingAvailableError) {
      return NextResponse.json(
        { error: "No hay envío disponible a esa zona" },
        { status: 422 },
      )
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
