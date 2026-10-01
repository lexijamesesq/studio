# Studio publishing slice

A local marketplace plugin and strict TypeScript operations for scheduled discovery, author selection and saved editorial preparation. Node 22+, npm, Vitest, Biome and estate CI. No model SDK, database or daemon. Claude/Codex can read the same role and skill Markdown; client loading and invocation are separate integrations. Claude marketplace agent dispatch and hook semantics are not assumed available in Codex.

## Ownership

Studio owns publishing behavior, agents, skills, playbooks, schemas, state operations, and the versioned release artifact. agent-ops owns thin scheduled invocation, provider runtime isolation, artifact/image pins, and monitoring. susuwatari-config owns host provisioning and prerequisites. Personal sources, publishing records, and instance configuration live in the vault or private configuration, outside this repository.

The official estate seed provides the CI floor, trusted gate, and standard checks; this implementation adds package tests. Enrollment and caller rollout PRs are pending through upstream `new-repo.sh`. Required branch rules, Margot review, and Ollie merge remain unproven until rollout and the estate proof PR.

## Local preview

`npm ci && npm run build` builds the CLI. Claude local preview: `claude --plugin-dir /absolute/path/to/studio/plugins/studio`. Marketplace manifest is `.claude-plugin/marketplace.json`; publish/install is not performed by this prototype. For Codex, load `plugins/studio/skills/publishing/SKILL.md` directly and read linked files, or install those skill directories through the client's supported skill installation. No global client configuration is changed.

Copy `samples/instance.sample.json`, fill its placeholder paths, and configure once at `~/.config/studio/instance.json`, or override with `STUDIO_CONFIG` / `--config`. Include absolute `packageRoot` for cached plugin backend resolution; the CLI also defaults to that instance independently of cwd. No global install or shell startup edits are needed. Example (synthetic paths):

```json
{"schemaVersion":1,"packageRoot":"/absolute/studio/package","vaultRoot":"/absolute/vault","recordsPath":"Studio/Publishing","sources":[{"id":"method","path":"Studio/Knowledge/methodology.md","publicUse":"private"},{"id":"domain","url":"https://example.org/domain.txt","publicUse":"quotable"}],"intentPaths":[],"lessonPaths":[]}
```

Only configured files are read. No recursive mining. Public sources require explicit HTTPS URLs, bounded fetches (10 seconds, 200 KB), no redirects, no credentials, and no literal IP/local hostnames. Network/DNS policy remains infrastructure's responsibility; this is not an untrusted URL proxy. Fetch failure becomes unavailable coverage. Source markup/instructions remain untrusted data. Intent and lessons are separately configured context, bounded by the operator's selection. Config and schema artifacts contain no personal data.

## Public commands

Invoke `node /absolute/package/dist/cli.js COMMAND --config /private/instance.json`. All private-bearing commands should use `--output /private/result.json`; this writes mode 0600 and prints only save status. `discovery-input` requires output. Error messages do not dump source text.

- `discovery-input --run-id logical_run --output input.json`: stages configured inputs, history and hashes without vault writes. Repeated committed run ID reuses its immutable snapshot.
- Model consumes that file and research playbook, emits `schemas/discovery-result.schema.json` JSON to private staging. No TS function pretends to do model research.
- `discovery-validate --input result.json --input-context input.json`: same validation as save, no run commit.
- `discovery-save --input result.json --input-context input.json`: immutable dated assessment, idempotent for identical run payload; conflicting retry fails. Save output is content-free run status/count/ref.
- `discovery-fail --run-id logical_run --message "bounded diagnostic"`: append failed run, preserve prior success. Do not put private model text in diagnostics.
- `present --output choices.json` / `resume --output state.json`: active articles, latest run health, usable batch, current non-disposed shortlist and workspace revision.
- `select --input selection.json`: `{operationId,expectedRevision,candidateId,runId}` from the displayed choice. Returns one preparing article and new revision.
- `decide --input decision.json`: same fields plus `action: deferred|rejected` and optional volunteered `reason`.
- `prepare --input preparation.json`: `{operationId,expectedRevision,articleId,preparation:{proposedArgument,supportingEvidence,conflictingEvidence,gaps,nextInteraction}}`. Actual development is performed by the interactive agent before this save.

Evidence is `{sourceId,excerpt,interpretation}`. Exact excerpts must match available source snapshots; provenance and public-use restrictions follow evidence into the article. Preparation currently uses the selected assessment's attached evidence sources, and records additional source needs as gaps. Generated JSON schemas live in `schemas/`; exported `Studio` class exposes the same operations for future MCP/UI adapters. An MCP server is not required for this slice and has not been introduced.

## Persistence and guarantees

Records are Markdown YAML frontmatter plus readable summaries. Immutable `inputs/<runId>.md` and `runs/<runId>.md` preserve research history. `workspace.md` owns interactive decision events and article/preparation state. Discovery never rewrites dispositions. Stable identity hashes topicKey + angleKey; title wording does not define identity. Semantic identity is researcher judgment, not a fuzzy algorithm silently merging distinct angles.

Selection and article creation commit together in one atomic workspace replacement. A crash before commit leaves neither; after commit resume finds the preparing article. There is no multi-record handoff to reconcile. Idempotent operations bind ID to payload; repeated selection creates no second article. Expected revisions and same-host exclusive directory locks prevent local stale/lost updates. A leftover lock fails closed; remove it only after establishing no writer remains.

These are **same-host guarantees**. Obsidian Sync is not a transaction coordinator. Scheduled research writes append-only run/input records; one interactive writer owns workspace state. Concurrent editorial writers on different machines are unsupported. Unexpected Sync conflict files require reconciliation; actual unattended execution/sync acceptance remains a deployment proof. No assertion of cross-host locks or transactional delivery is made.

`complete` requires every configured source read; `partial` exposes missing coverage; failed runs preserve the last usable batch. Empty successful runs supersede older candidates rather than silently recycling stale suggestions. Disposed candidates are hidden, never reset by title/rank changes. Explicit reconsideration, article completion/publishing, arbitrary supplemental research ingestion and advanced learning policy are future operations.

## Checks

`npm run check`, `npm run typecheck`, `npm run build`, then `npm test` (the CLI integration tests require built output). Tests use temporary synthetic vaults, guard invalid evidence, source escape, stale revisions, retries, dispositions and interrupted preparation. Runtime JSON validation proves mechanics, not editorial quality. Real model quality and production scheduling remain acceptance work, not claims established by fixtures.
