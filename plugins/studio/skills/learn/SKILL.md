---
name: learn
description: Turn the author's reactions into lessons later drafts and councils use — from a signed draft's diff and her edit calls (provisional lessons apply automatically within their scope; identity, publishing-intent, and conflicting lessons return to her), or record her verbatim verdict on a discovery idea. Use after a draft is signed, after she gives editorial feedback, or when recording a discovery verdict.
argument-hint: [article folder | idea verdict]
context: fork
disable-model-invocation: false
allowed-tools:
  - Read
  - Bash(date:*)
  - Write
  - Edit
  - Glob
---

# /studio:learn

Turn what she did to this draft into lessons the next draft and council apply, each within its scope. Her words verbatim first; derived lessons second and marked. Store shape: `${CLAUDE_PLUGIN_ROOT}/reference/data-contracts.md` §3. Resolve `workspace.articles_root`, `workspace.ideas_dir`, and `learning.lessons` from the vault config, read with `Read` at `{workspace_root}/Projects/Studio/studio.config.md`, where `{workspace_root}` is the vault root from the global Claude Code configuration block (`workspace.vault_root` in the config repeats it for shell steps); keys are in its frontmatter, each a literal dotted name, and an absent key stops the skill and is named to her. Join every vault-relative key or folder to that root before `Read`, `Write` or `Glob`, and write only under that root: never create or change a file anywhere else on disk. Read only the named article folder or idea record (and, for a correction, each article's `Current.md` under `workspace.articles_root`), the lessons store, and `creator.voice_preferences` (section `creator.voice_preferences_section`) for the conflict check — nothing else.

## Authority

Every lesson carries one authority and one scope:

- **explicit** — she said it as a rule ("never open with a question"). Applies as stated. Supersedes anything older it conflicts with.
- **confirmed** — derived, then she said yes. Applies within scope.
- **provisional** — derived from her edits or feedback without her ruling. **Applies automatically within its scope** on the next draft and council; marked so a wrong one is cheap to correct.

A lesson about **who she is, what she will publish, or where** (identity, publishing intent), or one that **conflicts** with an explicit or confirmed lesson, the voice preferences, or another lesson from the same pass, is not written on this pass — a rule she stated outright included. It returns to her with both sides stated; her ruling is then written as `explicit` and the superseded entry marked. Scope names the context: a lesson from a research-synthesis piece does not govern a narrative piece unless she says so.

## After a signed draft (or her edit pass)

1. Load `Draft-current.md` and `Draft-final.md` (or whichever two she edited between) from `workspace.articles_root/<stable-name>/`, plus `Review.md` and `Current.md`. Diff them: her edits are the material.
2. For each substantive edit of hers: name the lesson it implies, general but scoped (tone, structure, voice, claim-sizing, evidence framing, the form), and tag it **council-flagged** (the council raised that passage — give the key; say if its diagnosis differed or it closed the finding wrongly) or **council-missed**. Record the counts in the article's `Current.md` as `council-scorecard: flagged <n> / missed <n>`.
3. Check every candidate — her verbatim remarks and the derived lessons alike — against the existing store, `creator.voice_preferences`, and each other. Anything that conflicts, and anything about identity or publishing intent, goes to `Current.md` `open-questions` for her with both sides stated, and is not written.
4. Write the rest to `learning.lessons`, each entry with the next key (`L<n>`): under *Her verdicts*, each verbatim reaction with authority `explicit` and its scope; under *Derived lessons*, each derived lesson as `provisional` with scope, the edit it came from, and `status: active`. Append; never rewrite earlier entries — the correction path below changes an entry's `status` and nothing else.
5. Report: the lessons written and their authority; what returned to her and why; the council-flagged / council-missed counts.

## Her correction

When she says a lesson is wrong or over-applied: find the entry by its key or, if she described it, confirm the match with her before touching it; set its `status: corrected(<date> — <her words>)` (the one change to an existing entry this skill ever makes); write her correction as a new `explicit` entry scoped as she said it, superseding the corrected key — her ruling resolves that conflict, so it is not held; then, in the `Current.md` of every article whose `lessons-applied` names that key, add `<key> — question — the passage this lesson shaped may need revising`. A corrected lesson stops applying immediately; `draft`, `revise`, and the council read only `active` entries. Derive nothing new from a correction.

## Recording a discovery verdict

1. Take her verbatim verdict on an idea (or set).
2. Write it verbatim to the idea record's `verdict` in `workspace.ideas_dir`, set `verdict-authority: explicit`, and set the status tag per her decision — both are hers, never inferred.
3. The idea record is the verdict's only home; `discover` reads it there. A `status/rejected` record is retained so the material is not re-presented. Nothing from a discovery verdict goes to `learning.lessons`.

## Not this skill

Paraphrasing her words; applying a scoped lesson as a universal; writing an identity, intent, or conflicting lesson without her ruling; silently overriding an explicit lesson; drafting, critiquing, or interviewing; setting a status tag she did not choose.
