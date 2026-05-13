export function BagIllustration() {
  return (
    <div className="relative mx-auto max-w-md aspect-square">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-[0_20px_40px_rgba(244,114,182,0.35)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="gem-pink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F9A8D4" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="gem-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <linearGradient id="gem-teal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#99F6E4" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
          <radialGradient id="glow-center" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(244,114,182,0.25)" />
            <stop offset="100%" stopColor="rgba(244,114,182,0)" />
          </radialGradient>
          <filter id="soft-blur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <circle cx="200" cy="200" r="160" fill="url(#glow-center)" />

        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="url(#gem-gold)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
          opacity="0.5"
        />

        <polygon
          points="200,60 310,200 200,340 90,200"
          fill="url(#gem-pink)"
          stroke="#D4AF37"
          strokeWidth="2.5"
          rx="8"
        />

        <polygon
          points="200,85 290,200 200,315 110,200"
          fill="none"
          stroke="#FEF9C3"
          strokeWidth="1"
          opacity="0.5"
        />

        <line x1="200" y1="60" x2="200" y2="340" stroke="#FEF9C3" strokeWidth="0.8" opacity="0.3" />
        <line x1="90" y1="200" x2="310" y2="200" stroke="#FEF9C3" strokeWidth="0.8" opacity="0.3" />

        <line x1="200" y1="60" x2="90" y2="200" stroke="#FEF9C3" strokeWidth="0.5" opacity="0.15" />
        <line x1="200" y1="60" x2="310" y2="200" stroke="#FEF9C3" strokeWidth="0.5" opacity="0.15" />

        <polygon
          points="200,60 310,200 200,200"
          fill="rgba(255,255,255,0.15)"
        />

        <circle cx="148" cy="128" r="28" fill="url(#gem-teal)" opacity="0.7" />
        <circle cx="270" cy="290" r="22" fill="url(#gem-gold)" opacity="0.6" />
        <circle cx="280" cy="120" r="16" fill="#F9A8D4" opacity="0.5" />

        <g opacity="0.9">
          <polygon points="200,42 204,54 200,52 196,54" fill="#D4AF37" />
          <polygon points="200,42 204,54 200,52 196,54" fill="#D4AF37" transform="rotate(90 200 42)" />
        </g>
        <g opacity="0.7">
          <polygon points="320,200 324,210 320,208 316,210" fill="#D4AF37" />
          <polygon points="320,200 324,210 320,208 316,210" fill="#D4AF37" transform="rotate(90 320 200)" />
        </g>
        <g opacity="0.6">
          <polygon points="120,310 123,318 120,316 117,318" fill="#F472B6" />
          <polygon points="120,310 123,318 120,316 117,318" fill="#F472B6" transform="rotate(90 120 310)" />
        </g>
        <g opacity="0.5">
          <polygon points="310,100 313,108 310,106 307,108" fill="#14B8A6" />
          <polygon points="310,100 313,108 310,106 307,108" fill="#14B8A6" transform="rotate(90 310 100)" />
        </g>

        <text
          x="200"
          y="207"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="22"
          fontStyle="italic"
          fontWeight="bold"
          fill="url(#gem-gold)"
          letterSpacing="4"
        >
          MARAYA
        </text>

        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="url(#gem-gold)"
          strokeWidth="1"
          opacity="0.25"
        />
      </svg>
    </div>
  )
}
