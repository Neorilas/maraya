import { Heart } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { Input, Textarea } from "@/components/admin/forms/Field"
import type { StoreSettings } from "@/lib/store/content"

export function SectionAbout({
  s,
  errors,
}: {
  s: StoreSettings
  errors: Record<string, string>
}) {
  return (
    <SectionCard
      title="Sobre Nosotros"
      description="Contenido de la página /sobre-nosotros (historia, valores, proceso)."
      icon={Heart}
    >
      <Textarea
        label="Introducción"
        name="aboutIntro"
        defaultValue={s.aboutIntro ?? ""}
        rows={2}
        error={errors.aboutIntro}
        className="sm:col-span-2"
      />
      <Input
        label="Título · Historia"
        name="aboutHistoryTitle"
        defaultValue={s.aboutHistoryTitle ?? ""}
        error={errors.aboutHistoryTitle}
      />
      <Input
        label="Título · Valores"
        name="aboutValuesTitle"
        defaultValue={s.aboutValuesTitle ?? ""}
        error={errors.aboutValuesTitle}
      />
      <Textarea
        label="Texto · Historia"
        name="aboutHistoryText"
        defaultValue={s.aboutHistoryText ?? ""}
        rows={4}
        error={errors.aboutHistoryText}
        className="sm:col-span-2"
      />
      <Textarea
        label="Texto · Valores"
        name="aboutValuesText"
        defaultValue={s.aboutValuesText ?? ""}
        rows={4}
        hint="Separa valores con · o saltos de línea."
        error={errors.aboutValuesText}
        className="sm:col-span-2"
      />
      <Input
        label="Título · Proceso"
        name="aboutProcessTitle"
        defaultValue={s.aboutProcessTitle ?? ""}
        error={errors.aboutProcessTitle}
      />
      <Textarea
        label="Texto · Proceso"
        name="aboutProcessText"
        defaultValue={s.aboutProcessText ?? ""}
        rows={4}
        error={errors.aboutProcessText}
        className="sm:col-span-2"
      />
    </SectionCard>
  )
}
