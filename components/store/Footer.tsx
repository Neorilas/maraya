import Link from "next/link"
import { Mail, Heart, MessageCircle } from "lucide-react"
import {
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  TwitterXIcon,
  TikTokIcon,
} from "@/components/store/SocialIcons"
import { getSettings } from "@/lib/store/content"

export async function Footer() {
  const s = await getSettings()
  const year = new Date().getFullYear()

  type Social = { url: string; label: string; icon: React.ReactNode }
  const socialsRaw: Array<Social | null> = [
    s.instagramUrl ? { url: s.instagramUrl, label: "Instagram", icon: <InstagramIcon /> } : null,
    s.facebookUrl  ? { url: s.facebookUrl,  label: "Facebook",  icon: <FacebookIcon /> } : null,
    s.tiktokUrl    ? { url: s.tiktokUrl,    label: "TikTok",    icon: <TikTokIcon /> } : null,
    s.twitterUrl   ? { url: s.twitterUrl,   label: "X / Twitter", icon: <TwitterXIcon /> } : null,
    s.whatsappNumber
      ? {
          url: `https://wa.me/${s.whatsappNumber.replace(/\D/g, "")}`,
          label: "WhatsApp",
          icon: <WhatsAppIcon />,
        }
      : null,
  ]
  const socials: Social[] = socialsRaw.filter((x): x is Social => x !== null)

  return (
    <footer className="relative bg-text-dark text-white mt-12">
      <div className="absolute inset-0 bg-leopard opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <span className="font-script text-2xl text-pink-primary">Síguenos</span>
          <p className="text-sm text-white/70 mt-3">
            Inspiración, novedades y bastante glam en tu feed.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            {socials.length > 0 ? (
              socials.map((sc) => (
                <SocialLink key={sc.label} href={sc.url} label={sc.label}>
                  {sc.icon}
                </SocialLink>
              ))
            ) : (
              <span className="text-xs text-white/50 italic">
                Configura redes en /admin/configuracion
              </span>
            )}
          </div>
        </div>

        <div>
          <span className="font-script text-2xl text-pink-primary">Newsletter</span>
          {s.newsletterIntro && (
            <p className="text-sm text-white/70 mt-3">{s.newsletterIntro}</p>
          )}
          <form className="mt-5 flex flex-col gap-2">
            <div className="flex items-center bg-white/10 border border-white/20 rounded-full overflow-hidden focus-within:border-pink-primary transition">
              <Mail className="w-4 h-4 text-pink-primary ml-4" />
              <input
                type="email"
                required
                placeholder="Tu email"
                className="flex-1 bg-transparent text-sm py-3 px-3 outline-none placeholder:text-white/50"
              />
            </div>
            <button type="submit" className="btn-pill btn-pink mt-1">
              Suscribirme
            </button>
          </form>
        </div>

        <div>
          <span className="font-script text-2xl text-pink-primary">
            Maraya Club
          </span>
          {s.clubIntro && (
            <p className="text-sm text-white/80 mt-3 leading-relaxed">
              {s.clubIntro}
            </p>
          )}
          <Link
            href="/club"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-pink-primary transition"
          >
            Únete ahora →
          </Link>
        </div>

        <div>
          <span className="font-script text-2xl text-pink-primary">
            ¿Necesitas ayuda?
          </span>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/contacto" className="hover:text-pink-primary">Contacto</Link></li>
            <li><Link href="/envios" className="hover:text-pink-primary">Envíos y devoluciones</Link></li>
            <li><Link href="/faq" className="hover:text-pink-primary">Preguntas frecuentes</Link></li>
            <li><Link href="/legal" className="hover:text-pink-primary">Aviso legal</Link></li>
          </ul>
          {s.whatsappNumber && (
            <a
              href={`https://wa.me/${s.whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp directo
            </a>
          )}
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p className="flex items-center gap-1.5">
            © {year} {s.storeName} · Hecho con
            <Heart className="w-3.5 h-3.5 fill-pink-primary stroke-none" />
            en España
          </p>
          <p>
            <Link href="/legal/privacidad" className="hover:text-white">Privacidad</Link>{" "}·{" "}
            <Link href="/legal/terminos" className="hover:text-white">Términos</Link>{" "}·{" "}
            <Link href="/legal/cookies" className="hover:text-white">Cookies</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-pink-primary hover:border-pink-primary transition"
    >
      {children}
    </a>
  )
}
