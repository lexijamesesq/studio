# Studio

Studio is a personal brand agency built as Claude Code skills and agents. This repository holds its reusable plugin. Personal material and saved work stay in the owner's Obsidian vault and are never committed here.

## Status

The plugin has no skills yet. The first service, an article content machine, is being designed; its skills land in `plugins/studio/` as they are built and validated.

## Development

Node 22+, npm, TypeScript, Biome, and Vitest. Run `npm ci`, then `npm run check` and `npm test`. Build and typecheck scripts return when the package has code.

## Layout

- `plugins/studio/`: the plugin (manifest only for now)
- `.claude-plugin/marketplace.json`: the marketplace entry
- CI, Margot review, and repository hygiene follow the shared estate baseline
