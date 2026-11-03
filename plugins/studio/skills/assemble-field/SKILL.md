---
name: assemble-field
description: Assemble a discovery run's field — recent public findings about people, classified by kind — into the discovery folder as plain text for the finder to read locally. Use before /studio:discover or when asked to "pull the field."
argument-hint: [optional window]
context: fork
disable-model-invocation: false
allowed-tools:
  - Read
  - Bash(date:*)
  - Bash(ls:*)
  - WebFetch
  - WebSearch
  - Write(Projects/*/Content Machine/**)
  - Glob
---

# /studio:assemble-field

Pull the window's public items into `workspace.discovery_dir/<date>-<n>/` as plain text, each tagged by kind, so the finder reads the field locally and never fetches. Public web only: never fetch anything private or behind auth, and never carry creator material into a query.

## Inputs / outputs

Read `sources.config` (feeds by kind, with access rules) and `creator.topic_profile` (the aligned range — the only definition of relevant). Write to `workspace.discovery_dir/<YYYY-MM-DD>-<n>/`, where `<n>` is one more than the number of existing `<YYYY-MM-DD>-*` folders for that date (count them with `ls -d` through Bash, since `Glob` lists files, not folders); on disk that folder is `workspace.vault_root` + that vault path (`~` expands to the home directory). Resolve every key from the vault config, read with `Read` at `{workspace_root}/Projects/Studio/studio.config.md`, where `{workspace_root}` is the vault root from the global Claude Code configuration block (`workspace.vault_root` in the config repeats it for shell steps). Keys are in its frontmatter, each a literal dotted name. Join every vault-relative key or folder named here to that root before `Read`, `Write` or `Glob`; a key that is absent stops the skill and is named in the report. Write only under that root: never create or change a file anywhere else on disk. Read nothing else from the vault.

## Classify by kind

Tag every item `finding` (a survey/study/dataset about people), `case` (a documented real situation or decision), or `commentary` (opinion/essay about the field). The finder's provoking material is `finding`/`case` only; `commentary` is support. The index and the report state how many provoking items the window holds; a window of mostly commentary is thin — say so, do not pad it.

## Steps

1. Resolve the window (recency plus relevancy against `creator.topic_profile`; default ~7–12 days; widen when thin).
2. Load `sources.config` and honor each source's access rules (rate limits, summary/teaser-only feeds needing a page fetch, user-agent requirements, feeds without RSS, blocked paths). `sources.config` is the single source of those rules — never hardcode them here; they drift.
3. Fetch each live feed's items in the window verbatim: title, URL, publish date, body. Fetched bytes land on disk without passing through the model — never `WebFetch`, which summarizes. The plugin does not yet ship the fetch-and-write code; until it does, the run writes that code itself and she approves each shell call (no shell is pre-approved here). Paywalled posts (e.g. "This post is for paid subscribers") — keep only the present text and mark the truncation.
4. Each item is one note at `<date>-<n>/<kind>/<slug>.md`, written by that code from the fetched text, never re-emitted through the model — starting with its URL and date, then the readable text (nav/boilerplate/utm stripped), with a `kind:` tag at the top. The stored text is a fetched extraction, not canonical source — quotes drawn from it are verified against the live source at traceability. Write `index.md` with `Write`: every item (source, title, URL, date, char count, kind) and coverage (feeds read; dark/blocked/deferred).
5. Report counts by kind and whether the window holds enough finding/case material to be worth a discovery pass.

## Stop

- A source needs auth or carries private material → never fetch it.
- A feed 403s or user-agent-blocks → skip; note in coverage.
- A rate limit applies → respect it; defer, do not hammer.
- A feed is dark or stale → skip; flag it as a retire candidate for `sources.config`.
- The window is mostly commentary → say so; widen it; never pad.

## Not this skill

Judging taste or ranking (the finder's job — this tags by kind only); fetching private or authed content, or her builds (the finder reads builds locally); tending the source list autonomously; running unattended.
