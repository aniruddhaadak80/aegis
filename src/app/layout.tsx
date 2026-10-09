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

export const metadata: Metadata = {
  metadataBase: new URL("https://aegis-control-stack.vercel.app"),
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
  authors: [{ name: "AEGIS" }],
  openGraph: {
    title: "AEGIS — The Superintelligence Control Stack",
    description:
      "Seven layers of control. Forty techniques. The mathematics of defence in depth. Every number sourced.",
    type: "website",
    siteName: "AEGIS",
  },
  twitter: {
    card: "summary_large_image",
    title: "AEGIS — The Superintelligence Control Stack",
    description:
      "An instrument for reasoning about superintelligence risk, built from the primary literature.",
  },
  robots: { index: true, follow: true },
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