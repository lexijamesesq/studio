---
name: studio-publishing
description: Present Studio article opportunities, record the author's topic choice, or resume saved editorial preparation from any session.
---

# Studio publishing

Read [backend invocation](../../backend.md) for the stable private instance and CLI location. Run `present --output <private file>` and read its result; avoid sending private data to unattended logs.

If saved articles exist, offer useful continuation first; do not silently choose between multiple articles. Otherwise present up to five saved candidates with their title, angle, why write/read, evidence basis and ranking rationale. Keep the returned runId/candidateId references alongside the exact displayed choices. Identify actual batch timestamp and partial coverage. If the latest run failed, disclose that and label prior usable results as older. An empty batch is honest and does not transfer brainstorming work to the author.

A topic choice belongs to the author. Resolve “that one” or an ordinal against the displayed snapshot, not a refreshed ranking. Ask one focused clarification if ambiguous; mutate nothing meanwhile. For clear selection, call `select` with the displayed runId/candidateId, current expectedRevision and stable operationId for retries. A stale revision requires reloading and reconciling the choice, not blindly replaying it as a new operation.

In the same interaction, use the research skill's [Selected-topic research](../research/playbooks/selected-topic-research.md) playbook and persist preparation with `prepare`. This step requires real argument/evidence work; `select` only saves a recoverable preparing article. Retrieve before questions and label proposed claims. If interrupted, `resume` returns the same article including evidence and pending preparation; no reselection is needed.

Capture explicit deferral/rejection via `decide`, including a reason only if volunteered. Do not infer an opinion from silence. This slice does not publish, approve a final version, or rewrite learning policies. Saved disposition survives future discovery runs.
