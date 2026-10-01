import { isAbsolute } from "node:path";
import { z } from "zod";

const text = z.string().trim().min(1).max(12000);
export const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,95}$/);
const relative = z
  .string()
  .min(1)
  .refine(
    (p) => !p.startsWith("/") && !p.split(/[\\/]/).includes(".."),
    "Vault-relative path required",
  );
export const sourceSchema = z
  .object({
    id,
    path: relative.optional(),
    url: z.url().optional(),
    publicUse: z.enum(["private", "paraphrase", "quotable"]),
  })
  .strict()
  .refine(
    (s) => Boolean(s.path) !== Boolean(s.url),
    "Specify exactly one vault path or public URL",
  );
export const configSchema = z
  .object({
    schemaVersion: z.literal(1),
    vaultRoot: text.refine(isAbsolute, "Absolute vault root required"),
    packageRoot: text.refine(isAbsolute, "Absolute package root required").optional(),
    recordsPath: relative.refine((p) => p.startsWith("Studio/"), "Records must stay under Studio/"),
    sources: z.array(sourceSchema).min(1).max(100),
    intentPaths: z.array(relative).default([]),
    lessonPaths: z.array(relative).default([]),
  })
  .strict()
  .refine(
    (c) => new Set(c.sources.map((s) => s.id)).size === c.sources.length,
    "Duplicate source IDs",
  );
export const evidenceSchema = z
  .object({ sourceId: id, excerpt: text, interpretation: text })
  .strict();
export const candidateSchema = z
  .object({
    topicKey: id,
    angleKey: id,
    title: text,
    angle: text,
    reader: text,
    whyWrite: text,
    whyRead: text,
    rankingRationale: text,
    evidence: z.array(evidenceSchema).min(1).max(30),
    gaps: z.array(text).max(30),
  })
  .strict();
export const discoverySchema = z
  .object({
    schemaVersion: z.literal(1),
    runId: id,
    inputHash: z.string().regex(/^[a-f0-9]{64}$/),
    status: z.enum(["complete", "partial"]),
    coverage: z.array(
      z.object({ sourceId: id, status: z.enum(["read", "unavailable"]), detail: text }).strict(),
    ),
    candidates: z.array(candidateSchema).max(30),
  })
  .strict();
export const preparationSchema = z
  .object({
    proposedArgument: text,
    supportingEvidence: z.array(evidenceSchema),
    conflictingEvidence: z.array(evidenceSchema),
    gaps: z.array(text),
    nextInteraction: text,
  })
  .strict();
const candidateRef = z.object({ candidateId: id, runId: id });
export const mutationSchema = z
  .object({ operationId: id, expectedRevision: z.number().int().nonnegative() })
  .strict();
export const selectSchema = mutationSchema.extend(candidateRef.shape).strict();
export const decisionSchema = selectSchema
  .extend({ action: z.enum(["deferred", "rejected"]), reason: text.optional() })
  .strict();
export const prepareSchema = mutationSchema
  .extend({ articleId: id, preparation: preparationSchema })
  .strict();
export type Config = z.infer<typeof configSchema>;
export type Candidate = z.infer<typeof candidateSchema>;
export type Discovery = z.infer<typeof discoverySchema>;
export type Preparation = z.infer<typeof preparationSchema>;
