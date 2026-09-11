# Porting From Astroplate

Astroplate is a reference source, not a mergeable upstream. The repositories have unrelated roots and a direct merge creates broad add/add conflicts.

## Procedure

1. Read `ASTROPLATE.md` for the current reviewed commit and protected local behavior.
2. Fetch upstream in a temporary clone or temporary remote.
3. Compare only commits after the recorded baseline and inspect path-scoped diffs.
4. Identify the owning implementation and any dependent config, schema, script, style, or call sites.
5. Port one cohesive feature at a time. Keep upstream naming and structure unless it conflicts with a stronger local boundary.
6. Document every intentional divergence and update the reviewed baseline.
7. Validate with the narrowest check first, then the complete build and relevant browser flows.

Never replace package manifests, deployment workflows, `astro.config.mjs`, `Base.astro`, content schemas, or homepage code wholesale. Preserve Yarn, Cloudflare, Sentry, LFS, Gallery, optional image dimensions, secondary buttons, share settings, and local content.

For a new comparison:

```sh
git log --oneline <recorded-baseline>..upstream/main
git diff --stat <recorded-baseline>..upstream/main
git diff <recorded-baseline>..upstream/main -- path/to/file
```
