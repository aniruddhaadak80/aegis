import type { MetadataRoute } from "next";

// `output: 'export'` requires metadata routes to be explicitly static.
export const dynamic = "force-static";

const SITE_URL = "https://aegis-aniruddha-adaks-projects.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/opengraph-image", "/icon", "/apple-icon", "/manifest"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
