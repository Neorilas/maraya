import { Heart, Gem, Scissors } from "lucide-react"
import { getSettings } from "@/lib/store/content"

export const metadata = {
  title: "Sobre Nosotros",
  description: "Conoce la historia, valores y proceso detrás de cada bolso Maraya.",
  openGraph: {
    title: "Sobre Nosotros",
    description: "Conoce la historia, valores y proceso detrás de cada bolso Maraya.",
  },
  alternates: { canonical: "/sobre-nosotros" },
}

export default async function SobreNosotrosPage() {
  const s = await getSettings()

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <header className="text-center mb-12">
        <h1 className="font-display italic text-3xl sm:text-4xl text-text-dark">
          Sobre Nosotros
        </h1>
        {s.aboutIntro && (
          <p className="text-text-mid mt-3 max-w-xl mx-auto text-lg">
            {s.aboutIntro}
          </p>
        )}
      </header>

      <div className="space-y-10">
        {s.aboutHistoryText && (
          <Block
            icon={Heart}
            title={s.aboutHistoryTitle ?? "Nuestra historia"}
            text={s.aboutHistoryText}
          />
        )}

        {s.aboutValuesText && (
          <Block
            icon={Gem}
            title={s.aboutValuesTitle ?? "Nuestros valores"}
            text={s.aboutValuesText}
          />
        )}

        {s.aboutProcessText && (
          <Block
            icon={Scissors}
            title={s.aboutProcessTitle ?? "Nuestro proceso"}
            text={s.aboutProcessText}
          />
        )}
      </div>
    </section>
  )
}

function Block({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  text: string
}) {
  return (
    <article className="card-maraya p-6 sm:p-8 flex flex-col sm:flex-row gap-5">
      <span className="w-12 h-12 rounded-full bg-pink-light text-pink-deep flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6" />
      </span>
      <div className="min-w-0">
        <h2 className="font-display text-xl text-text-dark mb-2">{title}</h2>
        <p className="text-text-mid leading-relaxed whitespace-pre-line">{text}</p>
      </div>
    </article>
  )
}
