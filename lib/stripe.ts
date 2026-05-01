import Stripe from "stripe"

let _stripe: Stripe | null = null

export function stripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new StripeNotConfiguredError()
  }
  // El SDK v22 cuela la apiVersion por defecto; no la fijamos para evitar acoplamiento.
  _stripe = new Stripe(key)
  return _stripe
}

export class StripeNotConfiguredError extends Error {
  constructor() {
    super(
      "Stripe no está configurado. Define STRIPE_SECRET_KEY en .env (clave de TEST en dev).",
    )
  }
}

export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLIC_KEY)
}
