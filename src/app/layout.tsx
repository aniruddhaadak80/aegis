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

/**
 * Structured data. Static-export friendly (a plain JSON-LD script tag, not a
 * runtime fetch), and enough for Google to render a rich result.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "AEGIS",
      url: SITE_URL,
      description:
        "An interactive instrument for reasoning about AI control methods and superintelligence risk.",
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#org` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/atlas?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": `${SITE_URL}/#source`,
      name: "AEGIS — The Superintelligence Control Stack",
      url: SITE_URL,
      description:
        "Seven-layer taxonomy of AI control techniques with a two-stage probabilistic risk assessment engine adapted from nuclear and aerospace practice.",
      programmingLanguage: ["TypeScript", "CSS"],
      runtimePlatform: "Next.js",
      codeRepository: "https://github.com/aniruddhaadak80/aegis",
      license: "https://opensource.org/licenses/MIT",
      author: { "@id": `${SITE_URL}/#org` },
      keywords:
        "AI safety, superintelligence, alignment, probabilistic risk assessment, AI control, interpretability, fault tree",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "AEGIS",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
      sameAs: ["https://github.com/aniruddhaadak80/aegis"],
    },
  ],
};

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

        <script
          type="application/ld+json"
          // JSON.stringify over a literal, never over user data — no injection surface.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}