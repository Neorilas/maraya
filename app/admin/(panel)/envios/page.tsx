import { prisma } from "@/lib/prisma"
import { ShippingZonesEditor } from "@/components/admin/shipping/ShippingZonesEditor"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Envíos · Maraya Admin",
  robots: { index: false, follow: false },
}

export default async function EnviosPage() {
  const zones = await prisma.shippingZone.findMany({ orderBy: { price: "asc" } })

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h1 className="font-display italic text-3xl !text-text-dark">Envíos</h1>
        <p className="text-text-mid mt-1 text-sm">
          Tarifas y umbrales por zona. Lo que pongas aquí se aplica al checkout
          según el país que elija el cliente.
        </p>
      </header>

      <ShippingZonesEditor zones={zones} />
    </div>
  )
}
