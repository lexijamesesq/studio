import { readdir, readFile, realpath } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { z } from "zod";
import {
  type Candidate,
  type Config,
  configSchema,
  decisionSchema,
  discoverySchema,
  prepareSchema,
  selectSchema,
} from "./schema.js";
import { atomicRecord, exists, hash, locked, readRecord, within } from "./store.js";

export * from "./schema.js";

const sourceInput = z.object({
  id: z.string(),
  path: z.string(),
  url: z.string().optional(),
  publicUse: z.enum(["private", "paraphrase", "quotable"]),
  status: z.enum(["read", "unavailable"]),
  text: z.string(),
  contentHash: z.string(),
  detail: z.string(),
});
const inputSchema = z.object({
  schemaVersion: z.literal(1),
  runId: z.string(),
  inputHash: z.string(),
  sources: z.array(sourceInput),
  context: z.array(z.object({ path: z.string(), text: z.string() })),
  history: z.array(z.unknown()),
});
const runSchema = z.object({
  schemaVersion: z.literal(1),
  runId: z.string(),
  inputHash: z.string(),
  status: z.enum(["complete", "partial", "failed"]),
  createdAt: z.string(),
  coverage: z.array(z.unknown()),
  candidates: z.array(
    z.object({
      candidateId: z.string(),
      candidate: z.lazy(() => discoverySchema.shape.candidates.element),
      evidenceSources: z.array(sourceInput),
    }),
  ),
  diagnostic: z.string().optional(),
});
const stateSchema = z.object({
  schemaVersion: z.literal(1),
  revision: z.number().int().nonnegative(),
  operations: z.record(z.string(), z.string()),
  decisions: z.array(
    z.object({
      operationId: z.string(),
      candidateId: z.string(),
      runId: z.string(),
      action: z.enum(["selected", "deferred", "rejected"]),
      reason: z.string().optional(),
      at: z.string(),
    }),
  ),
  articles: z.array(
    z.object({
      articleId: z.string(),
      candidateId: z.string(),
      runId: z.string(),
      status: z.enum(["preparing", "prepared"]),
      candidate: discoverySchema.shape.candidates.element,
      evidenceSources: z.array(sourceInput),
      preparation: prepareSchema.shape.preparation.optional(),
    }),
  ),
});
type State = z.infer<typeof stateSchema>;
const empty = (): State => ({
  schemaVersion: 1,
  revision: 0,
  operations: {},
  decisions: [],
  articles: [],
});
export async function loadConfig(path: string) {
  return configSchema.parse(JSON.parse(await readFile(path, "utf8")));
}
export class Studio {
  constructor(readonly config: Config) {
    this.config = configSchema.parse(config);
  }
  private async path(name: string) {
    const vault = await realpath(this.config.vaultRoot);
    const studio = resolve(vault, "Studio");
    const actualStudio = await realpath(studio);
    if (actualStudio !== studio) throw new Error("Studio root cannot be a symlink");
    const recordPath = await within(
      this.config.vaultRoot,
      `${this.config.recordsPath}/${name}`,
      true,
    );
    let parent = recordPath;
    while (true) {
      try {
        parent = await realpath(parent);
        break;
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
        parent = resolve(parent, "..");
      }
    }
    if (relative(studio, parent).startsWith("..")) throw new Error("Record path escaped Studio");
    return recordPath;
  }
  private async state(): Promise<State> {
    const p = await this.path("workspace.md");
    return (await exists(p)) ? stateSchema.parse(await readRecord(p)) : empty();
  }
  private async runs() {
    const p = await this.path("runs");
    if (!(await exists(p))) return [];
    const files = (await readdir(p)).filter((f) => f.endsWith(".md")).sort();
    return Promise.all(
      files.map(async (f) => runSchema.parse(await readRecord(await this.path(`runs/${f}`)))),
    );
  }
  async discoveryInput(runId: string, persistSnapshot = true) {
    selectSchema.shape.runId.parse(runId);
    const cached = await this.path(`inputs/${runId}.md`);
    if (await exists(cached)) return inputSchema.parse(await readRecord(cached));
    const sources = await Promise.all(
      this.config.sources.map(async (s) => {
        try {
          let text: string;
          if (s.url) {
            const url = new URL(s.url);
            if (
              url.protocol !== "https:" ||
              url.username ||
              url.password ||
              !url.hostname.includes(".") ||
              /^(localhost|.*\.local|.*\.localhost)$/.test(url.hostname) ||
              /^[\d.]+$/.test(url.hostname) ||
              url.hostname.includes(":")
            )
              throw new Error("Public HTTPS hostname required");
            const response = await fetch(url, {
              signal: AbortSignal.timeout(10000),
              redirect: "error",
            });
            if (!response.ok) throw new Error("Public source unavailable");
            const reader = response.body?.getReader();
            if (!reader) throw new Error("Empty source");
            const chunks: Uint8Array[] = [];
            let size = 0;
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              size += value.length;
              if (size > 200000) {
                await reader.cancel();
                throw new Error("Source exceeds 200 KB bound");
              }
              chunks.push(value);
            }
            text = Buffer.concat(chunks).toString("utf8");
          } else {
            const p = await within(this.config.vaultRoot, s.path ?? "");
            const raw = await readFile(p);
            if (raw.length > 200000) throw new Error("Source exceeds 200 KB bound");
            text = raw.toString("utf8");
          }
          return {
            ...s,
            path: s.path ?? s.url ?? "",
            status: "read" as const,
            text,
            contentHash: hash(text),
            detail: "Read configured source",
          };
        } catch {
          return {
            ...s,
            path: s.path ?? s.url ?? "",
            status: "unavailable" as const,
            text: "",
            contentHash: hash(""),
            detail: "Configured source unavailable or outside boundary",
          };
        }
      }),
    );
    const context = await Promise.all(
      [...this.config.intentPaths, ...this.config.lessonPaths].map(async (path) => ({
        path,
        text: await readFile(await within(this.config.vaultRoot, path), "utf8"),
      })),
    );
    const history = (await this.runs()).map((r) => ({
      runId: r.runId,
      status: r.status,
      candidates: r.candidates.map((c) => ({
        candidateId: c.candidateId,
        topicKey: c.candidate.topicKey,
        angleKey: c.candidate.angleKey,
        title: c.candidate.title,
      })),
    }));
    const payload = {
      schemaVersion: 1 as const,
      runId,
      sources,
      context,
      history: [...history, { decisions: (await this.state()).decisions }],
    };
    const input = { ...payload, inputHash: hash(payload) };
    if (persistSnapshot)
      await locked(await this.path("inputs"), async () => {
        const p = await this.path(`inputs/${runId}.md`);
        if (await exists(p)) {
          const previous = inputSchema.parse(await readRecord(p));
          if (previous.inputHash !== input.inputHash)
            throw new Error("Run input changed; use a new run ID");
        } else
          await atomicRecord(
            p,
            input,
            `# Discovery input ${runId}\n\nPrivate source snapshot for bounded research.`,
          );
      });
    return input;
  }
  async saveDiscovery(raw: unknown, validateOnly = false, stagedSnapshot?: unknown) {
    const result = discoverySchema.parse(raw);
    const input = inputSchema.parse(
      stagedSnapshot ?? (await readRecord(await this.path(`inputs/${result.runId}.md`))),
    );
    if (input.runId !== result.runId) throw new Error("Snapshot run mismatch");
    if (
      hash({
        schemaVersion: input.schemaVersion,
        runId: input.runId,
        sources: input.sources,
        context: input.context,
        history: input.history,
      }) !== input.inputHash
    )
      throw new Error("Input snapshot integrity failure");
    for (const source of input.sources) {
      const configuredSource = this.config.sources.find((s) => s.id === source.id);
      if (
        !configuredSource ||
        source.path !== (configuredSource.path ?? configuredSource.url) ||
        source.publicUse !== configuredSource.publicUse
      )
        throw new Error("Source registry changed; use a new run");
    }
    if (input.sources.length !== this.config.sources.length)
      throw new Error("Source registry changed; use a new run");
    if (input.inputHash !== result.inputHash) throw new Error("Discovery input hash mismatch");
    const configured = new Set(input.sources.map((s) => s.id));
    if (
      result.coverage.length !== configured.size ||
      new Set(result.coverage.map((c) => c.sourceId)).size !== configured.size ||
      result.coverage.some((c) => !configured.has(c.sourceId))
    )
      throw new Error("Coverage must account for every source exactly once");
    if (result.status === "complete" && result.coverage.some((c) => c.status !== "read"))
      throw new Error("Complete discovery cannot have missing coverage");
    for (const c of result.coverage) {
      if (c.status === "read" && input.sources.find((s) => s.id === c.sourceId)?.status !== "read")
        throw new Error("Cannot claim unavailable source read");
    }
    const identities = new Set<string>();
    const candidates = result.candidates.map((candidate) => {
      const candidateId = `c_${hash([candidate.topicKey, candidate.angleKey]).slice(0, 24)}`;
      if (identities.has(candidateId)) throw new Error("Duplicate candidate angle");
      identities.add(candidateId);
      this.validateEvidence(candidate.evidence, input.sources);
      if (
        candidate.evidence.some(
          (e) => result.coverage.find((c) => c.sourceId === e.sourceId)?.status !== "read",
        )
      )
        throw new Error("Candidate uses source missing from read coverage");
      return {
        candidateId,
        candidate,
        evidenceSources: input.sources.filter((s) =>
          candidate.evidence.some((e) => e.sourceId === s.id),
        ),
      };
    });
    const data = {
      schemaVersion: 1 as const,
      runId: result.runId,
      inputHash: result.inputHash,
      status: result.status,
      coverage: result.coverage,
      candidates,
    };
    if (validateOnly)
      return {
        runId: result.runId,
        status: result.status,
        count: candidates.length,
        validated: true,
      };
    return locked(await this.path("runs"), async () => {
      const p = await this.path(`runs/${result.runId}.md`);
      if (await exists(p)) {
        const old = runSchema.parse(await readRecord(p));
        const { createdAt: _, ...rest } = old;
        if (hash(rest) !== hash(data))
          throw new Error("Run already committed with different result");
        return {
          runId: old.runId,
          status: old.status,
          count: old.candidates.length,
          ref: `${this.config.recordsPath}/runs/${old.runId}.md`,
        };
      }
      const snapshotPath = await this.path(`inputs/${result.runId}.md`);
      if (await exists(snapshotPath)) {
        if (inputSchema.parse(await readRecord(snapshotPath)).inputHash !== input.inputHash)
          throw new Error("Conflicting input snapshot");
      } else await atomicRecord(snapshotPath, input, `# Discovery input ${result.runId}`);
      await atomicRecord(
        p,
        { ...data, createdAt: new Date().toISOString() },
        `# Topic discovery ${result.runId}\n\n${candidates.map((c) => `## ${c.candidate.title}\n\n${c.candidate.angle}\n\nWhy write: ${c.candidate.whyWrite}\n\nWhy read: ${c.candidate.whyRead}`).join("\n\n")}`,
      );
      return {
        runId: result.runId,
        status: result.status,
        count: candidates.length,
        ref: `${this.config.recordsPath}/runs/${result.runId}.md`,
      };
    });
  }
  private validateEvidence(
    evidence: Candidate["evidence"],
    sources: z.infer<typeof sourceInput>[],
  ) {
    for (const e of evidence) {
      const s = sources.find((s) => s.id === e.sourceId);
      if (s?.status !== "read" || !s.text.includes(e.excerpt))
        throw new Error("Evidence must quote an available configured source exactly");
    }
  }
  async failDiscovery(runId: string, diagnostic: string) {
    selectSchema.shape.runId.parse(runId);
    if (!diagnostic.trim()) throw new Error("Failure diagnostic required");
    return locked(await this.path("runs"), async () => {
      const p = await this.path(`runs/${runId}.md`);
      if (await exists(p)) throw new Error("Run already committed");
      await atomicRecord(
        p,
        {
          schemaVersion: 1,
          runId,
          inputHash: "",
          status: "failed",
          createdAt: new Date().toISOString(),
          coverage: [],
          candidates: [],
          diagnostic,
        },
        `# Failed discovery ${runId}\n\n${diagnostic}`,
      );
      return { runId, status: "failed" };
    });
  }
  async present() {
    const state = await this.state();
    const runs = (await this.runs()).sort(
      (a, b) => b.createdAt.localeCompare(a.createdAt) || b.runId.localeCompare(a.runId),
    );
    const latest = runs[0];
    const usable = runs.find((r) => r.status !== "failed");
    const decisions = new Map(state.decisions.map((d) => [d.candidateId, d.action]));
    return {
      revision: state.revision,
      latestRun: latest
        ? {
            runId: latest.runId,
            status: latest.status,
            createdAt: latest.createdAt,
            diagnostic: latest.diagnostic,
          }
        : null,
      batch: usable
        ? {
            runId: usable.runId,
            status: usable.status,
            createdAt: usable.createdAt,
            coverage: usable.coverage,
          }
        : null,
      candidates: usable?.candidates.filter((c) => !decisions.has(c.candidateId)).slice(0, 5) ?? [],
      articles: state.articles,
    };
  }
  private async mutate<T>(
    request: { operationId: string; expectedRevision: number },
    action: (state: State) => Promise<T>,
  ) {
    return locked(await this.path("state-lock"), async () => {
      const state = await this.state();
      const digest = hash(request);
      const old = state.operations[request.operationId];
      if (old) {
        if (old !== digest) throw new Error("Operation ID reused with different payload");
        return { revision: state.revision, replayed: true, articles: state.articles };
      }
      if (state.revision !== request.expectedRevision)
        throw new Error("Stale workspace revision; reload before deciding");
      const result = await action(state);
      state.operations[request.operationId] = digest;
      state.revision++;
      await atomicRecord(
        await this.path("workspace.md"),
        state,
        `# Publishing workspace\n\nRevision ${state.revision}. ${state.articles.length} article(s).\n\n${state.articles.map((a) => `## ${a.candidate.title}\n\nStatus: ${a.status}\n\n${a.preparation?.proposedArgument ?? "Preparation pending; selection does not endorse a thesis."}`).join("\n\n")}`,
      );
      return { revision: state.revision, replayed: false, result };
    });
  }
  private async candidate(runId: string, candidateId: string) {
    const run = runSchema.parse(await readRecord(await this.path(`runs/${runId}.md`)));
    const candidate = run.candidates.find((c) => c.candidateId === candidateId);
    if (!candidate) throw new Error("Candidate not present in displayed assessment");
    return candidate;
  }
  async select(raw: unknown) {
    const request = selectSchema.parse(raw);
    return this.mutate(request, async (state) => {
      const found = await this.candidate(request.runId, request.candidateId);
      const existing = state.articles.find((a) => a.candidateId === request.candidateId);
      if (existing) return existing;
      const last = state.decisions.filter((d) => d.candidateId === request.candidateId).at(-1);
      if (last && last.action !== "selected")
        throw new Error(
          "Candidate was deferred or rejected; explicit reconsideration is outside this slice",
        );
      state.decisions.push({ ...request, action: "selected", at: new Date().toISOString() });
      const article = {
        articleId: `a_${request.candidateId.slice(2)}`,
        candidateId: request.candidateId,
        runId: request.runId,
        status: "preparing" as const,
        candidate: found.candidate,
        evidenceSources: found.evidenceSources,
      };
      state.articles.push(article);
      return article;
    });
  }
  async decide(raw: unknown) {
    const request = decisionSchema.parse(raw);
    return this.mutate(request, async (state) => {
      await this.candidate(request.runId, request.candidateId);
      if (state.articles.some((a) => a.candidateId === request.candidateId))
        throw new Error("Active article cannot be silently disposed");
      state.decisions.push({ ...request, at: new Date().toISOString() });
      return { candidateId: request.candidateId, action: request.action };
    });
  }
  async prepare(raw: unknown) {
    const request = prepareSchema.parse(raw);
    return this.mutate(request, async (state) => {
      const article = state.articles.find((a) => a.articleId === request.articleId);
      if (!article) throw new Error("Unknown article");
      this.validateEvidence(
        [...request.preparation.supportingEvidence, ...request.preparation.conflictingEvidence],
        article.evidenceSources,
      );
      article.preparation = request.preparation;
      article.status = "prepared";
      return article;
    });
  }
}
