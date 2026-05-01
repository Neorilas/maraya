import { CartView } from "@/components/store/CartView"

export const metadata = {
  title: "Tu carrito · Maraya Store",
}

export default function CarritoPage() {
  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-10 lg:py-14">
        <header className="text-center mb-8">
          <span className="font-script text-2xl text-pink-primary block">
            Tu selección
          </span>
          <h1 className="font-display italic !text-text-dark">Carrito</h1>
          <div className="divider-heart">
            <span aria-hidden>♡</span>
          </div>
        </header>

        <CartView />
      </div>
    </div>
  )
}
