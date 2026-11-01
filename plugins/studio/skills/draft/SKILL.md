---
name: draft
description: Produce the first draft of a Content Machine article from the author's interview transcript, in her voice — or, in revise mode, repair the current draft against the council's Review.md while preserving what works. Use after /studio:interview ("draft [idea]") or after a council round ("revise [idea]").
argument-hint: [article folder or idea name, optionally revise]
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

Produce one first draft from the interview transcript, in the author's voice, for the council and then her. The transcript is the only source of substance. Do not judge whether it is good enough to publish — that is hers. With `revise` in `$ARGUMENTS`, or when `Review.md` exists and is not council-ready, run **Revise mode** instead (below).

## Inputs / outputs

Read from the article folder (under `workspace.articles_root`; find it with `list_directory` by the idea's stable-name): `Position brief.md`, `Interview.md`, `Research.md` (if present). Also `creator.voice_foundation`; `creator.voice_preferences` (the note at that key, section `creator.voice_preferences_section`); `learning.lessons` (every `active` lesson whose scope covers this piece applies — explicit, confirmed, and provisional alike; a corrected one does not). Resolve every key from the vault config at `Projects/Studio/studio.config.md` — keys are in frontmatter, read with `get_frontmatter`; a key that is absent stops the skill and is named in the report. Read nothing else: not another article folder, not the idea records, not her convictions, not a repository. Write `Draft-1.md` and `Draft-current.md` (identical at first) to the article folder; in revise mode also read `Review.md` and `Draft-current.md`, and write only `Draft-current.md`. Never write personal content into the repo.

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
5. Write `Draft-1.md`: the draft, then an **Alternatives** section with two other hooks and two other closings (composed; the one choice she makes at a glance), then notes — which parts are her transcript vs composed prose, any `[NEEDS HER]` gaps, the lines least certain to be her voice. Copy the draft (without the alternatives and notes) to `Draft-current.md`. `Draft-1.md` is never edited again. Update `Current.md` per `${CLAUDE_PLUGIN_ROOT}/reference/data-contracts.md` §2 (stage `draft`, `draft-file: Draft-current.md`, open questions, next action: council).

## Revise mode

The council diagnosed; you choose the repair. Read `Review.md`'s latest round and `Draft-current.md`.

1. Take the findings marked **necessary** first, then optional ones you judge worth it. For each: repair it in the text in your own way — the council named the problem, not the fix — and preserve everything that already works; a repair that flattens her voice to satisfy a lens is not a repair.
2. A finding you judge mistaken, or that conflicts with stronger author or source evidence (the transcript, the brief's Stated section, `Research.md`): leave the text, and record in `Current.md` under `open-questions` the finding key, "dismissed", and the evidence — the council checks it next round. Never mediate through her.
3. A finding that needs substance she has not given (a missing scene, position, or rebuttal): do not invent it. Mark `[NEEDS HER]` in the text, set `Current.md`'s next action to `interview` with the one question, and stop after the other repairs. A missing fact → next action `research`.
4. Write `Draft-current.md` (replacing it); never touch `Draft-1.md`. Update `Current.md` (stage `revise`, `draft-file: Draft-current.md`, next action: council). Never rerun an unchanged draft; if no finding admits a repair you can make with the material you have, say so and stop — that is a stall for the council to record, not a reason to lower the bar.

## Stop

- Transcript lacks the substance to carry the piece → stop; return to interview; name the gap.
- A needed thesis/opponent/position is not in the transcript → mark `[NEEDS HER]`, or stop if it is the spine; never invent it.
- Config key unresolved → report it and exit.

## Not this skill

Interviewing; critiquing or scoring; judging publish-readiness; publishing; writing personal content to the repo; presenting composed prose as her view; editing `Draft-1.md` after it is written; repairing by inventing what she did not say.
