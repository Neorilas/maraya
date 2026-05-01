import { Megaphone } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { Input, Toggle } from "@/components/admin/forms/Field"
import type { StoreSettings } from "@/lib/store/content"

export function SectionTopBar({
  s,
  errors,
}: {
  s: StoreSettings
  errors: Record<string, string>
}) {
  return (
    <SectionCard
      title="Top bar promocional"
      description="La franja rosa con el corazón en lo alto del sitio."
      icon={Megaphone}
      cols={1}
    >
      <Input
        label="Texto"
        name="topBarText"
        defaultValue={s.topBarText}
        hint="Mantenlo corto. Ideal para campañas (ej: 'Black Friday: -30% en todo')."
        error={errors.topBarText}
      />
      <Toggle
        name="topBarActive"
        defaultChecked={s.topBarActive}
        label="Mostrar top bar"
        hint="Si lo desactivas, la franja desaparece de la web."
      />
    </SectionCard>
  )
}
