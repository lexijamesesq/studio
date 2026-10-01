import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { Ajv } from "ajv";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type Config, configSchema, Studio } from "../src/index.js";

const roots: string[] = [];
afterEach(async () => {
  vi.unstubAllGlobals();
  await Promise.all(roots.splice(0).map((p) => rm(p, { recursive: true, force: true })));
});
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "studio-test-"));
  roots.push(root);
  await mkdir(join(root, "Studio", "Knowledge"), { recursive: true });
  await writeFile(
    join(root, "Studio", "Knowledge", "method.md"),
    "Judgment works inside explicit intent and stop conditions. Control can obscure responsibility.",
  );
  const config: Config = {
    schemaVersion: 1,
    vaultRoot: root,
    recordsPath: "Studio/Publishing",
    sources: [{ id: "method", path: "Studio/Knowledge/method.md", publicUse: "private" }],
    intentPaths: [],
    lessonPaths: [],
  };
  const studio = new Studio(config);
  const input = await studio.discoveryInput("r1");
  const candidate = {
    topicKey: "agent-judgment",
    angleKey: "guardrails-v-control",
    title: "Who owns judgment?",
    angle: "Guardrails can enable agency",
    reader: "Design leaders",
    whyWrite: "A documented control tradeoff",
    whyRead: "Choose meaningful boundaries",
    rankingRationale: "Grounded in actual method",
    evidence: [
      {
        sourceId: "method",
        excerpt: "Judgment works inside explicit intent and stop conditions.",
        interpretation: "Intent can shape judgment",
      },
    ],
    gaps: ["Need a concrete implementation example"],
  };
  const result = {
    schemaVersion: 1,
    runId: "r1",
    inputHash: input.inputHash,
    status: "complete",
    coverage: [{ sourceId: "method", status: "read", detail: "Read configured method" }],
    candidates: [candidate],
  };
  return { root, config, studio, input, candidate, result };
}
async function selected() {
  const f = await fixture();
  await f.studio.saveDiscovery(f.result);
  const presented = await f.studio.present();
  const c = presented.candidates[0];
  if (!c) throw new Error("No candidate");
  const request = {
    operationId: "op1",
    expectedRevision: 0,
    candidateId: c.candidateId,
    runId: "r1",
  };
  await f.studio.select(request);
  return { ...f, request, c };
}
describe("discovery mechanics", () => {
  it("rejects malformed and invented evidence without run commit", async () => {
    const f = await fixture();
    await expect(
      f.studio.saveDiscovery({
        ...f.result,
        candidates: [
          {
            ...f.candidate,
            evidence: [{ sourceId: "method", excerpt: "Invented quote", interpretation: "Wrong" }],
          },
        ],
      }),
    ).rejects.toThrow("Evidence");
    expect((await f.studio.present()).batch).toBeNull();
    await expect(f.studio.saveDiscovery({ ...f.result, status: "arbitrary" })).rejects.toThrow();
  });
  it("validates all coverage exactly once and complete status", async () => {
    const f = await fixture();
    await expect(f.studio.saveDiscovery({ ...f.result, coverage: [] })).rejects.toThrow("Coverage");
    await expect(
      f.studio.saveDiscovery({
        ...f.result,
        coverage: [{ sourceId: "method", status: "unavailable", detail: "missing" }],
      }),
    ).rejects.toThrow("Complete");
  });
  it("identical retry is idempotent; conflicting payload is not", async () => {
    const f = await fixture();
    expect(await f.studio.saveDiscovery(f.result)).toEqual(await f.studio.saveDiscovery(f.result));
    await expect(
      f.studio.saveDiscovery({ ...f.result, candidates: [{ ...f.candidate, title: "Changed" }] }),
    ).rejects.toThrow("different result");
    expect(await f.studio.discoveryInput("r1")).toEqual(f.input);
  });
  it("title refresh preserves identity, distinct source-sharing angles remain distinct", async () => {
    const f = await fixture();
    await f.studio.saveDiscovery(f.result);
    const old = (await f.studio.present()).candidates[0]?.candidateId;
    const input = await f.studio.discoveryInput("r2");
    await f.studio.saveDiscovery({
      ...f.result,
      runId: "r2",
      inputHash: input.inputHash,
      candidates: [
        { ...f.candidate, title: "Fresh wording" },
        { ...f.candidate, angleKey: "accountability", title: "Accountability" },
      ],
    });
    const list = (await f.studio.present()).candidates;
    expect(list).toHaveLength(2);
    expect(list[0]?.candidateId).toBe(old);
    expect(list[1]?.candidateId).not.toBe(old);
  });
  it("failed newest result preserves prior usable batch honestly", async () => {
    const f = await fixture();
    await f.studio.saveDiscovery(f.result);
    await f.studio.failDiscovery("r2", "bounded failure");
    const p = await f.studio.present();
    expect(p.latestRun?.status).toBe("failed");
    expect(p.batch?.runId).toBe("r1");
  });
  it("empty successful result does not recycle older topics", async () => {
    const f = await fixture();
    await f.studio.saveDiscovery(f.result);
    const input = await f.studio.discoveryInput("r2");
    await f.studio.saveDiscovery({
      ...f.result,
      runId: "r2",
      inputHash: input.inputHash,
      candidates: [],
    });
    expect((await f.studio.present()).candidates).toEqual([]);
  });
  it("missing source produces explicit partial coverage", async () => {
    const f = await fixture();
    await rm(join(f.root, "Studio/Knowledge/method.md"));
    const input = await f.studio.discoveryInput("missing");
    expect(input.sources[0]?.status).toBe("unavailable");
    await f.studio.saveDiscovery({
      ...f.result,
      runId: "missing",
      inputHash: input.inputHash,
      status: "partial",
      coverage: [
        { sourceId: "method", status: "unavailable", detail: "Missing configured source" },
      ],
      candidates: [],
    });
    expect((await f.studio.present()).batch?.status).toBe("partial");
  });
  it("rejects source symlink outside vault without reading it", async () => {
    const f = await fixture();
    const external = await mkdtemp(join(tmpdir(), "studio-external-"));
    roots.push(external);
    await writeFile(join(external, "secret.md"), "Secret");
    await symlink(join(external, "secret.md"), join(f.root, "Studio", "Knowledge", "escape.md"));
    const studio = new Studio({
      ...f.config,
      sources: [{ id: "escape", path: "Studio/Knowledge/escape.md", publicUse: "private" }],
    });
    expect((await studio.discoveryInput("escape")).sources[0]?.status).toBe("unavailable");
  });
  it("rejects records symlink escaping Studio even inside vault", async () => {
    const f = await fixture();
    await mkdir(join(f.root, "Wiki"));
    await symlink(join(f.root, "Wiki"), join(f.root, "Studio", "Elsewhere"));
    const studio = new Studio({ ...f.config, recordsPath: "Studio/Elsewhere" });
    await expect(studio.discoveryInput("escape")).rejects.toThrow("escaped Studio");
  });
  it("approved public source snapshots support identical retry and unavailable network coverage", async () => {
    const f = await fixture();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () => new Response("Public evidence about consequential boundaries", { status: 200 }),
      ),
    );
    const studio = new Studio({
      ...f.config,
      sources: [{ id: "public", url: "https://example.org/domain.txt", publicUse: "quotable" }],
    });
    const snapshot = await studio.discoveryInput("public", false);
    const result = {
      ...f.result,
      runId: "public",
      inputHash: snapshot.inputHash,
      coverage: [{ sourceId: "public", status: "read", detail: "Explicit public source" }],
      candidates: [
        {
          ...f.candidate,
          evidence: [
            { sourceId: "public", excerpt: "Public evidence", interpretation: "Public source" },
          ],
        },
      ],
    };
    expect(await studio.saveDiscovery(result, false, snapshot)).toEqual(
      await studio.saveDiscovery(result, false, snapshot),
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    expect((await studio.discoveryInput("offline", false)).sources[0]?.status).toBe("unavailable");
  });
  it("rejects traversal and out-of-Studio records in config", () => {
    expect(() =>
      configSchema.parse({
        schemaVersion: 1,
        vaultRoot: "/tmp",
        recordsPath: "Wiki/Data",
        sources: [{ id: "x", path: "../secret", publicUse: "private" }],
      }),
    ).toThrow();
  });
  it("staged input validates without writes and tampering fails", async () => {
    const f = await fixture();
    await rm(join(f.root, "Studio/Publishing"), { recursive: true });
    const snapshot = await f.studio.discoveryInput("staged", false);
    await expect(readFile(join(f.root, "Studio/Publishing/inputs/staged.md"))).rejects.toThrow();
    const result = { ...f.result, runId: "staged", inputHash: snapshot.inputHash };
    expect(await f.studio.saveDiscovery(result, true, snapshot)).toMatchObject({ validated: true });
    await expect(
      f.studio.saveDiscovery(result, true, {
        ...snapshot,
        sources: [{ ...snapshot.sources[0], text: "Tampered" }],
      }),
    ).rejects.toThrow("integrity");
    await f.studio.saveDiscovery(result, false, snapshot);
    expect((await f.studio.present()).batch?.runId).toBe("staged");
  });
});
describe("selection and editorial continuity", () => {
  it("repeated selection and fresh-session resume yield exactly one article", async () => {
    const f = await selected();
    expect(await f.studio.select(f.request)).toMatchObject({ replayed: true });
    await f.studio.select({ ...f.request, operationId: "op2", expectedRevision: 1 });
    const p = await new Studio(f.config).present();
    expect(p.articles).toHaveLength(1);
    expect(p.articles[0]?.status).toBe("preparing");
    expect(p.articles[0]?.evidenceSources[0]?.publicUse).toBe("private");
  });
  it("stale writes and reused operation payloads fail", async () => {
    const f = await selected();
    await expect(f.studio.select({ ...f.request, operationId: "stale" })).rejects.toThrow("Stale");
    await expect(f.studio.select({ ...f.request, runId: "r2" })).rejects.toThrow("reused");
    expect((await f.studio.present()).revision).toBe(1);
  });
  it("unknown/ambiguous selection mutates nothing", async () => {
    const f = await fixture();
    await f.studio.saveDiscovery(f.result);
    await expect(
      f.studio.select({
        operationId: "unknown",
        expectedRevision: 0,
        candidateId: "second",
        runId: "r1",
      }),
    ).rejects.toThrow("not present");
    expect((await f.studio.present()).revision).toBe(0);
  });
  it("deferred and rejected choices survive reassessment", async () => {
    const f = await fixture();
    await f.studio.saveDiscovery(f.result);
    const c = (await f.studio.present()).candidates[0];
    await f.studio.decide({
      operationId: "defer",
      expectedRevision: 0,
      candidateId: c?.candidateId,
      runId: "r1",
      action: "deferred",
    });
    const input = await f.studio.discoveryInput("r2");
    await f.studio.saveDiscovery({ ...f.result, runId: "r2", inputHash: input.inputHash });
    expect((await f.studio.present()).candidates).toHaveLength(0);
    await expect(
      f.studio.select({
        operationId: "select",
        expectedRevision: 1,
        candidateId: c?.candidateId,
        runId: "r2",
      }),
    ).rejects.toThrow("deferred");
  });
  it("persists actual preparation and resumes it, without invented endorsement", async () => {
    const f = await selected();
    const a = (await f.studio.present()).articles[0];
    const preparation = {
      proposedArgument: "Proposed: guardrails create room for judgment",
      supportingEvidence: f.candidate.evidence,
      conflictingEvidence: [],
      gaps: ["Need counterexample"],
      nextInteraction: "Where did control obscure ownership in your work?",
    };
    await f.studio.prepare({
      operationId: "prepare",
      expectedRevision: 1,
      articleId: a?.articleId,
      preparation,
    });
    expect((await new Studio(f.config).present()).articles[0]).toMatchObject({
      status: "prepared",
      preparation,
    });
  });
  it("planted unconfigured preparation evidence is rejected", async () => {
    const f = await selected();
    const a = (await f.studio.present()).articles[0];
    await expect(
      f.studio.prepare({
        operationId: "bad-prep",
        expectedRevision: 1,
        articleId: a?.articleId,
        preparation: {
          proposedArgument: "Claim",
          supportingEvidence: [
            { sourceId: "unconfigured", excerpt: "Outside", interpretation: "Claim" },
          ],
          conflictingEvidence: [],
          gaps: [],
          nextInteraction: "Question",
        },
      }),
    ).rejects.toThrow("Evidence");
    expect((await f.studio.present()).articles[0]?.status).toBe("preparing");
  });
  it("discovery retrieves explicit disposition and volunteered reason", async () => {
    const f = await fixture();
    await f.studio.saveDiscovery(f.result);
    const c = (await f.studio.present()).candidates[0];
    await f.studio.decide({
      operationId: "reason",
      expectedRevision: 0,
      candidateId: c?.candidateId,
      runId: "r1",
      action: "rejected",
      reason: "Argument is conventional",
    });
    const input = await f.studio.discoveryInput("later", false);
    expect(JSON.stringify(input.history)).toContain("Argument is conventional");
  });
  it("exclusive local lock fails closed", async () => {
    const f = await selected();
    await mkdir(join(f.root, "Studio/Publishing/state-lock/.local-lock"));
    await expect(
      f.studio.select({ ...f.request, operationId: "busy", expectedRevision: 1 }),
    ).rejects.toThrow("busy");
  });
  it("actual CLI stages and reloads independently of cwd", async () => {
    const f = await fixture();
    const config = join(f.root, "instance.json");
    const output = join(f.root, "context.json");
    await writeFile(config, JSON.stringify(f.config));
    const cli = resolve("dist/cli.js");
    const run = promisify(execFile);
    const result = await run(
      process.execPath,
      [cli, "discovery-input", "--config", config, "--run-id", "cli", "--output", output],
      { cwd: tmpdir() },
    );
    expect(result.stdout).not.toContain("Judgment works");
    expect(JSON.parse(await readFile(output, "utf8")).runId).toBe("cli");
    await expect(readFile(join(f.root, "Studio/Publishing/inputs/cli.md"))).rejects.toThrow();
  });
});

describe("provider structured output compatibility", () => {
  it("compiles shipped discovery schema under draft7 and preserves runtime guards", async () => {
    const f = await fixture();
    const schema = JSON.parse(
      await readFile(resolve("schemas/discovery-result.schema.json"), "utf8"),
    );
    const validate = new Ajv({ strict: false }).compile(schema);
    expect(validate(f.result)).toBe(true);
    expect(validate({ ...f.result, status: "invalid" })).toBe(false);
    expect(validate({ ...f.result, candidates: [{ ...f.candidate, evidence: [] }] })).toBe(false);
    await expect(
      f.studio.saveDiscovery({ ...f.result, candidates: [{ ...f.candidate, evidence: [] }] }),
    ).rejects.toThrow();
  });
});
