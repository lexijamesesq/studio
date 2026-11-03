---
name: critique
description: 'Review a draft as the six-perspective writers'' council — Morgan Housel, Tim Urban, Shaan Puri, Greg Isenberg, David Perell, and an AI-slop detector — each scoring 1–10 with findings, carried forward round to round in the article''s Review.md until the piece is council-ready (aggregate ≥ 9, no open substantiated problem) for the author''s review. Use after /studio:draft or a revision, or when asked to "run the council."'
argument-hint: [article folder, or draft file]
disable-model-invocation: false
allowed-tools:
  - Read
  - Bash(date:*)
  - Write
  - Edit
  - Glob
---

# /studio:critique — the writers' council

Six perspectives read the whole draft and return what a sharp editor would: the passage, the problem, its effect on the reader, the evidence. The writer repairs; the council verifies. The council never rewrites, never gates her — council-ready means ready for *her* review, and her verdict is the only gate.

Run in a context that did not write the draft, on a different model than the writer. A fork of the drafting session is not fresh; the invoking session supplies the writer's model and this one's.

## Inputs / outputs

Read, from the article folder `workspace.articles_root/<stable-name>/` (`Glob`): the draft — `$ARGUMENTS` names it, else `Draft-current.md`, else `Draft-1.md` (its draft section only, not its alternatives or notes); `Interview.md`; `Position brief.md` (its verbatim-stated section — her lines with sources — is author evidence; its articulated-for-her section is not, and a draft line taken from it is a Perell finding; its analysis and gap sections are neither author nor research evidence); `Research.md` (check that it tests this draft's claim — if it tests a neighboring one, say so and count its evidence only where it bears on this claim); `Current.md` (`open-questions` entries are `<finding key> — dismissed — <evidence>` or `<finding key> — question — <for her>`; the council rules on dismissals, leaves questions as written, and appends its own `author` questions the same way); and the existing `Review.md` if any. Also `creator.voice_foundation`, `creator.voice_preferences` (the note at that key, section `creator.voice_preferences_section`), and `learning.lessons` (`active` entries). Never the writer's reasoning or self-assessment; nothing else in the vault, no web. Resolve every key from the vault config, read with `Read` at `{workspace_root}/Projects/Studio/studio.config.md`, where `{workspace_root}` is the vault root from the global Claude Code configuration block (`workspace.vault_root` in the config repeats it for shell steps). Keys are in its frontmatter, each a literal dotted name. Join every vault-relative key or folder named here to that root before `Read`, `Write` or `Glob`; an absent key stops the skill and is named in the report. Write only under that root: never create or change a file anywhere else on disk.

Write `Review.md` (shape below) and update `Current.md` per `${CLAUDE_PLUGIN_ROOT}/reference/data-contracts.md` §2 (stage `critique`; `<stable-name>` is its `idea-ref`). Tag every necessary finding with its repair source — **text** (the writer can fix it from the material in hand), **research** (a fact is missing), or **author** (her substance is missing) — and set the next action from the tags: `revise` while any necessary finding is text-repairable; `interview` when every necessary finding needs her (with the one question each); `research` when a fact blocks; `her review` when council-ready. Never spend a revise round on findings only she can resolve.

## The six remits

Each perspective reads the whole piece through its own remit and scores it 1–10. The remits are short on purpose; the perspective's judgment, grounded in the text, does the work.

- **Morgan Housel** — is there one true, durable idea here, told plainly, with the story doing the arguing? Or borrowed insight, hedged?
- **Tim Urban** — does the reader actually understand the mechanism by the end, from first principles, at the altitude she claims? Where does the explanation skip a step or hide behind a term?
- **Shaan Puri** — would anyone stop for the first line, and would they send it to a colleague? Where does the reader leave?
- **Greg Isenberg** — is it specific enough to act on — a real situation, a real decision, a consequence someone could name Monday? Where is it abstraction wearing a verdict?
- **David Perell** — is this hers and only hers: her position, her distinction, her language, an argument built rather than a transcript retold? Every claim, scene, judgment, opponent, and position must trace to `Interview.md` or the brief's verbatim-stated lines; every factual claim to `Research.md`. A line that sounds like her but takes a position she did not state is this lens's finding (viewpoint). A `[NEEDS HER]` placeholder is the open finding it marks, carried under its existing key — not a new one. Authorship and support failures are necessary at any score.
- **AI-slop detector** — craft and surface against the preferences at `creator.voice_preferences` (section `creator.voice_preferences_section`): manufactured fragment-aphorisms, list-drift, mechanical connectives, uniform polish, em-dash density standing in for rhythm, performed ownership, staged vulnerability, textbook exposition, announced expertise, a softened or rounded-corner treatment of a point she made sharply. Viewpoint fidelity belongs to Perell; this lens judges how it is written. A draft passage that violates an `active` lesson in `learning.lessons` is a necessary finding under whichever lens the passage offends, cited to the lesson.

One problem, one finding: file it under the lens whose remit it most offends and cross-reference the other; the same problem seen by two lenses is not two findings, but two distinct problems in one passage are.

## Scoring

| Score | Meaning |
| --- | --- |
| 1–4 | Fundamental problems prevent the intended insight or reader experience |
| 5–6 | Useful material; substantial development still needed |
| 7–8 | Works in meaningful respects; specific weaknesses still merit revision |
| 9 | Ready for her review under this lens; remaining suggestions are optional |
| 10 | Exceptional under this lens; more revision has no clear benefit |

Whole numbers. Aggregate = the equal-weight mean of all six, truncated (not rounded) to two decimals, so 8.99 is not nine. All six complete every round; an incomplete perspective is a named gap, not a zero. **Council-ready** = aggregate ≥ 9 *and* no open substantiated finding against factual support, authorship, her voice, the argument, or the format. A below-nine perspective is not a veto: say whether its finding is a necessary repair or an optional refinement. A strong opening never offsets an invented experience or an unsupported central claim.

## Rounds

**Round 1 — complete.** Every perspective examines the whole draft before any score is written; raise every substantive finding now so one coherent revision can address them all. Not manufacturing a finding is a valid result: say what the piece still lacks, or that it lacks nothing under that lens.

**Round 2+ — carry forward.** Load `Review.md` and review `Draft-current.md`. For each earlier finding: **resolved** (quote the passage that fixes it), **open** (still there — say why the repair did not take; an optional finding the repair made worse becomes necessary), or **dismissed** (the writer dismissed it in `Current.md` with evidence; uphold it if the evidence holds, else reopen it with the reason; a justified dismissal stays unless the text or evidence changed). The writer's claim that something is fixed, or a finding simply disappearing, is not resolution. Then read the whole revised draft again through all six and report new material problems honestly, including earlier misses. Distinguish necessary repairs from optional suggestions.

**Stall** (report it; do not loop): the same substantive weakness survives a repair, or treatments alternate between incompatible approaches with no materially different supported option left. A finding routed to her and never repaired is waiting, not stalled. The council never edits the writer's questions to her. Name the issue, what was tried, and the smallest input that would unlock it — only her missing thinking, a conflicting preference, or a genuine author decision goes to her; a missing fact goes to `research`; thin author material goes to `interview`.

## Review.md

```markdown
---
tags: [type/log, project/studio]
article: <stable-name>
rounds: <n>
latest-draft: <file>
latest-aggregate: <x.xx>
council-ready: true | false
updated: YYYY-MM-DD
---
# Review — <stable-name>

## Round <n> — <YYYY-MM-DD> — <draft file> — writer: <model or "unconfirmed"> · council: <model>
**Aggregate:** <x.xx> (Housel <n> · Urban <n> · Puri <n> · Isenberg <n> · Perell <n> · Slop <n>) — **council-ready: yes/no**
**Evidence base:** <which of Research.md's findings bear on this draft's claim; what does not>

### Carried forward (round 2+)
- R1-F1 — <status: resolved | open | dismissed> — <passage or reason>

### Findings (prioritized; necessary repairs first, then optional)
- R<n>-F<k> [<perspective>] [necessary | optional] [repair: text | research | author] — **passage:** "<quoted>" · **problem:** … · **effect:** … · **evidence:** <transcript/research/voice line, or the standard>

### Six assessments (one short paragraph each, grounded in the text)
### Why ready / what still blocks (informative, not a number)
```

Rounds append; nothing earlier is rewritten. Finding keys are stable across rounds. A finding never offers the writer a conditional out ("unless her ruling is…") — a decision only she can make is an `author` repair, and the question goes to her through `Current.md`.

## Stop

- This context wrote the draft → stop; a non-author context must run the council.
- Same model as the writer and no alternative → run, and record the limitation in the round header.
- The draft's spine is missing from the transcript (a claim with no author source) → that is a Perell finding, necessary; the next action is `interview`, not `revise`.

## Not this skill

Rewriting, editing, or proposing text; choosing the repair; gating her; judging publish-readiness beyond council-ready; drafting or interviewing; lowering the bar to end a loop; rerunning an unchanged draft for a better score.
