# JellyKuo-Web

Source for [jellykuo.com](https://jellykuo.com), built with Astro 7, Tailwind CSS 4, TypeScript, React islands, Cloudflare Workers, and Sentry.

The project originated from [Astroplate](https://github.com/zeon-studio/astroplate) and now carries substantial local customization. See [ASTROPLATE.md](ASTROPLATE.md) before porting upstream changes.

## Requirements

- Node.js 22 or newer
- Corepack
- Yarn 4.11.0, selected by the `packageManager` field

## Commands

```sh
corepack enable
yarn install --immutable
yarn dev
yarn check
yarn build
```

`yarn dev` watches the theme source, generates the search index, and starts Astro. `yarn build` generates the theme and search data, builds the site, and produces LLM-friendly artifacts.

## Content Visibility

Normal builds exclude draft and future-dated content. Build-time overrides use Astroplate-compatible names:

```sh
yarn build -- --buildDrafts
yarn build -- --buildFuture
yarn build -- --buildDrafts --buildFuture
```

The selected mode applies consistently to routes, pagination, taxonomies, search data, and LLM artifacts.

## Generated Files

- `src/styles/generated-theme.css` is generated from `src/config/theme.json` by `yarn generate-theme` and is committed.
- `.json/search.json` is generated from content by `yarn generate-json` and is ignored.
- `dist/client/llms.txt`, `llms-full.txt`, and per-route Markdown are generated after a production build and are ignored with `dist/`.
- LLM generation is configured under `llms` in `src/config/config.json`.

Do not edit generated files directly. Change their source configuration or content instead.

## Deployment

GitHub Actions contains separate GitHub Pages and Cloudflare Workers workflows. The Cloudflare workflow patches environment-specific site and Sentry settings before building. Preserve those steps when changing build or deployment configuration.

## License and Attribution

The code is released under the [MIT License](LICENSE). The original Astroplate template was designed and developed by [Zeon Studio](https://zeon.studio/). Site content and images may have separate ownership or licensing terms.
