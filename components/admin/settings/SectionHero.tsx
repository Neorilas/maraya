import { Wand2 } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { Input, Textarea } from "@/components/admin/forms/Field"
import type { StoreSettings } from "@/lib/store/content"

export function SectionHero({
  s,
  errors,
}: {
  s: StoreSettings
  errors: Record<string, string>
}) {
  return (
    <SectionCard
      title="Hero del home"
      description="La primera impresión cuando alguien entra en marayastore.com."
      icon={Wand2}
    >
      <Input
        label="Eyebrow (etiqueta dorada)"
        name="heroEyebrow"
        defaultValue={s.heroEyebrow ?? ""}
        hint="Texto pequeño en cápsula dorada arriba del título."
        error={errors.heroEyebrow}
      />
      <Input
        label="Imagen del bolso (URL)"
        name="heroImageUrl"
        defaultValue={s.heroImageUrl ?? ""}
        placeholder="(vacío = ilustración SVG por defecto)"
        hint="Pega la URL de la imagen subida. La subida directa llega en Step 6."
        error={errors.heroImageUrl}
      />
      <Input
        label="Título"
        name="heroTitle"
        defaultValue={s.heroTitle}
        required
        hint="Línea principal grande en cursiva."
        error={errors.heroTitle}
      />
      <Input
        label="Highlight"
        name="heroHighlight"
        defaultValue={s.heroHighlight}
        required
        hint="Palabra grande en rosa debajo del título."
        error={errors.heroHighlight}
      />
      <Textarea
        label="Subtítulo"
        name="heroSubtitle"
        defaultValue={s.heroSubtitle}
        rows={2}
        hint="Texto cursivo pequeño rosa bajo el título."
        error={errors.heroSubtitle}
        className="sm:col-span-2"
      />
      <Input
        label="CTA primario · texto"
        name="heroCtaPrimaryText"
        defaultValue={s.heroCtaPrimaryText}
        required
        error={errors.heroCtaPrimaryText}
      />
      <Input
        label="CTA primario · URL"
        name="heroCtaPrimaryUrl"
        defaultValue={s.heroCtaPrimaryUrl}
        required
        error={errors.heroCtaPrimaryUrl}
      />
      <Input
        label="CTA secundario · texto"
        name="heroCtaSecondaryText"
        defaultValue={s.heroCtaSecondaryText ?? ""}
        hint="Vacío = oculto."
        error={errors.heroCtaSecondaryText}
      />
      <Input
        label="CTA secundario · URL"
        name="heroCtaSecondaryUrl"
        defaultValue={s.heroCtaSecondaryUrl ?? ""}
        error={errors.heroCtaSecondaryUrl}
      />
    </SectionCard>
  )
}
