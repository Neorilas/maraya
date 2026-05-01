import { CreditCard } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { Input } from "@/components/admin/forms/Field"
import type { StoreSettings } from "@/lib/store/content"

export function SectionStripe({
  s,
  errors,
}: {
  s: StoreSettings
  errors: Record<string, string>
}) {
  return (
    <SectionCard
      title="Stripe"
      description="Claves de la pasarela de pago. Empezamos en TEST (pk_test_… / sk_test_…)."
      icon={CreditCard}
    >
      <Input
        label="Public Key"
        name="stripePublicKey"
        defaultValue={s.stripePublicKey ?? ""}
        placeholder="pk_test_..."
        hint="Visible en el navegador (no es secreta)."
        error={errors.stripePublicKey}
      />
      <Input
        label="Secret Key"
        name="stripeSecretKey"
        type="password"
        defaultValue={s.stripeSecretKey ?? ""}
        placeholder="sk_test_..."
        hint="Solo en backend. Nunca se expone."
        error={errors.stripeSecretKey}
      />
      <Input
        label="Webhook Secret"
        name="stripeWebhookSecret"
        type="password"
        defaultValue={s.stripeWebhookSecret ?? ""}
        placeholder="whsec_..."
        hint="Para verificar firmas del webhook (Step 10)."
        error={errors.stripeWebhookSecret}
        className="sm:col-span-2"
      />
    </SectionCard>
  )
}
