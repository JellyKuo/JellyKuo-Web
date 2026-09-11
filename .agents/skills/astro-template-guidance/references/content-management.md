# Content Management

Content lives under `src/content/` and is validated by `src/content.config.ts`.

## Conventions

- Blog posts: `src/content/blog/`
- Authors: `src/content/authors/`
- General pages: `src/content/pages/`
- Singleton collection documents: `-index.md` or named section files
- Images: use absolute paths rooted at `public`, such as `/images/example.jpg`
- Dates: use ISO timestamps; schemas coerce valid strings to `Date`

Read the actual collection schema before adding frontmatter. Local schemas include optional homepage bullet points and secondary buttons that do not exist upstream.

## Visibility

Normal builds exclude drafts and future-dated entries. The supported overrides are:

```sh
yarn build -- --buildDrafts
yarn build -- --buildFuture
yarn build -- --buildDrafts --buildFuture
```

The same flags control static routes, taxonomy data, pagination, search JSON, and generated LLM artifacts. Keep these outputs synchronized when changing visibility logic.
