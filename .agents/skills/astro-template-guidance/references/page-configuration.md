# Page and Site Configuration

Configuration lives in `src/config/`:

- `config.json`: site metadata, feature switches, Sentry settings, sharing, and LLM output.
- `menu.json`: header and footer navigation.
- `social.json`: social profile links.
- `theme.json`: source of generated color, font, and type-scale tokens.

Deployment workflows patch environment-specific values in `config.json`; preserve every existing key when adding upstream options. Secrets must remain in deployment secrets or environment variables.

External HTTP(S) navigation buttons open in a new tab with `noopener`. Internal buttons remain in the same tab.

The `llms` section controls `llms.txt`, `llms-full.txt`, per-route Markdown, and route include/exclude patterns. Generated files belong under the built client directory and must not be edited manually.
