"use client"

import { useState } from "react"
import { Copy, Check, Link as LinkIcon } from "lucide-react"
import {
  WhatsAppIcon,
  FacebookIcon,
  TwitterXIcon,
  InstagramIcon,
} from "@/components/store/SocialIcons"

type ShareTarget = {
  name: string
  icon: React.ReactNode
  color: string
  /** Devuelve la URL a abrir o `null` si la acción es "copiar enlace". */
  buildUrl: ((productUrl: string, productName: string) => string) | null
}

const TARGETS: ShareTarget[] = [
  {
    name: "WhatsApp",
    icon: <WhatsAppIcon className="w-4 h-4" />,
    color: "bg-[#25D366] hover:bg-[#1ebe5a]",
    buildUrl: (u, n) =>
      `https://wa.me/?text=${encodeURIComponent(
        `¡Mira este bolso de Maraya! 👜 ${n} ${u}`,
      )}`,
  },
  {
    name: "Facebook",
    icon: <FacebookIcon className="w-4 h-4" />,
    color: "bg-[#1877F2] hover:bg-[#155fc4]",
    buildUrl: (u) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  {
    name: "X / Twitter",
    icon: <TwitterXIcon className="w-4 h-4" />,
    color: "bg-text-dark hover:bg-black",
    buildUrl: (u, n) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Mirad este bolso de @marayastore 👜 ${n}`,
      )}&url=${encodeURIComponent(u)}`,
  },
  {
    name: "Instagram",
    icon: <InstagramIcon className="w-4 h-4" />,
    color: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] hover:opacity-90",
    buildUrl: null, // Instagram no acepta share URL → copiar enlace
  },
]

export function ShareButtons({
  productName,
  productUrl,
}: {
  productName: string
  productUrl: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      prompt("Copia este enlace:", productUrl)
    }
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-text-mid mb-2">
        Compartir
      </p>
      <div className="flex flex-wrap gap-2">
        {TARGETS.map((t) => {
          if (!t.buildUrl) {
            return (
              <button
                key={t.name}
                type="button"
                onClick={copy}
                aria-label={`Compartir en ${t.name} (copia el enlace)`}
                className={`w-9 h-9 rounded-full text-white flex items-center justify-center transition ${t.color}`}
                title={`Compartir en ${t.name} (copia el enlace para pegarlo)`}
              >
                {t.icon}
              </button>
            )
          }
          return (
            <a
              key={t.name}
              href={t.buildUrl(productUrl, productName)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Compartir en ${t.name}`}
              className={`w-9 h-9 rounded-full text-white flex items-center justify-center transition ${t.color}`}
              title={t.name}
            >
              {t.icon}
            </a>
          )
        })}
        <button
          type="button"
          onClick={copy}
          aria-label="Copiar enlace"
          className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-pink-light hover:bg-pink-primary hover:text-white text-pink-deep text-xs font-bold uppercase tracking-wider transition"
          title="Copiar enlace al portapapeles"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copiado
            </>
          ) : (
            <>
              <LinkIcon className="w-3.5 h-3.5" />
              Copiar
            </>
          )}
        </button>
      </div>
    </div>
  )
}
