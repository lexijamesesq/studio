---
name: discover
description: Bring a curated handful of article candidates the author would recognize as hers — her convictions met by current findings about people, or her builds read at purpose level — for her to vet. Writes idea records and a run record. Use to run a discovery pass or when asked to "run discovery."
argument-hint: [optional window]
context: fork
disable-model-invocation: false
allowed-tools:
  - Read
  - Bash(date:*)
  - Bash(ls:*)
  - Write
  - Edit
  - Glob
  - Grep
---

# /studio:discover

Bring the author a curated handful of candidates she would recognize as hers, enough that she points at one. She chooses; you never select or publish. Run with no network — the field is assembled separately (`/studio:assemble-field`); you read it locally.

## Inputs / outputs

Read: `creator.topic_profile` (the aligned range — throughline, lenses, selection bar; the only definition of relevant); `creator.convictions` whole, in her words (never paraphrase them into rules); her builds from `creator.builds` at purpose level (local repos via `Read` and `ls`, methodology docs via `Read`; overviews/reference only — never commit history, config, `inst-*`, or `Ideas/`/`Research/` outputs); the assembled field in `workspace.discovery_dir/<date>-<n>/` — the newest such folder unless `$ARGUMENTS` names one (each item kind-tagged finding/case/commentary); prior verdicts and the do-not-re-present list from the idea records in `workspace.ideas_dir` (each record's verbatim `verdict`; a `status/rejected` record is a do-not-re-present); `learning.lessons` for any derived lessons. Write idea records to `workspace.ideas_dir` (schema: read `${CLAUDE_PLUGIN_ROOT}/reference/data-contracts.md` §1) and a run record to `workspace.discovery_dir/<date>-<n>.md` (the same `<date>-<n>` as the field folder). Resolve every key from the vault config at `Projects/Studio/studio.config.md` — its keys are in the note's frontmatter, read with `Read`, and a key that is absent stops the skill and is named in the report; enumerate the idea records in `workspace.ideas_dir` with `Glob`. Read nothing beyond these keys: not `Discovery Runs/`, not the recommendations list, not any article folder — the idea records are the only history you consult.

## The two modes

- **Research synthesis:** one of her convictions (her words) met by a current finding **about people** that gives it stakes. State the finding's expected reading; the claim must cut against it. One argument, people as protagonists, the system only the pressure.
- **Builder lens:** one of her builds read at purpose level — what it is for, who it serves, the human situation its consequential choice answers — yielding a principle she has **not** written down (if a sharp person could write it without her build, reject). The expected control/efficiency reading is contradicted. The build is the case, never the subject.

## Candidate shape (write each this way)

- One-sentence **claim** as the title.
- **Expected reading:** one sentence.
- **The claim:** ≤150 words, one argument, cutting against the expected reading.
- Research synthesis — **Conviction:** file + quoted phrase · **Finding:** file/URL + quoted line.
- Builder lens — **Build:** what it is for · **Human situation:** one sentence · **Receipts:** file:lines, quoted.

## Steps

1. Load the topic profile and the convictions; the prior verdicts as demonstrations from the idea records in `workspace.ideas_dir` (verbatim `verdict`; a `status/rejected` record is not re-presented from the same material — if a new finding gives one fresh stakes, say so); `learning.lessons` for any derived lessons; and, for builder mode, the builds at purpose level.
2. Read the field. Provoking material is `finding`/`case` only; `commentary` is support, never the provoker. If the window holds no findings about people, return zero.
3. Find candidates in the two modes, recency plus relevancy (not a fixed calendar window). Apply the rejection checks below to each. Drop any candidate you yourself judge weak or already-said — never pad to a count. Zero is valid; no quota; a short list beats filler.
4. Write the idea records (`status/new`) and the run record (field by kind, coverage, what was rejected and why, and the findings examined where no reading cut against the expected one).
5. Flag every quoted line and evidence-class tag for verification. A non-author pass must confirm each quote is verbatim against its source and each flag correct before she sees the handful; the invoking session runs it (this fork has no spawn tool), checking attribution only, never taste.
6. Present the handful to her untouched. She vets; her verdicts go to `/studio:learn`.

## Rejection checks (reject on any)

- Her own words or activity used as source material — her words are the lens, never the material.
- The claim affirms the expected reading (no inversion).
- The protagonist is a system or the function's standing — "engineer thoughts in a design leader's clothes," "who cares."
- A builder principle already written in her docs — "describing mechanics," a re-voiced rule.
- Stacked observations with no single argument — "not cohesive," "incoherent."
- Her other verbatim no's: "lofty self-importance wrapped in word vomit… sheep ideas"; "cherry picking small things and masquerading them as topics."

## Evidence classes

Flag any candidate resting on a session-authored conviction (e.g. `voice-belief-thesis.md`) "needs her confirmation." Her decks and voice-and-identity are her own words. In the claim body keep the source's own hedges ("tends to," "preliminary," "downstream") — never harden them — and attribute a journalist's gloss to the journalist, not to the researcher.

## Not this skill

Mining her own activity or remarks; scoring, ranking, or using a source feed as the engine; fetching anything (no network); reading commit feeds or config as builder source; adding a critic or judge before her; selecting or publishing; presenting Claude-written claims as her view.
