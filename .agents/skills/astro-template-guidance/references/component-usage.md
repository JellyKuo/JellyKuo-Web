# Component Usage

The component hierarchy is:

- `src/layouts/components/`: reusable UI pieces such as cards, images, galleries, pagination, and theme controls.
- `src/layouts/partials/`: larger page sections such as the header, footer, call to action, and testimonials.
- `src/layouts/shortcodes/`: components available to MDX through Astro auto-imports.
- `src/layouts/helpers/`: interactive React helpers and layout utilities.

Prefer Astro components for static rendering and React only for stateful browser behavior. Existing React islands use explicit `client:load` directives in `Base.astro`; preserve that behavior unless a measured change justifies another hydration strategy.

`ImageMod.astro` deliberately supports optional width or height and derives missing dimensions. `Gallery.astro` depends on that behavior. Do not replace it wholesale with Astroplate's stricter implementation.

The homepage Gallery and `secondaryButton` fields are local features. Preserve them when comparing homepage, call-to-action, or content-schema code with upstream.
