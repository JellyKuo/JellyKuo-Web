# Script Usage

Use the Yarn 4 scripts in `package.json`; direct Astro commands can bypass required generated inputs.

- `yarn dev`: watches `theme.json`, generates search JSON, and starts Astro with the Node/Sharp development pipeline.
- `yarn build`: generates theme/search data, builds Astro with forwarded visibility flags, and generates LLM artifacts.
- `yarn check`: generates required inputs and runs Astro diagnostics.
- `yarn generate-theme`: regenerates tracked `src/styles/generated-theme.css`.
- `yarn generate-json`: regenerates ignored search data under `.json/`.
- `yarn generate-llms`: regenerates LLM files from an existing `dist/` build.
- `yarn remove-darkmode`: destructively removes dark-mode support and formats source files.

The Cloudflare adapter is intentionally disabled for `astro dev` so local images use the same Sharp transformations as production builds. The browser-only announcement and search islands skip unnecessary server rendering and renderer probes. Use `yarn build && yarn preview` when validating the generated Cloudflare Worker.

Do not run the destructive dark-mode command merely to test it. Use a disposable worktree.

Build visibility flags are `--buildDrafts` and `--buildFuture`. `scripts/build.js` forwards them to Astro and mirrors them into build-time environment values because Astro build workers do not reliably retain arbitrary CLI arguments.
