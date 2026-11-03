---
name: draft
description: Produce the first draft of a Content Machine article from the author's interview transcript, in her voice — or, in revise mode, repair the current draft against the council's Review.md while preserving what works. Use after /studio:interview ("draft [idea]") or after a council round ("revise [idea]").
argument-hint: [article folder or idea name, optionally revise]
context: fork
disable-model-invocation: false
allowed-tools:
  - Read
  - Bash(date:*)
  - Write
  - Edit
  - Glob
---

# /studio:draft

Produce one first draft from the interview transcript, in the author's voice, for the council and then her. Her words are the only source of substance: the transcript, and the brief's verbatim-stated lines (hers, sourced). Research enters only as attributed research — "the survey found…" — never as her experience, her position, or a claim stronger than she made. Do not judge whether it is good enough to publish — that is hers. With `revise` in `$ARGUMENTS`, or when `Review.md` exists and is not council-ready, run **Revise mode** instead (below).

## Inputs / outputs

Read from the article folder (under `workspace.articles_root`; find it with `Glob` by the idea's stable-name): `Position brief.md`, `Interview.md`, `Research.md` (if present — check it tests this piece's claim; a verdict on a neighboring reading neither blocks nor supports this draft, and a draft whose own claim has no foundation verdict says so in its notes and `Current.md`, next action `research` before council). Also `creator.voice_foundation`; `creator.voice_preferences` (the note at that key, section `creator.voice_preferences_section`); `learning.lessons` (every `active` lesson applies whose scope names this piece's form or lens — both in `Current.md`, copied from the idea record at interview — its stable-name, or says it is universal; explicit, confirmed, and provisional alike; a corrected one does not; where two applicable lessons pull against each other, explicit beats confirmed beats provisional, and a tie is reported, not resolved). Resolve every key from the vault config, read with `Read` at `{workspace_root}/Projects/Studio/studio.config.md`, where `{workspace_root}` is the vault root from the global Claude Code configuration block (`workspace.vault_root` in the config repeats it for shell steps). Keys are in its frontmatter, each a literal dotted name. Join every vault-relative key or folder named here to that root before `Read`, `Write` or `Glob`; a key that is absent stops the skill and is named in the report. Write only under that root: never create or change a file anywhere else on disk. Read nothing else: not another article folder, not the idea records, not her convictions, not a repository. Write `Draft-1.md` and `Draft-current.md` (identical at first) to the article folder; in revise mode also read `Review.md` and `Draft-current.md`, and write only `Draft-current.md`. Never write personal content into the repo.

## Steps

1. Load the inputs. From the Position brief, its verbatim-stated lines are hers and usable; its articulated-for-her lines are never usable unless the transcript shows she adopted or rewrote one; its evidence section is research, used as step 3 allows.
2. Check the transcript holds the spine: the claim, a lived particular, her position, the opponent and her rebuttal to it, the mechanism, the reader. If any load-bearing element is missing, stop, return to the interview, and name what's missing. Do not fill it.
3. Draft:
   - Every claim, judgment, thesis, and scene comes from her words. Never write a position she did not state. Mark a missing element `[NEEDS HER]`; if the spine is missing, stop (step 2).
   - Build an argument; do not restate the interview in order. Open earned (not "X isn't about X"). Develop the mechanism. Voice the opponent's counterargument and answer it — the opponent's side is composed only from what she argues against in her words, and her rebuttal is hers. Make the strongest claim the hinge. State the thesis once. Keep the grammatical subject stable. Keep her sharpest lines verbatim.
   - Compose only the title, the hook, the closing, connective prose, the opponent's framing, and attributed research summary. Each composed part is listed in the notes.
   - Apply the voice and register rules from `creator.voice_preferences` and `creator.voice_foundation` — the single source; do not restate them here.
4. Self-check, and finish it before step 5 writes anything:
   - Cut any claim, judgment, or characterization not in her words — including unanchored "most"/comparative/proportion claims — or mark it `[NEEDS HER]`.
   - Confirm: builds an argument, not a restatement; confronts the opponent's counterargument, not just warns; thesis stated once; strongest claim is the hinge; reader placed at a specific moment; no manufactured aphorism.
5. Write `Draft-1.md`: the draft, then an **Alternatives** section with two other hooks and two other closings (composed; the one choice she makes at a glance), then notes — which parts are her transcript vs composed prose, any `[NEEDS HER]` gaps, the lines least certain to be her voice. Copy the draft (without the alternatives and notes) to `Draft-current.md`. Once `Current.md` points the council at it, `Draft-1.md` is never edited again. Create or update `Current.md` per `${CLAUDE_PLUGIN_ROOT}/reference/data-contracts.md` §2 (stage `draft`, `draft-file: Draft-current.md`, `lessons-applied` — the keys of every lesson applied, so a later correction can find this piece — open questions, next action: council).

## Revise mode

The council diagnosed; you choose the repair. Read `Review.md`'s latest round and `Draft-current.md`, with the same inputs as a first draft (author evidence, voice material, lessons — a `corrected` entry is still the record of her edit, never a rule to apply).

1. Take the findings marked **necessary** first, then optional ones you judge worth it. For each: repair it in the text in your own way — the council named the problem, not the fix — and preserve everything that already works; a repair that flattens her voice to satisfy a lens is not a repair.
2. A finding you judge mistaken, or that conflicts with stronger author or source evidence (the transcript, the brief's verbatim-stated lines, `Research.md`): leave the text, and record in `Current.md` under `open-questions` the finding key, "dismissed", and the evidence — the council checks it next round. Never mediate through her.
3. A necessary finding that needs substance she has not given (a missing scene, position, or rebuttal): do not invent it. Mark `[NEEDS HER]` in the text and write one plain question per such finding, keyed to it, in `Current.md`'s `open-questions`. An optional one gets the question only, no mark, and does not change the next action. A missing fact → one research question, keyed the same way.
4. Finish every repair you can make, then write `Draft-current.md` (replacing it); never touch `Draft-1.md`. Update `Current.md` (stage `revise`, `draft-file: Draft-current.md`, `lessons-applied` extended; next action `council` when every necessary finding was repaired or dismissed, `interview` when any `[NEEDS HER]` stands, `research` when only a fact blocks). Never rerun an unchanged draft; if no finding admits a repair you can make with the material you have, say so and stop — that is a stall for the council to record, not a reason to lower the bar.

## Stop

- Transcript lacks the substance to carry the piece → stop; return to interview; name the gap.
- A needed thesis/opponent/position is not in the transcript → mark `[NEEDS HER]`, or stop if it is the spine; never invent it.
- Config key unresolved → report it and exit.

## Not this skill

Interviewing; critiquing or scoring; judging publish-readiness; publishing; writing personal content to the repo; presenting composed prose as her view; editing `Draft-1.md` after it is written; repairing by inventing what she did not say.
