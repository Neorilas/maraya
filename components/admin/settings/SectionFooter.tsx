import { LayoutTemplate } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { Textarea } from "@/components/admin/forms/Field"
import type { StoreSettings } from "@/lib/store/content"

export function SectionFooter({
  s,
  errors,
}: {
  s: StoreSettings
  errors: Record<string, string>
}) {
  return (
    <SectionCard
      title="Textos del footer"
      description="Las dos columnas de texto en la parte de abajo de la web."
      icon={LayoutTemplate}
    >
      <Textarea
        label="Newsletter — texto introductorio"
        name="newsletterIntro"
        defaultValue={s.newsletterIntro ?? ""}
        rows={2}
        error={errors.newsletterIntro}
      />
      <Textarea
        label="Maraya Club — descripción"
        name="clubIntro"
        defaultValue={s.clubIntro ?? ""}
        rows={2}
        error={errors.clubIntro}
      />
    </SectionCard>
  )
}
