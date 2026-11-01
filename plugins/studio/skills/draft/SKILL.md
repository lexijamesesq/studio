---
name: draft
description: Produce the first draft of a Content Machine article from the author's interview transcript, in her voice, for her review. Use after /studio:interview, or when asked to "draft [idea]".
argument-hint: [article folder or idea name]
context: fork
disable-model-invocation: false
allowed-tools:
  - Read
  - Bash(date:*)
  - mcp__obsidian__read_note
  - mcp__obsidian__read_multiple_notes
  - mcp__obsidian__write_note
  - mcp__obsidian__patch_note
  - mcp__obsidian__update_frontmatter
  - mcp__obsidian__get_frontmatter
  - mcp__obsidian__list_directory
  - mcp__obsidian__get_note_outline
  - mcp__obsidian__read_note_lines
---

# /studio:draft

Produce one first draft from the interview transcript, in the author's voice, for her to react to. The transcript is the only source of substance. Do not judge whether it is good enough to publish — that is hers.

## Inputs / outputs

Read from the article folder (under `workspace.articles_root`; find it with `list_directory` by the idea's stable-name): `Position brief.md`, `Interview.md`, `Research.md` (if present). Also `creator.voice_foundation`; `creator.voice_preferences` (the note at that key, section `creator.voice_preferences_section`); `learning.lessons` (derived lessons, if any). Resolve every key from the vault config at `Projects/Studio/studio.config.md` — keys are in frontmatter, read with `get_frontmatter`. Write `Draft-1.md` to the article folder. Never write personal content into the repo.

## Steps

1. Load the inputs. The Position brief supplies the research foundation (its evidence section), author-source context, and the check for whether the transcript adopts any session-authored line — never article substance. Substance comes only from the transcript.
2. Check the transcript holds the spine: the claim, a lived particular, her position, the opponent and her rebuttal to it, the mechanism, the reader. If any load-bearing element is missing, stop, return to the interview, and name what's missing. Do not fill it.
3. Draft:
   - Every claim, judgment, thesis, opponent, and scene comes from the transcript. Never write a position she did not state. Mark a missing element `[NEEDS HER]`; if the spine is missing, stop (step 2).
   - Build an argument; do not restate the interview in order. Open earned (not "X isn't about X"). Develop the mechanism. Voice the opponent's counterargument and answer it. Make the strongest claim the hinge. State the thesis once. Keep the grammatical subject stable. Keep her sharpest lines verbatim.
   - Compose only the hook, the closing, and connective/opponent framing.
   - Apply the voice and register rules from `creator.voice_preferences` and `creator.voice_foundation` — the single source; do not restate them here.
4. Self-check, fix before presenting:
   - Cut any claim, judgment, or characterization not in the transcript — including unanchored "most"/comparative/proportion claims — or mark it `[NEEDS HER]`.
   - Confirm: builds an argument, not a restatement; confronts the opponent's counterargument, not just warns; thesis stated once; strongest claim is the hinge; reader placed at a specific moment; no manufactured aphorism.
5. Write `Draft-1.md`. Note which parts are her transcript vs composed prose, any `[NEEDS HER]` gaps, and the lines least certain to be her voice. Update `Current.md` per `${CLAUDE_PLUGIN_ROOT}/reference/data-contracts.md` §2 (stage `draft`, `draft-file`, open questions, next action).

## Stop

- Transcript lacks the substance to carry the piece → stop; return to interview; name the gap.
- A needed thesis/opponent/position is not in the transcript → mark `[NEEDS HER]`, or stop if it is the spine; never invent it.
- Config key unresolved → report it and exit.

## Not this skill

Interviewing; critiquing or scoring; judging publish-readiness; publishing; writing personal content to the repo; presenting composed prose as her view.
