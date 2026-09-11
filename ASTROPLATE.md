# Astroplate Upstream Reference

This site originated from [Astroplate](https://github.com/zeon-studio/astroplate), but the repositories do not share Git history. Treat Astroplate as a vendor reference: port changes selectively instead of merging its branch.

## Current Baseline

- Repository: `https://github.com/zeon-studio/astroplate.git`
- Reviewed commit: `501646d0fede2471105ef0cf3c2a154cbb814c4a`
- Reviewed date: 2026-07-28
- Local package manager: Yarn 4
- Local deployment: Cloudflare Workers, with GitHub Pages as an additional target

## Ported Features

| Feature                     | Upstream source | Local notes                                                               |
| --------------------------- | --------------- | ------------------------------------------------------------------------- |
| LLM artifacts               | `b300715`       | Adapted for `dist/client`, local config, and manifest-based cleanup       |
| Draft/future builds         | `f59e7e5`       | Same CLI names; wrapper propagates flags across Astro build workers       |
| Built-in Fonts API          | `c04ffb8`       | Preserves Cloudflare and Sentry configuration                             |
| Generated theme CSS         | `c0a555a`       | Keeps the local Bootstrap-grid plugin                                     |
| `astro-swiper` testimonials | `440ba85`       | Uses current compatible package versions                                  |
| External navigation links   | `75732ed`       | Applied to mobile and desktop buttons                                     |
| Agent guidance              | `8c4a6dc`       | Rewritten for this repository rather than copied as generic template text |
| ESM dark-mode script        | `c648d5f`       | Uses explicit `node:` imports                                             |
| YouTube shortcode cleanup   | `fafc6d3`       | Preserves lazy custom-element loading                                     |
| Date coercion               | `a57c1f1`       | Preserves local schema extensions                                         |
| Sticky footer               | `d05a98a`       | Preserves local layout ordering and hydration                             |

## Protected Local Behavior

Do not replace these areas wholesale with upstream versions:

- Yarn configuration and `yarn.lock`
- Cloudflare adapter, Wrangler configuration, and deployment workflow
- Sentry client/server configuration and build-time config patching
- Homepage gallery and LightGallery integration
- Optional dimensions in `ImageMod.astro`
- Homepage and call-to-action `secondaryButton` fields
- Configurable share controls
- Local Google Tag Manager implementation
- Local content, routes, assets, and navigation
- `client:load` behavior for the announcement and search modal
- The local Bootstrap-grid Tailwind plugin

## Future Porting Workflow

1. Fetch Astroplate into a temporary clone or a local `upstream` remote. Do not merge unrelated histories.
2. Compare the recorded baseline to the new upstream head:

   ```sh
   git log --oneline 501646d..upstream/main
   git diff --stat 501646d..upstream/main
   git diff 501646d..upstream/main -- path/to/relevant/file
   ```

3. Review each feature at its owning file or introducing commit.
4. Port one cohesive feature at a time and preserve the protected behavior above.
5. Record the new reviewed commit and any intentional deviations in this file.
6. Run `yarn check`, all build visibility modes, and browser regression checks before accepting the port.

Generated files have distinct ownership:

- `src/styles/generated-theme.css` is generated from `src/config/theme.json` and is tracked.
- `.json/`, `dist/`, LLM artifacts, and optimized font assets are generated and ignored.
