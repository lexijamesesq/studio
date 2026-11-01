import { z } from "astro/zod";

/**
 * Homepage status. Agents rewrite `src/data/now.json`.
 * Keep this validator in sync with `src/data/now.schema.json`.
 *
 * intro: one dry line about who she is.
 * activity: what she is in the middle of.
 * where: where that is happening. Unconfirmed places stay prefixed with [Sample].
 * lastSeenBuilding: the complete "last seen building" sentence. Direction B leads with it.
 * visual: the one current picture. `src` is a public path (`/…`) or an absolute URL.
 * updated: YYYY-MM-DD the status file last changed.
 * featuredArticle: id of a file in `src/content/articles`, without `.md`.
 */
export const nowSchema = z
  .object({
    $schema: z.string().optional(),
    intro: z.string().min(1),
    activity: z.string().min(1),
    where: z.string().min(1),
    lastSeenBuilding: z.string().min(1),
    visual: z
      .object({
        src: z.string().min(1),
        alt: z.string().min(1),
      })
      .strict(),
    updated: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((value) => {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (!match) return false;
        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const date = new Date(Date.UTC(year, month - 1, day));
        return (
          date.getUTCFullYear() === year &&
          date.getUTCMonth() === month - 1 &&
          date.getUTCDate() === day
        );
      }, "updated must be a real calendar date in YYYY-MM-DD"),
    featuredArticle: z.string().min(1),
  })
  .strict();

export type Now = z.infer<typeof nowSchema>;
