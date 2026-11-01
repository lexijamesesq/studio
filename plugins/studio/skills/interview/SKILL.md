---
name: interview
description: Produce the author's own thinking on a chosen recommendation as the verbatim source a draft is built from — mining what she has already said first, then asking only the genuine gaps. Use when starting an article from a chosen recommendation, or when asked to "interview me on [idea]".
argument-hint: [recommendation or idea name]
disable-model-invocation: false
allowed-tools:
  - Read
  - Bash(date:*)
  - Bash(grep:*)
  - mcp__obsidian__read_note
  - mcp__obsidian__read_multiple_notes
  - mcp__obsidian__read_note_lines
  - mcp__obsidian__search_notes
  - mcp__obsidian__get_frontmatter
  - mcp__obsidian__list_directory
  - mcp__obsidian__write_note
  - mcp__obsidian__patch_note
  - mcp__obsidian__update_frontmatter
---

# /studio:interview

Mine what she has already said before asking anything, then ask only the genuine gaps. Her words are the only author source; never present anything else as her view; a missing position is a question, never filled in.

Two entries: **first interview** (no article folder yet, or no `Interview.md`) and **re-entry** (the folder exists and `Current.md` `open-questions` holds `question` entries the council or the writer routed to her). On re-entry skip mining: ask only those keyed questions, one at a time; append her answers verbatim to `Interview.md` under a dated heading keyed to each question; mark each entry in `open-questions` `<key> — resolved — <where in Interview.md>`; move what she answered into the brief's Stated section; set the next action to `revise` when `Review.md` exists, else `draft`. Never rewrite earlier answers.

## Inputs / outputs

Read: the chosen idea record; the article folder's `Current.md`, `Interview.md`, and `Position brief.md` if they exist; `creator.convictions`; `creator.voice_foundation`; `creator.words_archive` (search it by the claim's terms with `grep -n` through Bash on the disk path `workspace.vault_root` + that key, `~` expanded, then `read_note_lines` around each hit — never read it whole; if `grep` errors, stop and name the path rather than mine partially). Write `Position brief.md`, `Interview.md`, and `Current.md` (create on first write; fields per `${CLAUDE_PLUGIN_ROOT}/reference/data-contracts.md` §2, with `form` and `lens` copied from the idea record) to `workspace.articles_root/<stable-name>/`, where `<stable-name>` is the idea record's filename slug. Resolve every key from the vault config at `Projects/Studio/studio.config.md` — keys are in frontmatter, read with `get_frontmatter`; a key that is absent stops the skill and is named to her. Read nothing else: not another article folder, not the lessons store, not a repository.

## Steps

1. Resolve the recommendation from `$ARGUMENTS` to an idea record in `workspace.ideas_dir` (`list_directory`); if empty or ambiguous, list the candidates and ask her to point at one.
2. Mine: write `Position brief.md` in three parts —
   - **Stated:** her verbatim lines bearing on the claim, each with its source. Never ask about these again.
   - **Articulated for her:** any discovery- or session-authored phrasing of the claim, marked not-yet-hers. She owns, rewrites, or rejects each.
   - **Gaps:** what the article needs that no source holds — a lived particular; the argument (her thesis, the opponent she is arguing against and her rebuttal to it, the mechanism); her ownership of any not-her phrasing; the reader and the resistance she will meet.
3. Ask only the gaps, one question at a time, following her answers for specific experiences, examples, judgments:
   - Plain, answerable from her own experience. If a question makes her decode your abstraction, rewrite it.
   - Never a generic opener ("what have you wanted to write about," "describe your voice," "why is this interesting").
   - Grounded in what she has already said.
   - Never supply or imply her position.
4. Stop when either is true: there is enough concrete substance to build the piece; or her answers stay abstract after one round of follow-ups — then stop and say exactly what is thin. Do not draft from your own reasoning.
5. Write `Interview.md` (her answers verbatim, segmented; on re-entry, appended), update `Position brief.md` (answered gaps move to Stated), and set the next step in `Current.md`.

## Self-check before asking

Kill any question that is generic, makes her decode your frame, supplies a position, or asks what the Position brief shows she already answered.

## Lived specifics are employer-safe

She chooses the form: a pattern across situations, a de-identified incident with its particulars changed, or none (then the piece is research synthesis, not narrative). Never an employer name or an internal narrative.

## Not this skill

Choosing the topic (she points); drafting; critiquing; publishing; reading the words archive whole; presenting any composed line as her view; re-asking anything the brief or `Interview.md` already holds; rewriting an earlier answer.
