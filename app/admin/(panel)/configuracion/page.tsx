import { getSettings } from "@/lib/store/content"
import { SettingsForm } from "@/components/admin/settings/SettingsForm"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Configuración · Maraya Admin",
  robots: { index: false, follow: false },
}

export default async function ConfiguracionPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h1 className="font-display italic text-3xl !text-text-dark">
          Configuración
        </h1>
        <p className="text-text-mid mt-1 text-sm">
          Datos de la tienda, textos del home, redes y claves Stripe.
          Los cambios se reflejan en la web inmediatamente al guardar.
        </p>
      </header>

      <SettingsForm settings={settings} />
    </div>
  )
}
