---
name: critique
description: Give a draft one non-author, cross-model critique before the author reviews it — specific findings, no rewrites. It informs her; it never gates. Run in a context that did not write the draft and on a different model than the drafter.
argument-hint: [article folder or draft file]
context: fork
disable-model-invocation: false
allowed-tools:
  - Read
  - Grep
  - Glob
  - mcp__obsidian__read_note
  - mcp__obsidian__read_multiple_notes
  - mcp__obsidian__write_note
  - mcp__obsidian__get_frontmatter
  - mcp__obsidian__list_directory
---

# /studio:critique

Read a draft as a sharp reader would and return specific findings for the author to weigh. This is not a gate — her verdict is the only gate. Produce no rewrites. Run fresh (you did not draft this) and on a different model than the drafter.

## Inputs / outputs

Read the article folder (under `workspace.articles_root`; find it with `list_directory`): `Draft-1.md` or the named draft, `Interview.md`, `Research.md`, `Position brief.md`. Also `creator.voice_foundation` (the voice guide). Resolve every key from the vault config at `Projects/Studio/studio.config.md` — keys are in frontmatter, read with `get_frontmatter`. Write `Critique-1.md`.

## Steps

1. Load the draft, the transcript (what she actually said), the research, and the voice foundation.
2. Read it as the reader, idea first. Hunt for surprise; if your honest reaction is "I like it," that usually means it isn't new — push past it.
3. Judge against: does it reframe the problem or restate its inputs; does the central claim still mean something dropped into an unrelated piece; does it place the reader at a specific moment; does it measure its own framing; voice fidelity against `creator.voice_foundation`'s explicit preferences — sounds like her AND a position the transcript shows she'd take (voice and viewpoint judged separately); no performed ownership, staged vulnerability, or manufactured fragment-aphorisms; conviction sized to its evidence; no announced expertise where causal reasoning should carry it; punctuation and register intentional and natural, em-dash density not standing in for rhythm; no over-level, uniformly polished prose.
4. Write findings to `Critique-1.md`, each as: passage (quoted) · problem · effect on the reader · evidence. No remedies, no rewrites. Never manufacture a finding — "nothing wrong here, and here is what it still lacks (surprise / a real claim / a specific moment)" is a valid and often truer result.
5. Record one line: one non-author critique; the invoking session supplies the drafter's model and the critic's model and confirms this is a non-author run (a fork cannot detect either) — record them, or "models unconfirmed" if not supplied.

## Stop

- This context drafted the piece → stop; a non-author context must critique.
- Cannot run on a different model than the drafter → proceed, but record the limitation in `Critique-1.md`.

## Not this skill

Rewriting or editing; scoring; gating or blocking; judging publish-readiness; drafting or interviewing; manufacturing a finding to look thorough.
