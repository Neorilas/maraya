import { CheckoutForm } from "@/components/store/CheckoutForm"
import { getSettings } from "@/lib/store/content"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Checkout · Maraya Store",
  robots: { index: false, follow: false },
}

export default async function CheckoutPage() {
  const settings = await getSettings()
  const stripeKey = settings.stripePublicKey?.trim() || process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY?.trim() || null

  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-14">
        <header className="text-center mb-6 sm:mb-8">
          <span className="font-script text-xl sm:text-2xl text-pink-primary block">
            Estás a un paso
          </span>
          <h1 className="font-display italic !text-text-dark text-2xl sm:text-3xl lg:text-4xl">
            Finalizar pedido
          </h1>
          <div className="divider-heart my-3 sm:my-6">
            <span aria-hidden>♡</span>
          </div>
        </header>

        <CheckoutForm stripePublicKey={stripeKey} />
      </div>
    </div>
  )
}
