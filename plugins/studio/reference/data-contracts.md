# Content Machine — data contracts

The data the Content Machine reads and writes: structured YAML frontmatter on per-item vault notes, browsable through an Obsidian `base` block. Shapes only — the data lives in the vault at config-keyed paths; nothing personal is in this repo.

## Storage map (config-keyed)

- **Idea records** — one note per idea under `workspace.ideas_dir` (per-note so Bases can filter them).
- **Run records** — `workspace.discovery_dir/<YYYY-MM-DD>.md` (field by kind, coverage, outcome).
- **Article workspaces** — `workspace.articles_root/<stable-name>/` (files in §2).
- **Lessons store** — `workspace.lessons`.
- **Ideas dashboard** — `workspace.ideas_dashboard`: a resurfacing-rule header + the Bases view (§5).

## 1. Idea record

```yaml
---
tags:
  - type/data
  - project/studio
  - status/new   # status lives in tags: status/new | status/accepted | status/decent
                 # | status/potential | status/rejected | status/selected | status/developing | status/published
type: studio-idea
claim: "<one-line claim>"
lens: [leadership]                 # leadership | builder | domain | team (one or more)
form: narrative-insight            # narrative-insight | research-synthesis
verdict: "<her verbatim words>"    # verbatim, never paraphrased
verdict-authority: explicit | confirmed | provisional
run: YYYY-MM-DD
provoking-source: "<url/ref + the finding>"
conviction-source: "<conviction + quoted phrase>"   # research-synthesis
build-source: "<build + the design choice>"          # builder lens
article: null | "<stable-name>"    # set when status→selected
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

`claim` is one line. `verdict` is her exact words. The status tag and `verdict` are human-set — agents never set `status/accepted` or `status/selected`. `status/rejected` records are kept, never deleted. Body: the claim's paragraph, receipts (quoted lines + sources), any not-her-words framing marked as such.

## 2. Article workspace (`Articles/<stable-name>/`)

| File | Holds | Written by | Read by |
|---
| `Current.md` | resume surface: `idea-ref, stage (research\|interview\|draft\|critique\|edit\|signed\|published), draft-file, open-questions, next-action` | every phase | a resuming session |
| `Position brief.md` | author source: stated (verbatim+source) · articulated-for-her (not-her-words, marked) · gaps | interview | draft |
| `Interview.md` | her answers verbatim, segmented | interview | draft |
| `Research.md` | evidence for/against each reading, counter-readings, Strong/Moderate/Weak verdict | research | draft (Weak ⇒ no draft) |
| `Sources/*` | fetched primary sources, public-safe | research | research/draft |
| `Draft-1.md` … `Draft-final.md` | drafts; `Draft-final` only on her sign | draft / her edits | critique / her |
| `Critique-1.md` | findings: passage · problem · reader-effect · evidence (no rewrites) | critique | her |

## 3. Lessons store (`Lessons.md`) — created by `/studio:learn`; discovery idea-verdicts are NOT here (they live in each idea record's `verdict`, §1)

```markdown
## Her verdicts (verbatim) — draft/editorial sign-offs and edit calls only
- [<draft ref>] "<her verbatim words>" — authority: explicit|confirmed|provisional — scope: <what it governs>
## Derived lessons (marked derived; second-tier)
- <lesson> — from <verdict ref> — scope: <…> — status: active | corrected(<when & why>)
```

Her explicit corrections and confirmed lessons supersede older guidance; a provisional lesson that conflicts with established guidance returns to her rather than overriding; a contextual lesson stays scoped to its context, never applied as a universal.

## 4. Per-phase handoffs (one owner; this table will drift from the skills — keep it in sync deliberately)

| Phase | Reads | Writes | Gate |
|---
| Discovery | convictions, builds, the field, `Lessons.md` verdicts | idea records (`status/new`), run record | zero valid; no quota |
| Vet (her) | the handful | `verdict` + `status` | her verdict is the result |
| Research | selected idea, sources | `Research.md` + foundation verdict | Weak ⇒ stop drafting |
| Interview | idea, convictions, voice foundation | `Position brief.md` + `Interview.md` | stop if abstract / when enough |
| Draft | `Interview.md`, `Position brief.md`, `Research.md`, voice config | `Draft-1.md` | thin transcript ⇒ back to interview |
| Critique | draft, transcript, research, voice foundation | `Critique-1.md` | not a gate |
| Her edits | `Draft-1` + `Critique-1` | `Draft-final.md`; edit-lessons → `Lessons.md` | "I'd post this" = done |
| Publish | `Draft-final` | posted copy + URL in the workspace | her initiation only |
| Learn | `Draft-1`↔`Draft-final` diff, her verdicts | `Lessons.md` (on her yes) | her approval each time |

## 5. Bases view

The dashboard note embeds parallel `base` blocks over the idea records, one per status group (Would write: `status/accepted`+`status/selected`; Candidates: `status/new`; Potential: `status/decent`+`status/potential`; Rejected: `status/rejected`):

```base
filters:
  and:
    - tags.contains("type/data")
    - tags.contains("project/studio")
    - type == "studio-idea"
    - tags.containsAny("status/accepted", "status/selected")
views:
  - type: table
    name: Would write
    order: [claim, lens, form, run]
    properties: [claim, lens]
    columnSize:
      note.claim: 420
      note.lens: 140
```
