# Adding New Pages

Astro routes live under `src/pages/`. Use one of the established paths.

## Content-Driven Pages

For primarily textual pages, add Markdown or MDX under `src/content/pages/`. The catch-all route `src/pages/[regular].astro` renders non-draft entries through `Base.astro`.

Frontmatter must satisfy the `pages` schema in `src/content.config.ts`. The minimum shape is:

```yaml
---
title: My Page
description: Page summary
draft: false
---
```

Collection index documents use the `-index.md` convention. Before adding MDX shortcodes, inspect `src/layouts/shortcodes/` and the auto-import list in `astro.config.mjs`.

## Custom Astro Pages

Use a file under `src/pages/` when the page needs custom layout or data loading. Inspect a neighboring route first, wrap the result in `Base.astro`, and reuse existing components and full-width section patterns.

Add navigation entries through `src/config/menu.json`; do not hardcode them in the header. Do not create a custom route that conflicts with `[regular].astro`.
