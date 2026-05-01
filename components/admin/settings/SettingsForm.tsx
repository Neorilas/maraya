"use client"

import { useActionState } from "react"
import { saveSettingsAction, type SettingsFormState } from "@/lib/admin/settings"
import type { StoreSettings } from "@/lib/store/content"
import { SectionStore } from "./SectionStore"
import { SectionSocial } from "./SectionSocial"
import { SectionStripe } from "./SectionStripe"
import { SectionFooter } from "./SectionFooter"
import { SettingsStickyBar } from "./SettingsStickyBar"

const initialState: SettingsFormState = { ok: false }

/**
 * Form de /admin/configuracion: datos operativos de la tienda.
 * (Hero, top bar y brand banner se editan desde /admin/contenido.)
 */
export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [state, formAction, isPending] = useActionState(
    saveSettingsAction,
    initialState,
  )
  const errors = state.errors ?? {}

  return (
    <form action={formAction} className="space-y-6">
      <SectionStore  s={settings} errors={errors} />
      <SectionSocial s={settings} errors={errors} />
      <SectionStripe s={settings} errors={errors} />
      <SectionFooter s={settings} errors={errors} />

      <SettingsStickyBar state={state} pending={isPending} />
    </form>
  )
}
