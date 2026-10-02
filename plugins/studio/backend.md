# Backend invocation

The plugin contains role and workflow instructions; the TypeScript backend is installed separately once. Marketplace caching need not contain the repository.

Resolve private instance config from `STUDIO_CONFIG` when set, otherwise `$HOME/.config/studio/instance.json`. Read that file and use its absolute `packageRoot` to invoke `node <packageRoot>/dist/cli.js`. Never infer the backend from cwd or traverse out of a plugin cache. A setup-time instance can point to a local built repository; no global npm install is required. Missing instance/backend is a setup error, not a request for the author to administer records every session. Do not invent config or broaden sources.

All commands accept `--config <absolute instance file>`. Config schema and output schemas live under `<packageRoot>/schemas/`. Private-bearing results use `--output <private file>`; read that file into the interactive session. Pass paths as quoted arguments, not interpolated shell expressions.

- `present` / `resume`: saved candidates, displayed stable run/candidate references, current revision, active articles.
- `discovery-input --run-id <id> --output <file>`: read-only staged registry/source/history snapshot.
- `discovery-validate --input <model result> --input-context <staged snapshot>`: validate only.
- `discovery-save --input <model result> --input-context <staged snapshot>`: commit validated assessment and snapshot.
- `discovery-fail --run-id <id> --message <bounded diagnostic>`: preserve failure without replacing usable results.
- `select --input <file>`: `{operationId,expectedRevision,candidateId,runId}`.
- `decide --input <file>`: selection fields plus `action: deferred|rejected` and optional reason.
- `prepare --input <file>`: `{operationId,expectedRevision,articleId,preparation:{proposedArgument,supportingEvidence,conflictingEvidence,gaps,nextInteraction}}`. Evidence is `{sourceId,excerpt,interpretation}`.

Use a new stable operation ID for each intended mutation; retries retain ID and payload. A stale revision requires reload/reconciliation. IDs refer to the displayed assessment, not a refreshed rank. Same-host locks and atomic workspace writes do not make Obsidian Sync a distributed transaction coordinator. One interactive writer owns workspace state.
