import type { MetadataRoute } from "next";

// `output: 'export'` requires metadata routes to be explicitly static.
export const dynamic = "force-static";

const SITE_URL = "https://aegis-aniruddha-adaks-projects.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1.0, changeFrequency: "monthly" },
    { path: "/atlas", priority: 0.9, changeFrequency: "monthly" },
    { path: "/risk", priority: 0.9, changeFrequency: "monthly" },
    { path: "/stack", priority: 0.8, changeFrequency: "monthly" },
    { path: "/math", priority: 0.7, changeFrequency: "monthly" },
    { path: "/methodology", priority: 0.7, changeFrequency: "monthly" },
    { path: "/governance", priority: 0.7, changeFrequency: "monthly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
