"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendStatusUpdateEmail } from "@/lib/email/notifications"

const statusEnum = z.enum([
  "PENDIENTE",
  "PAGADO",
  "EN_PREPARACION",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
  "REEMBOLSADO",
])

/** Estados que disparan email al cliente automáticamente. */
const STATUSES_THAT_NOTIFY = new Set([
  "EN_PREPARACION",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
  "REEMBOLSADO",
] as const)

const updateSchema = z.object({
  orderId: z.string().min(1),
  status: statusEnum,
  note: z.string().max(500).optional(),
  trackingNumber: z.string().max(80).optional(),
})

export type ActionResult = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
}

function fdToObj(fd: FormData): Record<string, FormDataEntryValue | null> {
  const o: Record<string, FormDataEntryValue | null> = {}
  for (const [k, v] of fd.entries()) o[k] = v
  return o
}

async function requireSession() {
  const s = await auth()
  if (!s?.user) throw new Error("No autorizado")
}

/**
 * Cambia el estado del pedido, registra el evento en el historial y, si el nuevo
 * estado lo requiere, envía email al cliente.
 */
export async function updateOrderStatus(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  await requireSession()
  const parsed = updateSchema.safeParse(fdToObj(fd))
  if (!parsed.success) {
    return { ok: false, message: "Datos inválidos" }
  }
  const { orderId, status, note, trackingNumber } = parsed.data

  const current = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  })
  if (!current) return { ok: false, message: "Pedido no encontrado" }
  if (current.status === status && !trackingNumber && !note) {
    return { ok: true, message: "Sin cambios" }
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(trackingNumber !== undefined && trackingNumber !== ""
          ? { trackingNumber }
          : {}),
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        note: note?.trim() || null,
      },
    }),
  ])

  // Email al cliente si aplica (no bloqueamos la action si falla el envío)
  if (STATUSES_THAT_NOTIFY.has(status as never)) {
    try {
      await sendStatusUpdateEmail(orderId, status as Parameters<typeof sendStatusUpdateEmail>[1])
    } catch (err) {
      console.error("[admin orders] error enviando email update:", err)
    }
  }

  revalidatePath("/admin/pedidos")
  revalidatePath(`/admin/pedidos/${orderId}`)
  revalidatePath(`/seguimiento/[orderNumber]`, "page")
  return { ok: true, message: "Estado actualizado" }
}
