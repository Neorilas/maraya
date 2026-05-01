import { Stars } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { Input, Textarea } from "@/components/admin/forms/Field"
import type { StoreSettings } from "@/lib/store/content"

export function SectionBrandBanner({
  s,
  errors,
}: {
  s: StoreSettings
  errors: Record<string, string>
}) {
  return (
    <SectionCard
      title="Banner de marca"
      description="La sección turquesa con animal print ('Brilla. Destaca. Sé Maraya.')."
      icon={Stars}
    >
      <Input
        label="Eyebrow"
        name="brandBannerEyebrow"
        defaultValue={s.brandBannerEyebrow ?? ""}
        hint="Texto cursivo pequeño rosa arriba del título."
        error={errors.brandBannerEyebrow}
      />
      <Input
        label="Badge dorado (círculo girando)"
        name="brandBannerBadge"
        defaultValue={s.brandBannerBadge ?? ""}
        hint="Vacío = oculto."
        error={errors.brandBannerBadge}
      />
      <Textarea
        label="Título (saltos de línea separan las palabras grandes)"
        name="brandBannerTitle"
        defaultValue={s.brandBannerTitle}
        rows={3}
        required
        hint="La última línea sale en rosa. Cada salto = una nueva línea grande."
        error={errors.brandBannerTitle}
        className="sm:col-span-2"
      />
      <Textarea
        label="Texto descriptivo"
        name="brandBannerText"
        defaultValue={s.brandBannerText}
        rows={3}
        error={errors.brandBannerText}
        className="sm:col-span-2"
      />
      <Input
        label="CTA · texto"
        name="brandBannerCtaText"
        defaultValue={s.brandBannerCtaText ?? ""}
        hint="Vacío = oculto."
        error={errors.brandBannerCtaText}
      />
      <Input
        label="CTA · URL"
        name="brandBannerCtaUrl"
        defaultValue={s.brandBannerCtaUrl ?? ""}
        error={errors.brandBannerCtaUrl}
      />
    </SectionCard>
  )
}
