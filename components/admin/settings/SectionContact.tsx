import { Mail } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { Input, Textarea } from "@/components/admin/forms/Field"
import type { StoreSettings } from "@/lib/store/content"

export function SectionContact({
  s,
  errors,
}: {
  s: StoreSettings
  errors: Record<string, string>
}) {
  return (
    <SectionCard
      title="Página de Contacto"
      description="Texto introductorio y datos que aparecen junto al formulario."
      icon={Mail}
    >
      <Textarea
        label="Texto introductorio"
        name="contactIntro"
        defaultValue={s.contactIntro ?? ""}
        rows={2}
        error={errors.contactIntro}
        className="sm:col-span-2"
      />
      <Input
        label="Teléfono de contacto"
        name="contactPhone"
        defaultValue={s.contactPhone ?? ""}
        hint="Se muestra en la página de contacto. Distinto del WhatsApp."
        error={errors.contactPhone}
      />
      <Input
        label="Horario de atención"
        name="contactSchedule"
        defaultValue={s.contactSchedule ?? ""}
        error={errors.contactSchedule}
      />
      <Textarea
        label="Dirección física"
        name="contactAddress"
        defaultValue={s.contactAddress ?? ""}
        rows={2}
        hint="Vacío = no se muestra."
        error={errors.contactAddress}
        className="sm:col-span-2"
      />
    </SectionCard>
  )
}
