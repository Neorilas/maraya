import { Store } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { Input } from "@/components/admin/forms/Field"
import type { StoreSettings } from "@/lib/store/content"

export function SectionStore({
  s,
  errors,
}: {
  s: StoreSettings
  errors: Record<string, string>
}) {
  return (
    <SectionCard
      title="Datos de la tienda"
      description="Aparecen en el footer, los emails y el SEO."
      icon={Store}
    >
      <Input
        label="Nombre de la tienda"
        name="storeName"
        defaultValue={s.storeName}
        required
        error={errors.storeName}
      />
      <Input
        label="Email público (remitente de pedidos)"
        name="storeEmail"
        type="email"
        defaultValue={s.storeEmail}
        required
        error={errors.storeEmail}
      />
      <Input
        label="Email admin (notificaciones de pedidos)"
        name="adminEmail"
        type="email"
        defaultValue={s.adminEmail}
        required
        hint="Ahí llegan los avisos cada vez que entra un pedido."
        error={errors.adminEmail}
      />
    </SectionCard>
  )
}
