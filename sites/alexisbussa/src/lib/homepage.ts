import { getCollection, getEntry } from "astro:content";
import nowRaw from "../data/now.json";
import { parseIsoDate } from "./dates";
import { nowSchema } from "./now";

export async function loadHomepage() {
  const now = nowSchema.parse(nowRaw);
  const articles = (await getCollection("articles")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const projects = (await getCollection("projects")).sort((a, b) => a.id.localeCompare(b.id));
  const featured = await getEntry("articles", now.featuredArticle);

  if (!featured) {
    throw new Error(
      `now.json featuredArticle "${now.featuredArticle}" does not match a file in src/content/articles.`,
    );
  }

  return {
    now,
    articles,
    projects,
    featured,
    updated: parseIsoDate(now.updated),
  };
}
