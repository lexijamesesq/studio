import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ base: "./src/content/articles", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    hook: z.string().min(1),
    mediumUrl: z.string().url(),
    image: z.string().min(1).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1),
    status: z.string().min(1),
    summary: z.string().min(1),
  }),
});

export const collections = { articles, projects };
