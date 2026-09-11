# Styling and Theming

Tailwind CSS 4 is configured from `src/styles/main.css`. The repository retains a local Bootstrap-grid plugin and uses generated theme tokens.

## Theme Workflow

1. Edit colors, font families, or type scale in `src/config/theme.json`.
2. Run `yarn generate-theme`, or use `yarn dev` for watch mode.
3. Commit the resulting `src/styles/generated-theme.css` with the source change.

Do not edit generated theme CSS manually. Font definitions in `astro.config.mjs` use Astro's built-in Google font provider and `Base.astro` emits the configured font assets.

Dark mode uses the `.dark` class and the custom Tailwind variant in `main.css`. Prefer named theme utilities such as `text-primary` and `dark:bg-darkmode-body` over hard-coded colors.

The `remove-darkmode` script is destructive and should only be run when intentionally removing the feature.
