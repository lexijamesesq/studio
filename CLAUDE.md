---
tags:
  - type/claude-repo
description: "Studio's publishing plugin and TypeScript operations for topic discovery, selection, and editorial preparation."
docs_home: "{workspace_root}/Studio"
---

# Studio

This repository ships reusable publishing behavior and deterministic Markdown record operations. Interactive sessions use its skills to present saved article opportunities, record the author's choice, and develop preparation. Scheduled research consumes the same contracts through a thin agent-ops invocation. The paired vault project holds publishing intent and design decisions; this guide is sufficient to build and test without vault access.

## Setup

Use Node 22+ and npm. From a fresh checkout run `npm ci` and `npm run build`; the build generates `dist/` and the JSON schemas. Tests include the compiled CLI, so build before testing.

Local Claude preview uses `claude --plugin-dir /absolute/package/plugins/studio`. The marketplace manifest is `.claude-plugin/marketplace.json`. Codex can read the shared skill, role, and playbook Markdown; Claude plugin loading, agent dispatch, and hook semantics are not automatically available in Codex. Client installation is separate setup, not a side effect of building.

## Configuration

Copy `samples/instance.sample.json` to `~/.config/studio/instance.json` and fill its placeholder paths once. `STUDIO_CONFIG` or CLI `--config` overrides it. Keep this file outside git; there is no required secret in the Studio package. Scheduled provider credentials belong to agent-ops runtime configuration.

```json
{"schemaVersion":1,"packageRoot":"/absolute/package","vaultRoot":"/absolute/vault","recordsPath":"Studio/Publishing","sources":[{"id":"method","path":"Studio/Knowledge/method.md","publicUse":"private"}],"intentPaths":[],"lessonPaths":[]}
```

`packageRoot` is the absolute built backend location used by cached plugin instructions. `vaultRoot` is absolute; `recordsPath` is vault-relative and confined to Studio. Each source has a stable `id`, exactly one vault-relative `path` or public HTTPS `url`, and `publicUse` of `private`, `paraphrase`, or `quotable`. `intentPaths` and `lessonPaths` are optional configured context lists. Generated `schemas/config.schema.json` and runtime Zod validation define the contract; runtime validation additionally enforces path and cross-field constraints.

## Build / Test

Run in this order:

```sh
npm run check
npm run typecheck
npm run build
npm test
```

Biome checks the estate style; TypeScript checks strict types; the build emits declarations, CLI code, and draft-07 schemas; Vitest exercises temporary synthetic storage, actual CLI calls, source boundaries, retries, revisions, and preparation continuity. Tests do not require model credentials or private vault data.

## CI

`.github/workflows/ci.yml` currently contains the reusable estate CI floor plus Studio checks, typecheck, build, and tests. The official estate seed is present. Enrollment and caller rollout PRs are pending; declared merge rules, Margot, and Ollie integration require their merges and the estate proof PR. Local hook templates are installed through estate mode; no completed enrollment or merge proof is claimed. Do not substitute ad-hoc GitHub setup.

## Ownership and conventions

- Studio owns publishing behavior, agents, skills, playbooks, schemas, state operations, and its versioned release artifact.
- agent-ops owns thin scheduled invocation, provider runtime/isolation, artifact and image pins, and monitoring.
- susuwatari-config owns host provisioning and prerequisites.
- The vault and private instance configuration own personal source material, publishing records, and operator-specific paths. Never commit those to this repository.

Keep workflow mechanics in the shared TypeScript operations; role judgment belongs in the packaged Markdown. A topic choice requires the author's explicit selection. Selection creates a resumable preparing article; only actual research/development supplies preparation. Do not infer an endorsed belief from topic selection.

Same-host locks and atomic record replacement do not provide distributed transactions through Obsidian Sync. Scheduled runs append research records; one interactive writer owns workspace state. Changes to that boundary require demonstrated conflict behavior.

## Key files

| File | Purpose |
| ------ | ------- |
| `src/schema-export.ts` | Generates committed `schemas/*.schema.json`; change source schemas and rebuild instead of editing generated files. |
| `plugins/studio/backend.md` | Resolves the backend from private instance configuration without assuming checkout location or session cwd. |
| `src/index.ts` | Public state operations shared by the CLI and future adapters. |
