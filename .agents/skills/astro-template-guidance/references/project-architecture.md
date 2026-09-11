# Project Architecture

This is an Astro 7 static site using Tailwind CSS 4, content collections, React islands, compile-time image optimization, Cloudflare Workers deployment, and Sentry. Development uses Astro's Node server and Sharp image service; build and preview retain the Cloudflare adapter.

## Data Flow

1. Markdown and MDX under `src/content/` are validated by `src/content.config.ts`.
2. `src/lib/contentParser.astro` applies draft and future-date visibility.
3. Routes under `src/pages/` build lists, taxonomies, and individual pages.
4. `src/layouts/Base.astro` provides metadata, fonts, navigation, search, and footer layout.
5. `scripts/build.js` generates theme/search inputs, runs Astro, then creates LLM artifacts.

## Ownership Boundaries

- Edit content and JSON source configuration directly.
- Edit `src/styles/main.css` and hand-authored styles, but never hand-edit `src/styles/generated-theme.css`.
- Keep `.json/` and `dist/` generated and untracked.
- Preserve Cloudflare, Sentry, Git LFS, Gallery, secondary-button, sharing, and image-sizing behavior during upstream work.

Read `ASTROPLATE.md` before changing files derived from Astroplate.
