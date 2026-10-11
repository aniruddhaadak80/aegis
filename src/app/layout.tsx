import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = "https://aegis-aniruddha-adaks-projects.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AEGIS — The Superintelligence Control Stack",
    template: "%s · AEGIS",
  },
  description:
    "An instrument for reasoning about superintelligence risk: a seven-layer taxonomy of AI control techniques, their measured efficacy, the mathematics of defence in depth, and every number sourced to its primary reference.",
  keywords: [
    "AI safety",
    "superintelligence",
    "alignment",
    "probabilistic risk assessment",
    "AI control",
    "mechanistic interpretability",
    "corrigibility",
    "frontier safety frameworks",
  ],
  authors: [{ name: "Aniruddha Adak", url: "https://github.com/aniruddhaadak80" }],
  creator: "Aniruddha Adak",
  publisher: "Aniruddha Adak",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AEGIS — The Superintelligence Control Stack",
    description:
      "Fifty-nine techniques across seven layers of control. The mathematics of defence in depth, modelled honestly. Every number sourced.",
    type: "website",
    siteName: "AEGIS",
    locale: "en_US",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "AEGIS — The Superintelligence Control Stack",
    description:
      "An instrument for reasoning about superintelligence risk, built from the primary literature.",
    creator: "@aniruddhaadak80",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="substrate" aria-hidden />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-4 focus:left-4 focus:bg-ink-3 focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="relative z-1 flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}