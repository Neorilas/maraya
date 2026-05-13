import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react"
import { getSettings } from "@/lib/store/content"
import { ContactForm } from "@/components/store/ContactForm"
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  TwitterXIcon,
} from "@/components/store/SocialIcons"

export const metadata = {
  title: "Contacto",
  description: "¿Tienes alguna pregunta? Escríbenos y te responderemos lo antes posible.",
  openGraph: {
    title: "Contacto",
    description: "¿Tienes alguna pregunta? Escríbenos y te responderemos lo antes posible.",
  },
  alternates: { canonical: "/contacto" },
}

export default async function ContactoPage() {
  const s = await getSettings()

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <header className="text-center mb-10">
        <h1 className="font-display italic text-3xl sm:text-4xl text-text-dark">
          Contacto
        </h1>
        {s.contactIntro && (
          <p className="text-text-mid mt-3 max-w-xl mx-auto">
            {s.contactIntro}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12">
        {/* Info lateral */}
        <div className="space-y-6">
          <div className="card-maraya p-5 sm:p-6 space-y-4">
            <h2 className="font-display text-lg text-text-dark">
              Información de contacto
            </h2>

            {s.storeEmail && (
              <InfoRow icon={Mail} label="Email">
                <a href={`mailto:${s.storeEmail}`} className="text-pink-deep hover:underline">
                  {s.storeEmail}
                </a>
              </InfoRow>
            )}

            {s.contactPhone && (
              <InfoRow icon={Phone} label="Teléfono">
                <a href={`tel:${s.contactPhone}`} className="text-pink-deep hover:underline">
                  {s.contactPhone}
                </a>
              </InfoRow>
            )}

            {s.whatsappNumber && (
              <InfoRow icon={MessageCircle} label="WhatsApp">
                <a
                  href={`https://wa.me/${s.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-deep hover:underline"
                >
                  {s.whatsappNumber}
                </a>
              </InfoRow>
            )}

            {s.contactAddress && (
              <InfoRow icon={MapPin} label="Dirección">
                <span className="whitespace-pre-line">{s.contactAddress}</span>
              </InfoRow>
            )}

            {s.contactSchedule && (
              <InfoRow icon={Clock} label="Horario">
                {s.contactSchedule}
              </InfoRow>
            )}
          </div>

          {/* Redes sociales */}
          <div className="card-maraya p-5 sm:p-6">
            <h2 className="font-display text-lg text-text-dark mb-3">
              Síguenos
            </h2>
            <div className="flex gap-3">
              {s.instagramUrl && (
                <SocialLink href={s.instagramUrl}>
                  <InstagramIcon className="w-5 h-5" />
                </SocialLink>
              )}
              {s.facebookUrl && (
                <SocialLink href={s.facebookUrl}>
                  <FacebookIcon className="w-5 h-5" />
                </SocialLink>
              )}
              {s.tiktokUrl && (
                <SocialLink href={s.tiktokUrl}>
                  <TikTokIcon className="w-5 h-5" />
                </SocialLink>
              )}
              {s.twitterUrl && (
                <SocialLink href={s.twitterUrl}>
                  <TwitterXIcon className="w-5 h-5" />
                </SocialLink>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </section>
  )
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-8 h-8 rounded-full bg-pink-light text-pink-deep flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider text-text-mid">
          {label}
        </div>
        <div className="text-sm text-text-dark mt-0.5">{children}</div>
      </div>
    </div>
  )
}

function SocialLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="w-10 h-10 rounded-full bg-pink-light text-pink-deep flex items-center justify-center hover:bg-pink-primary hover:text-white transition"
    >
      {children}
    </a>
  )
}
