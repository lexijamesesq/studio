---
tags:
  - type/config
description: "Studio plugin configuration sample. Copy this note into the consumer's vault project as studio.config.md and replace every placeholder in the frontmatter with a real vault path; the skills read these keys from the frontmatter with Read."
creator.words_archive: "Projects/<project>/<Author> — Original Words and Sources.md"
creator.convictions:
  - "Work/<leadership note A>.md"
  - "Work/<leadership note B>.md"
  - "Projects/<career>/Knowledge/voice-and-identity.md"
creator.builds:
  - "~/Repos/<build repository>"
  - "<vault path to a methodology note>.md"
creator.topic_profile: "Projects/<project>/Knowledge/<domain definition>.md"
creator.voice_foundation: "Projects/<project>/Knowledge/Voice foundation.md"
creator.voice_preferences: "Projects/<project>/Exports/<PRD>.md"
creator.voice_preferences_section: "### <exact heading of the style and voice section>"
sources.config: "Projects/<project>/Content Machine/Workspace/Operations/sources.md"
workspace.vault_root: "~/<path to the vault on disk>"
workspace.articles_root: "Projects/<project>/Content Machine/Workspace/Articles"
workspace.ideas_dir: "Projects/<project>/Content Machine/Workspace/Discovery/Ideas"
workspace.ideas_dashboard: "Projects/<project>/Content Machine/Workspace/Discovery/Ideas.md"
workspace.discovery_dir: "Projects/<project>/Content Machine/Workspace/Discovery"
learning.lessons: "Projects/<project>/Content Machine/Workspace/Lessons.md"
---

# Studio configuration (sample)

Copy this note into the consumer's vault project as `studio.config.md` and
replace every placeholder in the frontmatter with a real vault path. Keys stay
in the frontmatter: the skills open this note with `Read` at
`{workspace_root}/Projects/Studio/studio.config.md` and take the keys as written
there; a dotted key such as `creator.convictions` is a literal key name, not a
nested path.

- `creator.words_archive` — the author's verbatim words; skills search it by
  terms, never read it whole.
- `creator.convictions` — stated beliefs and leadership writing, read whole in
  the author's words; note any session-authored synthesis so `discover` can
  flag candidates resting on it.
- `creator.builds` — the author's builds, read at purpose level for the builder
  lens: local repositories (read from disk, no network) and methodology notes
  in the vault.
- `creator.topic_profile` — the aligned range of topics (throughline, lenses,
  selection bar); the only definition of "relevant" `assemble-field` and
  `discover` use.
- `creator.voice_foundation` — the mined, source-checked voice guide.
  `creator.voice_preferences` and `creator.voice_preferences_section` — the
  note and the exact heading holding established style preferences.
- `sources.config` — the tended list of public sources, by kind, with each
  source's access rules; the only place those rules live.
- `workspace.vault_root` — the vault's folder on disk (`~` allowed), the only
  absolute path. It must equal the `workspace_root` of the global Claude Code
  configuration, which is how a skill locates this note before it has read it;
  every other key is vault-relative, and `Read`, `Write`, `Glob` and shell
  steps (`grep`, a file write) join this root to it. Skills write under this
  root only.
- `workspace.*` (the rest) — where idea records, the dashboard, fields and run
  records, and article folders live.
- `learning.lessons` — the lessons store `learn` writes and `draft` (first
  draft and revise), the council, and `discover` read; discovery verdicts
  live in the idea records, not here.

Nothing personal belongs in this repository; the real `studio.config.md` lives
in the vault.
