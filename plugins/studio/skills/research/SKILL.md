---
name: research
description: Research a chosen recommendation's claim to test it against its rival readings, not defend it — returning evidence for and against each and a Strong/Moderate/Weak foundation verdict where Weak stops drafting. Public-safe. Use when a claim needs grounding, or when asked to "research [idea]".
argument-hint: [article folder or idea name]
context: fork
disable-model-invocation: false
allowed-tools:
  - Read
  - WebSearch
  - WebFetch
  - Bash(date:*)
  - mcp__obsidian__read_note
  - mcp__obsidian__write_note
  - mcp__obsidian__get_frontmatter
  - mcp__obsidian__list_directory
---

# /studio:research

Test the claim against its rivals; find what would make it false as hard as what supports it. Public-safe — no private excerpts, names, or paths in any web query; vault reads are read-only.

## Inputs / outputs

Read the chosen idea record — find it by slug in `workspace.ideas_dir` with `list_directory` (claim, provoking source, any named rival readings). Write `Research.md`, and each fetched source as a note under `Sources/`, to the article folder `workspace.articles_root/<stable-name>/` (`<stable-name>` = the record's slug; create the folder if absent). Web via WebSearch/WebFetch. Resolve every key from the vault config at `Projects/Studio/studio.config.md` — keys are in frontmatter, read with `get_frontmatter`; a key that is absent stops the skill and is named in the report. Read only the idea record: never another article folder, `Discovery Runs/`, her convictions, or a repository. For a builder-lens idea the record's receipts are the evidence of the build; research the principle's public evidence. `Current.md` fields per `${CLAUDE_PLUGIN_ROOT}/reference/data-contracts.md` §2.

## Steps

1. State the claim's rival readings explicitly (e.g. "a management failure" vs "an AI-identity-stance effect" vs "the comp squeeze"). Start from any the idea record names.
2. Gather public evidence for and against each reading. Follow primary sources; quote the load-bearing lines with URLs; note what each measured and its limits (N, method, whether stated).
3. For each piece of evidence, ask whether it discriminates between the readings or is consistent with all of them. Non-diagnostic evidence supports nothing.
4. Write `Research.md`: what the sources establish and their limits; evidence for and against each reading, each conclusion split `Evidence: … / Interpretation: …`; the strongest counter-reading at full strength; and a **Foundation Assessment: Strong / Moderate / Weak** with the reason. Save each fetched source as a note under `Sources/` with its URL. Update `Current.md` with the contract's fields (stage `research`, next action).
5. If Weak, stop — no draft; report which reading the evidence supports, or that none is carried, so she can reshape or reselect, and record that in `Current.md`.

## Stop

- Foundation Assessment Weak → stop; no draft; return to her.
- A query would need private material to be meaningful → stop; that belongs to the interview.
- Sources do not state N/method → report the claim as limited; do not imply rigor.

## Not this skill

Drafting, interviewing, or critiquing; carrying private material into a query; asserting an interpretation as fact; padding with confirming links.
