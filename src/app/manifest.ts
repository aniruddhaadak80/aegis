import type { MetadataRoute } from "next";

// `output: 'export'` requires metadata routes to be explicitly static.
export const dynamic = "force-static";

const NAME = "AEGIS — The Superintelligence Control Stack";
const DESCRIPTION =
  "An interactive instrument for reasoning about AI control methods: 59 techniques across seven layers of defence, a two-stage probabilistic risk assessment engine adapted from nuclear and aerospace practice, and every number sourced to primary literature.";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: NAME,
    short_name: "AEGIS",
    description: DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#08090a",
    theme_color: "#08090a",
    categories: ["education", "productivity", "utilities"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "PRA Engine", url: "/risk", description: "The two-stage fault tree" },
      { name: "Method Atlas", url: "/atlas", description: "All 59 control techniques" },
      { name: "The Stack", url: "/stack", description: "Seven layers of control" },
    ],
  };
}
