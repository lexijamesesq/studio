# alexisbussa.com prototypes

Three throwaway homepage directions for [alexisbussa.com](https://alexisbussa.com).
Same status, same pieces, same projects. This is a comparison round, not the final site.

## Run locally

From `sites/alexisbussa`:

```sh
npm ci
npm run dev
```

`npm run build` writes a static site to `dist/`. `npm run preview` serves that build.

Routes:

- `/` — index, with a one-line rationale for each direction
- `/a` — editorial. Text leads. The picture stays small, beside the words.
- `/b` — still life. One large stand-in, and a single status sentence under it.
- `/c` — working log. A dated log. The picture sits in it like an object kept current.

There is no deploy script. `wrangler.jsonc` only points Workers static assets at `./dist` for a later host. It sets no account and no routes. Do not deploy this prototype, and do not create Cloudflare resources from it.

## Status file

Agents update `src/data/now.json`. The shape is `src/data/now.schema.json`, and `src/lib/now.ts` checks it at build time. All three directions read this file.

- `intro` — one dry line about who she is. A line may hold more than one sentence.
- `activity` — what she is in the middle of.
- `where` — where that is. Unconfirmed places keep a `[Sample]` prefix.
- `lastSeenBuilding` — the full "last seen building" sentence. Direction B uses it under the picture.
- `visual.src` — a path from `public/` (`/stand-in.svg`) or an absolute URL. Replace the file and this path together.
- `visual.alt` — what the picture actually shows.
- `updated` — `YYYY-MM-DD` the file last changed.
- `featuredArticle` — id of a file in `src/content/articles`, without `.md`.

`$schema` is for editors. The pages do not render it.

## Pieces and projects

`src/content/articles/*.md` is a pointer to a piece that lives on Medium. The page uses frontmatter only:

- `title`
- `date` — `YYYY-MM-DD`
- `hook` — one line
- `mediumUrl` — absolute URL
- `image` — optional path or URL. When it is set, the directions show it as a plain picture under the hook. The samples leave it unset.

`src/content/projects/*.md`:

- `title`
- `status` — a short label such as `In progress` or `Ongoing`
- `summary` — one line
- body — a short markdown note under the frontmatter. The HTML comment above the note turns off the repository heading rule for a paragraph that is not a title. Leave the comment. The pages do not render it.

Articles sort by date, newest first. Projects sort by filename, so a numeric prefix (`10-`, `20-`) sets the order.

Anything that is not a confirmed fact is prefixed with `[Sample]`.
