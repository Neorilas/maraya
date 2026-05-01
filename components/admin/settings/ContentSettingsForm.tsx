"use client"

import { useActionState } from "react"
import { saveSettingsAction, type SettingsFormState } from "@/lib/admin/settings"
import type { StoreSettings } from "@/lib/store/content"
import { SectionTopBar } from "./SectionTopBar"
import { SectionHero } from "./SectionHero"
import { SectionBrandBanner } from "./SectionBrandBanner"
import { SettingsStickyBar } from "./SettingsStickyBar"

const initialState: SettingsFormState = { ok: false }

/**
 * Form de /admin/contenido: campos visuales del home (top bar, hero,
 * banner de marca). Comparte la misma server action que SettingsForm,
 * que admite updates parciales — solo persiste los campos enviados.
 */
export function ContentSettingsForm({ settings }: { settings: StoreSettings }) {
  const [state, formAction, isPending] = useActionState(
    saveSettingsAction,
    initialState,
  )
  const errors = state.errors ?? {}

  return (
    <form action={formAction} className="space-y-6">
      <SectionTopBar      s={settings} errors={errors} />
      <SectionHero        s={settings} errors={errors} />
      <SectionBrandBanner s={settings} errors={errors} />

      <SettingsStickyBar state={state} pending={isPending} />
    </form>
  )
}
