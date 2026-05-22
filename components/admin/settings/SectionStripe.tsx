import { CreditCard } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { Input } from "@/components/admin/forms/Field"
import type { StoreSettings } from "@/lib/store/content"

export function SectionStripe({
  s,
  errors,
  hasStripeSecretKey = false,
  hasStripeWebhookSecret = false,
}: {
  s: StoreSettings
  errors: Record<string, string>
  hasStripeSecretKey?: boolean
  hasStripeWebhookSecret?: boolean
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
        placeholder={hasStripeSecretKey ? "••••••••  (guardada)" : "sk_test_..."}
        hint={hasStripeSecretKey ? "Clave guardada. Deja vacío para mantener la actual." : "Solo en backend. Nunca se expone."}
        error={errors.stripeSecretKey}
      />
      <Input
        label="Webhook Secret"
        name="stripeWebhookSecret"
        type="password"
        placeholder={hasStripeWebhookSecret ? "••••••••  (guardada)" : "whsec_..."}
        hint={hasStripeWebhookSecret ? "Clave guardada. Deja vacío para mantener la actual." : "Para verificar firmas del webhook."}
        error={errors.stripeWebhookSecret}
        className="sm:col-span-2"
      />
    </SectionCard>
  )
}
