# Content Machine — data contracts

The data the Content Machine reads and writes: structured YAML frontmatter on per-item vault notes, browsable through an Obsidian `base` block. Shapes only — the data lives in the vault at config-keyed paths; nothing personal is in this repo.

## Storage map (config-keyed)

- **Idea records** — one note per idea under `workspace.ideas_dir` (per-note so Bases can filter them).
- **Fields and run records** — the assembled field in `workspace.discovery_dir/<YYYY-MM-DD>-<n>/` and its run record at `workspace.discovery_dir/<YYYY-MM-DD>-<n>.md` (field by kind, coverage, outcome); `<n>` counts same-day runs.
- **Article workspaces** — `workspace.articles_root/<stable-name>/` (files in §2).
- **Lessons store** — `learning.lessons`.
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
| `Current.md` | resume surface: `idea-ref, form, lens (copied from the idea record), stage (research\|interview\|draft\|critique\|revise\|edit\|signed\|published), draft-file, lessons-applied (keys), open-questions (`KEY — question \| dismissed \| ruling \| resolved — TEXT`), next-action (research \| interview \| draft \| council \| revise \| her review \| learn)` | every phase | a resuming session; `draft` (lesson scope) |
| `Position brief.md` | author source: stated (verbatim+source) · articulated-for-her (not-her-words, marked) · gaps | interview | draft |
| `Interview.md` | her answers verbatim, segmented | interview | draft |
| `Research.md` | evidence for/against each reading, counter-readings, Strong/Moderate/Weak verdict | research | draft (Weak ⇒ no draft) |
| `Sources/*` | fetched primary sources, public-safe | research | research/draft |
| `Draft-1.md` | the first draft, frozen, with alternative hooks and closings and the writer's notes | draft | her (and learn, for the diff) |
| `Draft-current.md` | the draft under revision; the council reviews it, revise replaces it | draft (first and revise) | critique / her |
| `Draft-final.md` | the draft after her edit pass; her sign ("I'd post this") is recorded in `Current.md` (stage `signed`) | her edits | learn / publish |
| `Review.md` | the council's rounds, appended: six scores + aggregate, council-ready, findings (passage · problem · effect · evidence; necessary vs optional), each earlier finding's status (open / resolved with passage / dismissed with reason) | critique | draft (revise) / her |

## 3. Lessons store (`learning.lessons`) — written by `/studio:learn`; discovery idea-verdicts are NOT here (they live in each idea record's `verdict`, §1)

```markdown
## Her verdicts (verbatim) — editorial sign-offs, edit calls, rules she states, corrections
- L<n> [<draft ref>] "<her verbatim words>" — authority: explicit — scope: <what it governs> — status: active | superseded(<key>) — supersedes: <key, if a correction>
## Derived lessons (marked derived; second-tier)
- L<n> <lesson> — from <draft ref, the edit> — authority: confirmed | provisional — scope: <context it governs> — council: flagged(<key>) | missed — status: active | corrected(<date> — <her words>)
```

Authority: `explicit` (she stated it) and `confirmed` (derived, she said yes) supersede older guidance; `provisional` (derived from her edits, unruled) applies automatically within its scope and is marked so a correction is cheap. An identity or publishing-intent lesson, or one that conflicts with an explicit/confirmed lesson or the voice preferences, is never provisional — it returns to her. A contextual lesson stays scoped to its context, never applied as a universal. `draft`, `revise`, and the council read only `active` entries; the council raises a violated active lesson as a finding.

## 4. Per-phase handoffs (one owner; this table will drift from the skills — keep it in sync deliberately)

| Phase | Reads | Writes | Gate |
|---
| Discovery | topic profile (`creator.topic_profile`), convictions, builds, the field, idea-record verdicts, derived lessons (`learning.lessons`) | idea records (`status/new`), run record | zero valid; no quota |
| Vet (her) | the handful | `verdict` + `status` | her verdict is the result |
| Research | selected idea, sources | `Research.md` + foundation verdict | Weak ⇒ stop drafting |
| Interview | idea, convictions, voice foundation, words archive (searched, never read whole) | `Position brief.md` + `Interview.md` | stop if abstract / when enough |
| Draft | `Interview.md`, `Position brief.md`, `Research.md`, voice config, lessons | `Draft-1.md` + `Draft-current.md` | thin transcript ⇒ back to interview |
| Revise | `Review.md`, `Draft-current.md`, the same author/source evidence | `Draft-current.md` | no repair possible from the material ⇒ stall, named |
| Critique (council) | draft, transcript, brief, research, voice foundation + §3.1 preferences, lessons, prior `Review.md` | `Review.md` (round appended) | council-ready = aggregate ≥ 9 with no open substantiated finding; her verdict is the only gate |
| Her edits | the council-ready draft + `Review.md` | `Draft-final.md`; edit-lessons → `learning.lessons` | "I'd post this" = done |
| Publish | `Draft-final` | posted copy + URL in the workspace | her initiation only |
| Learn | `Draft-current`↔`Draft-final` diff + `Review.md`; her discovery verdicts | `learning.lessons` (her words explicit; derived lessons provisional, applied within scope); conflicts and identity/intent → her via `Current.md`; idea-record `verdict` + status | provisional applies without her; a correction stops it |

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
