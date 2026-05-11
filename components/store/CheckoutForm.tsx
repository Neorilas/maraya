"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe, type Stripe } from "@stripe/stripe-js"
import { Loader2, Lock, ArrowLeft, AlertCircle } from "lucide-react"
import { Input, Select } from "@/components/admin/forms/Field"
import { useCart } from "@/lib/store/cart"
import { CHECKOUT_COUNTRIES, checkoutSchema, type CheckoutData } from "@/lib/checkout"
import { CheckoutSummary, type ShippingState } from "./CheckoutSummary"

const COUNTRY_OPTIONS = [
  { value: "", label: "— Selecciona país —" },
  ...CHECKOUT_COUNTRIES.map((c) => ({ value: c.code, label: c.label })),
]

const FORMAT_EUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" })

/**
 * Wrapper que carga Stripe.js y monta Elements con datos diferidos
 * (no requiere PI creado previamente, lo creamos al confirmar).
 */
export function CheckoutForm({ stripePublicKey }: { stripePublicKey: string | null }) {
  const stripePromise = useMemo<Promise<Stripe | null> | null>(
    () => (stripePublicKey ? loadStripe(stripePublicKey) : null),
    [stripePublicKey],
  )

  if (!stripePromise) {
    return (
      <div className="card-maraya p-6 border-l-4 border-l-pink-deep flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-pink-deep mt-0.5 shrink-0" />
        <div>
          <p className="font-bold text-text-dark">
            Pasarela de pago todavía no configurada
          </p>
          <p className="text-sm text-text-mid mt-1">
            En <Link href="/admin/configuracion" className="underline text-pink-deep">/admin/configuracion</Link>{" "}
            añade tu Stripe public key para activar el checkout.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: 100, // se sobreescribe al actualizar; min 50¢ para evitar warning
        currency: "eur",
        locale: "es",
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#F472B6",
            colorBackground: "#ffffff",
            colorText: "#1F1F1F",
            borderRadius: "12px",
            fontFamily: "Nunito, sans-serif",
          },
        },
      }}
    >
      <CheckoutFormInner />
    </Elements>
  )
}

function CheckoutFormInner() {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const items = useCart((s) => s.items)
  const subtotal = useCart((s) => s.subtotal())
  const clearCart = useCart((s) => s.clear)

  const [country, setCountry] = useState("")
  const [shipping, setShipping] = useState<ShippingState>({ status: "idle" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [topError, setTopError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Recálculo de envío al cambiar país o subtotal
  useEffect(() => {
    if (!country) { setShipping({ status: "idle" }); return }
    let aborted = false
    setShipping({ status: "loading" })
    fetch(`/api/shipping/quote?country=${encodeURIComponent(country)}&subtotal=${subtotal}`)
      .then(async (r) => {
        const data = await r.json()
        if (aborted) return
        if (!r.ok) { setShipping({ status: "error", message: data.error ?? "Error" }); return }
        setShipping({ status: "ok", ...data })
      })
      .catch(() => !aborted && setShipping({ status: "error", message: "Sin conexión" }))
    return () => { aborted = true }
  }, [country, subtotal])

  // Carrito vacío → /carrito
  useEffect(() => {
    if (items.length === 0) router.replace("/carrito")
  }, [items.length, router])

  // Actualiza el monto de Elements al cambiar total
  const total = useMemo(() => {
    const ship = shipping.status === "ok" ? shipping.cost : 0
    return Math.max(0.5, subtotal + ship) // Stripe pide mínimo
  }, [subtotal, shipping])

  useEffect(() => {
    if (!elements) return
    elements.update({ amount: Math.round(total * 100) })
  }, [elements, total])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTopError(null)
    setErrors({})

    if (!stripe || !elements) {
      setTopError("Stripe aún no está listo. Espera un segundo y vuelve a probar.")
      return
    }
    if (shipping.status !== "ok") {
      setTopError("Selecciona un país con envío disponible antes de pagar.")
      return
    }

    // Validar datos cliente
    const fd = new FormData(e.currentTarget)
    const obj: Record<string, FormDataEntryValue> = {}
    for (const [k, v] of fd.entries()) obj[k] = v

    const parsed = checkoutSchema.safeParse(obj)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const i of parsed.error.issues) {
        const k = i.path.join(".")
        if (!errs[k]) errs[k] = i.message
      }
      setErrors(errs)
      setTopError("Revisa los campos marcados.")
      return
    }

    setSubmitting(true)

    // 1) Validar tarjeta vía elements.submit()
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setTopError(submitError.message ?? "Error con los datos de pago")
      setSubmitting(false)
      return
    }

    // 2) Crear PaymentIntent server-side y obtener clientSecret
    const intentRes = await fetch("/api/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: parsed.data,
        items: items.map((it) => ({ productId: it.productId, quantity: it.quantity })),
      }),
    })
    const intentData = await intentRes.json()
    if (!intentRes.ok) {
      setTopError(intentData.error ?? "No se pudo iniciar el pago")
      setSubmitting(false)
      return
    }

    const { clientSecret, orderNumber, trackingToken } = intentData

    // 3) Confirmar el pago. Stripe redirige a return_url al éxito.
    const returnUrl = `${window.location.origin}/pedido-confirmado/${orderNumber}?token=${trackingToken}`
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: returnUrl, receipt_email: parsed.data.email },
    })

    if (confirmError) {
      setTopError(confirmError.message ?? "El pago no se pudo completar")
      setSubmitting(false)
      return
    }

    // Si llegamos aquí, Stripe está procesando el redirect.
    // Limpiamos el carrito en local. Si el redirect no llegara, lo limpia /pedido-confirmado.
    clearCart()
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_22rem] gap-6 lg:gap-8"
    >
      <div className="space-y-5 sm:space-y-6">
        <Section title="Datos personales">
          <Input label="Nombre"     name="firstName" required error={errors.firstName} />
          <Input label="Apellidos"  name="lastName"  required error={errors.lastName} />
          <Input label="Email"      name="email" type="email" required error={errors.email}
                 hint="Te enviaremos la confirmación aquí." />
          <Input label="Teléfono"   name="phone" required error={errors.phone}
                 placeholder="+34 600 123 456" />
          <Input label="DNI / NIE"  name="dni" required error={errors.dni}
                 placeholder="12345678Z" className="sm:col-span-2" />
        </Section>

        <Section title="Dirección de envío">
          <Input label="Dirección (calle y número)" name="address" required error={errors.address}
                 className="sm:col-span-2" />
          <Input label="Piso, puerta (opcional)" name="addressLine2" error={errors.addressLine2}
                 className="sm:col-span-2" />
          <Input label="Ciudad" name="city" required error={errors.city} />
          <Input label="Provincia / Estado" name="province" required error={errors.province} />
          <Input label="Código postal" name="postalCode" required error={errors.postalCode} />
          <Select
            label="País"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            options={COUNTRY_OPTIONS}
            required
            error={errors.country}
          />
        </Section>

        <Section title="Pago" cols={1}>
          <PaymentElement options={{ layout: "tabs" }} />
        </Section>

        {topError && (
          <div className="card-maraya p-4 flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border-red-200">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{topError}</span>
          </div>
        )}

        <div className="sticky bottom-0 -mx-3 sm:-mx-0 px-3 sm:px-0 py-3 bg-cream/95 backdrop-blur border-t border-pink-light flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-between gap-2 sm:gap-3 z-20">
          <Link
            href="/carrito"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-text-mid hover:text-pink-deep transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al carrito
          </Link>
          <button
            type="submit"
            disabled={submitting || shipping.status !== "ok" || !stripe || !elements}
            className="btn-pill btn-pink disabled:opacity-60 w-full sm:w-auto justify-center"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Procesando…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pagar {FORMAT_EUR.format(total)}
              </>
            )}
          </button>
        </div>
      </div>

      <CheckoutSummary items={items} subtotal={subtotal} shipping={shipping} />
    </form>
  )
}

function Section({
  title,
  children,
  cols = 2,
}: {
  title: string
  children: React.ReactNode
  cols?: 1 | 2
}) {
  const grid = cols === 2 ? "sm:grid-cols-2" : "grid-cols-1"
  return (
    <section className="card-maraya p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
      <h2 className="font-display !text-text-dark text-base sm:text-lg">{title}</h2>
      <div className={`grid grid-cols-1 ${grid} gap-3 sm:gap-4`}>{children}</div>
    </section>
  )
}
