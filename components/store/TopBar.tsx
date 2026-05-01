import { Heart } from "lucide-react"
import { getSettings } from "@/lib/store/content"

export async function TopBar() {
  const settings = await getSettings()
  if (!settings.topBarActive || !settings.topBarText.trim()) return null

  return (
    <div className="bg-pink-light text-pink-deep text-xs sm:text-sm py-2">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-center gap-2 font-semibold tracking-wide uppercase text-center">
        <Heart className="w-3.5 h-3.5 fill-pink-deep stroke-none shrink-0" />
        <span>{settings.topBarText}</span>
        <Heart className="w-3.5 h-3.5 fill-pink-deep stroke-none shrink-0" />
      </div>
    </div>
  )
}
