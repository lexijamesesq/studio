---
name: learn
description: Record the author's reactions so later runs change — her verdict on a discovery handful, or editorial lessons from a signed draft's diff. Nothing is written without her yes. Use after a draft is signed, or when recording her verdict on a discovery set.
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

Turn her reactions into changes later runs use. Two entry points. Write nothing to the lessons store without her explicit yes. Her words verbatim first; derived lessons marked and second. Store shape: `${CLAUDE_PLUGIN_ROOT}/reference/data-contracts.md` §3. Resolve `workspace.articles_root`, `workspace.ideas_dir`, and `learning.lessons` (the lessons store) from the vault config at `Projects/Studio/studio.config.md` — keys are in frontmatter, read with `get_frontmatter`.

## After a signed draft

1. Load `Draft-1.md` and `Draft-final.md` from `workspace.articles_root/<stable-name>/`.
2. Diff them. For each substantive change, name the general but scoped lesson (tone, structure, voice, claim).
3. Propose the candidate lessons to her, each tied to the change it came from. Ask whether to add them.
4. On her yes, append to `learning.lessons`: her verbatim reaction (if given) under *Her verdicts*, and the derived lesson under *Derived lessons* — marked, with scope and authority. On no, discard. Never auto-save.
5. If a proposed lesson conflicts with established guidance, surface the conflict to her and record her resolution — never override silently.

## Recording a discovery verdict

1. Take her verbatim verdict on an idea (or set).
2. Write it verbatim to the idea record's `verdict` in `workspace.ideas_dir` and set its status tag per her decision — both are hers, never inferred.
3. The idea record is the verdict's only home; `discover` reads it there. A `status/rejected` record is retained so the material is not re-presented. Nothing from a discovery verdict goes to `learning.lessons`.

## Rules

Her words verbatim, never paraphrased. Derived lessons marked as derived and scoped to their context, never applied as a universal. Her explicit corrections and confirmed lessons supersede older guidance; a provisional lesson that conflicts returns to her.

## Not this skill

Writing any lesson without her yes; paraphrasing her words; applying a scoped lesson as a universal; drafting, critiquing, or interviewing; setting a status tag she did not choose.
