import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig, fontProviders } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sharp from "sharp";
import config from "./src/config/config.json";
import theme from "./src/config/theme.json";
import cloudflare from "@astrojs/cloudflare";
import sentry from "@sentry/astro";

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;

// Parse the theme format: "FontName:wght@400;500;600;700".
function parseFontString(fontString) {
  const [name, weightPart] = fontString.split(":");
  let weights = [400];

  if (weightPart) {
    const weightMatch = weightPart.match(/wght@?([\d;]+)/);
    if (weightMatch) {
      weights = weightMatch[1].split(";").map((weight) => Number(weight));
    }
  }

  return { name: name.replace(/\+/g, " "), weights };
}

const fonts = Object.entries(theme.fonts.font_family)
  .filter(([key]) => !key.includes("_type"))
  .map(([key, fontString]) => {
    const { name, weights } = parseFontString(fontString);

    return {
      name,
      cssVariable: `--font-${key}`,
      provider: fontProviders.google(),
      weights,
      display: "swap",
      fallbacks: [theme.fonts.font_family[`${key}_type`] || "sans-serif"],
    };
  });

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  compressHTML: true,
  session: false,
  image: { service: sharp() },
  vite: { plugins: [tailwindcss()] },
  fonts,

  integrations: [
    react(),
    sitemap(),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
    sentry({
      project: config.sentry.project,
      org: config.sentry.org,
      authToken: sentryAuthToken,
      enabled: { client: true, server: false },
      sourcemaps: { disable: !sentryAuthToken },
      telemetry: false,
    }),
  ],

  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
    }),
    shikiConfig: { theme: "one-dark-pro", wrap: true },
    extendDefaultPlugins: true,
  },

  adapter: cloudflare({
    imageService: "compile",
  }),
});
