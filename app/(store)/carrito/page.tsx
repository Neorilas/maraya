import { CartView } from "@/components/store/CartView"

export const metadata = {
  title: "Tu carrito · Maraya Store",
}

export default function CarritoPage() {
  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-14">
        <header className="text-center mb-6 sm:mb-8">
          <span className="font-script text-xl sm:text-2xl text-pink-primary block">
            Tu selección
          </span>
          <h1 className="font-display italic !text-text-dark text-2xl sm:text-3xl lg:text-4xl">
            Carrito
          </h1>
          <div className="divider-heart my-3 sm:my-6">
            <span aria-hidden>♡</span>
          </div>
        </header>

        <CartView />
      </div>
    </div>
  )
}
