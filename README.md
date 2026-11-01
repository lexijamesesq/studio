# Studio

Studio is a personal brand agency built as Claude Code skills and agents. This repository holds its reusable plugin. Personal material and saved work stay in the owner's Obsidian vault and are never committed here.

## Status

The first service, the Content Machine, ships as seven skills in `plugins/studio/skills/`: `discover` and `assemble-field` (bring the author a handful of article candidates from her own convictions met by current public findings), `research`, `interview`, `draft`, `critique`, and `learn` (turn a chosen candidate into an article through her words). The plugin is pre-1.0; skills are proven in place and proven changes ship as releases.

## Development

Node 22+, npm, TypeScript, Biome, and Vitest. Run `npm ci`, then `npm run check` and `npm test`. A consumer copies `plugins/studio/studio.config.sample.md` into its vault as `studio.config.md` and fills real paths; the skills read those keys from that note's frontmatter.

## Layout

- `plugins/studio/skills/`: the skills, one `SKILL.md` each
- `plugins/studio/reference/data-contracts.md`: the shapes the skills read and write
- `plugins/studio/studio.config.sample.md`: every config key, with placeholders
- `.claude-plugin/marketplace.json`: the marketplace entry
- CI, Margot review, plugin releases, and repository hygiene follow the shared estate baseline
