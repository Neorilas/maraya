/** SVG inline para iconos de marca (lucide v1 no los incluye por copyright). */

export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-7H7.9V12h2.54V9.85c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.88h-2.33v7A10 10 0 0 0 22 12z" />
    </svg>
  )
}

export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.74-.86-2.01-.96-.27-.1-.46-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.63.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.58-.48-.5-.66-.51l-.56-.01c-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.43s1.05 2.83 1.2 3.02c.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.66.62.7.22 1.33.19 1.84.12.56-.08 1.74-.71 1.99-1.4.24-.69.24-1.28.17-1.4-.07-.12-.27-.2-.56-.34zM12.04 2C6.5 2 2 6.5 2 12.04c0 1.78.47 3.45 1.27 4.9L2 22l5.2-1.36a10 10 0 0 0 4.84 1.24h.01c5.53 0 10.03-4.5 10.04-10.04C22.08 6.5 17.58 2 12.04 2zm0 18.07h-.01c-1.49 0-2.94-.4-4.21-1.16l-.3-.18-3.13.82.83-3.05-.2-.32A8.05 8.05 0 0 1 4.04 12c0-4.43 3.6-8.04 8.04-8.04A8.05 8.05 0 0 1 20.12 12c0 4.43-3.6 8.04-8.08 8.07z" />
    </svg>
  )
}

export function TwitterXIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.6 6.32a4.83 4.83 0 0 1-3-1.1 4.85 4.85 0 0 1-1.7-3.22h-3.32v13.27a2.86 2.86 0 1 1-2.05-2.74V8.92a6.18 6.18 0 1 0 5.37 6.13V9.4a8.16 8.16 0 0 0 4.7 1.49V7.55c-.01-.4-.01-.82 0-1.23z" />
    </svg>
  )
}
