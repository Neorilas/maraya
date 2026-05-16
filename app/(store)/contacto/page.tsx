import { Mail, Phone, MapPin, Clock, MessageCircle, ChevronDown } from "lucide-react"
import { getSettings } from "@/lib/store/content"
import { ContactForm } from "@/components/store/ContactForm"
import { JsonLd, faqJsonLd } from "@/lib/store/jsonld"
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  TwitterXIcon,
} from "@/components/store/SocialIcons"

const FAQS = [
  {
    question: "¿Cuánto tarda el envío?",
    answer: "Los pedidos nacionales (España peninsular) se entregan en 2-4 días laborables. Baleares y Canarias entre 4-7 días. Envíos internacionales entre 5-10 días laborables según destino.",
  },
  {
    question: "¿Puedo devolver mi bolso?",
    answer: "Sí, aceptamos devoluciones en un plazo de 14 días naturales desde la recepción del pedido, siempre que el producto esté sin usar y en su embalaje original. Contacta con nosotros para gestionar la devolución.",
  },
  {
    question: "¿Los bolsos son artesanales?",
    answer: "Sí, cada bolso Maraya está hecho a mano con materiales seleccionados. Son piezas únicas con pequeñas variaciones que las hacen especiales e irrepetibles.",
  },
  {
    question: "¿Hacéis envíos internacionales?",
    answer: "Sí, enviamos a toda Europa, Estados Unidos y otros destinos. Los gastos de envío se calculan automáticamente en el checkout según el país de destino.",
  },
  {
    question: "¿Cómo cuido mi bolso Maraya?",
    answer: "Recomendamos guardarlo en su bolsa de tela cuando no lo uses, evitar el contacto con agua y productos químicos, y limpiarlo con un paño suave y seco. Para manchas, usa un limpiador específico para el tipo de material.",
  },
]

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
    <>
    <JsonLd data={faqJsonLd(FAQS)} />
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

      {/* Preguntas frecuentes */}
      <div className="mt-12 sm:mt-16">
        <h2 className="font-display italic text-2xl sm:text-3xl text-text-dark text-center mb-8">
          Preguntas frecuentes
        </h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.question} className="card-maraya group">
              <summary className="px-5 py-4 cursor-pointer flex items-center justify-between gap-3 list-none [&::-webkit-details-marker]:hidden font-semibold text-text-dark">
                {faq.question}
                <ChevronDown className="w-4 h-4 text-text-mid transition-transform group-open:rotate-180 shrink-0" />
              </summary>
              <p className="px-5 pb-4 text-sm text-text-mid leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
    </>
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
