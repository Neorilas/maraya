import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Dancing_Script, Nunito, Permanent_Marker } from "next/font/google";
import "./globals.css";

const GA_ID = "G-VYM9D2NE9G";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Tipografía "BY MARAYA" del logo — chunky brush handwritten
const marker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s · Maraya Store",
    default: "Maraya Store — Bolsos artesanales únicos",
  },
  description:
    "Bolsos artesanales hechos con mimo. Descubre la colección Maraya: piezas únicas en piel y tejido, diseños que destacan.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Maraya Store",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${dancing.variable} ${nunito.variable} ${marker.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </html>
  );
}
