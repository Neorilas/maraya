import { Share2 } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { Input } from "@/components/admin/forms/Field"
import type { StoreSettings } from "@/lib/store/content"

export function SectionSocial({
  s,
  errors,
}: {
  s: StoreSettings
  errors: Record<string, string>
}) {
  return (
    <SectionCard
      title="Redes sociales y WhatsApp"
      description="Aparecen en el footer y en el botón verde de soporte."
      icon={Share2}
    >
      <Input
        label="Instagram URL"
        name="instagramUrl"
        defaultValue={s.instagramUrl ?? ""}
        placeholder="https://instagram.com/marayastore"
        error={errors.instagramUrl}
      />
      <Input
        label="Facebook URL"
        name="facebookUrl"
        defaultValue={s.facebookUrl ?? ""}
        placeholder="https://facebook.com/marayastore"
        error={errors.facebookUrl}
      />
      <Input
        label="TikTok URL"
        name="tiktokUrl"
        defaultValue={s.tiktokUrl ?? ""}
        placeholder="https://tiktok.com/@marayastore"
        error={errors.tiktokUrl}
      />
      <Input
        label="X / Twitter URL"
        name="twitterUrl"
        defaultValue={s.twitterUrl ?? ""}
        placeholder="https://x.com/marayastore"
        error={errors.twitterUrl}
      />
      <Input
        label="Número WhatsApp (con prefijo)"
        name="whatsappNumber"
        defaultValue={s.whatsappNumber ?? ""}
        placeholder="+34600123456"
        hint="Solo dígitos válidos. Se usa para el botón verde y el share."
        error={errors.whatsappNumber}
        className="sm:col-span-2"
      />
    </SectionCard>
  )
}
