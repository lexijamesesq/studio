---
name: learn
description: Turn the author's reactions into lessons later drafts and councils use — from a signed draft's diff and her edit calls (provisional lessons apply automatically within their scope; identity, publishing-intent, and conflicting lessons return to her), or record her verbatim verdict on a discovery idea. Use after a draft is signed, after she gives editorial feedback, or when recording a discovery verdict.
argument-hint: [article folder | idea verdict]
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
  - mcp__obsidian__manage_tags
  - mcp__obsidian__get_frontmatter
  - mcp__obsidian__list_directory
---

# /studio:learn

Make the next draft better than this one because of what she did to this one. A lesson that sits in a file and changes nothing is a failure; a lesson applied beyond its scope is a worse one. Her words verbatim first; derived lessons second and marked. Store shape: `${CLAUDE_PLUGIN_ROOT}/reference/data-contracts.md` §3. Resolve `workspace.articles_root`, `workspace.ideas_dir`, and `learning.lessons` from the vault config at `Projects/Studio/studio.config.md` — keys are in frontmatter, read with `get_frontmatter`; an absent key stops the skill and is named to her. Read only the named article folder or idea record and the lessons store — nothing else.

## Authority (FR7)

Every lesson carries one authority and one scope:

- **explicit** — she said it as a rule ("never open with a question"). Applies as stated. Supersedes anything older it conflicts with.
- **confirmed** — derived, then she said yes. Applies within scope.
- **provisional** — derived from her edits or feedback without her ruling. **Applies automatically within its scope** on the next draft and council; marked so a wrong one is cheap to correct.

A lesson about **who she is, what she will publish, or where** (identity, publishing intent), or one that **conflicts** with an explicit or confirmed lesson or the voice preferences, is never provisional: it stops and returns to her with the conflict stated. Contextual ≠ universal — a lesson from a research-synthesis piece about evidence framing does not govern a narrative piece unless she says so; scope names the context.

## After a signed draft (or her edit pass)

1. Load `Draft-1.md`, `Draft-current.md`, and `Draft-final.md` (or whichever two she edited between) from `workspace.articles_root/<stable-name>/`, plus `Review.md` and `Current.md`. Diff `Draft-current` → `Draft-final` (her edits) and, for the council's record, `Draft-1` → `Draft-current` (the loop's work).
2. For each substantive edit of hers: name the lesson it implies, general but scoped (tone, structure, voice, claim-sizing, evidence framing, the form), and tag it **council-flagged** (the council had raised it — find the key in `Review.md`) or **council-missed** (it had not). The tags are the council's scorecard; record the counts in the article's `Current.md`.
3. Write to `learning.lessons`: under *Her verdicts*, every verbatim reaction she gave, with authority `explicit` and its scope; under *Derived lessons*, each derived lesson as `provisional` with scope, the edit it came from, and `status: active`. Append; never rewrite earlier entries.
4. Then check each new lesson against the existing store and `creator.voice_preferences`: a conflict, or an identity/intent lesson, is not written as provisional — list it for her with the two sides and write it only as she rules (`explicit`) or drop it.
5. Report: the lessons written and their authority; what returned to her and why; the council-flagged / council-missed counts.

## Her correction

When she says a lesson is wrong or over-applied: mark the entry `status: corrected(<date> — <her words>)`, write her correction as `explicit`, and name the drafts it was applied to. A corrected lesson stops applying immediately; `draft`, `revise`, and the council read only `active` entries.

## Recording a discovery verdict

1. Take her verbatim verdict on an idea (or set).
2. Write it verbatim to the idea record's `verdict` in `workspace.ideas_dir`, set `verdict-authority: explicit`, and set the status tag per her decision — both are hers, never inferred.
3. The idea record is the verdict's only home; `discover` reads it there. A `status/rejected` record is retained so the material is not re-presented. Nothing from a discovery verdict goes to `learning.lessons`.

## Not this skill

Paraphrasing her words; applying a scoped lesson as a universal; writing an identity, intent, or conflicting lesson without her ruling; silently overriding an explicit lesson; drafting, critiquing, or interviewing; setting a status tag she did not choose.
