import { createHash } from "node:crypto";
import { mkdir, readFile, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { parse, stringify } from "yaml";
export const hash = (value: unknown) =>
  createHash("sha256")
    .update(
      JSON.stringify(value, (_key, item: unknown) =>
        item && typeof item === "object" && !Array.isArray(item)
          ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)))
          : item,
      ),
    )
    .digest("hex");
export async function within(root: string, path: string, writing = false): Promise<string> {
  const base = await realpath(root);
  const target = resolve(base, path);
  const rel = relative(base, target);
  if (rel.startsWith("..") || isAbsolute(rel)) throw new Error("Path escaped configured root");
  if (writing) {
    let parent = dirname(target);
    while (true) {
      try {
        parent = await realpath(parent);
        break;
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
        parent = dirname(parent);
      }
    }
    if (relative(base, parent).startsWith("..")) throw new Error("Symlink escaped configured root");
    try {
      const actual = await realpath(target);
      if (relative(base, actual).startsWith(".."))
        throw new Error("Symlink escaped configured root");
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    }
    return target;
  }
  const actual = await realpath(target);
  if (relative(base, actual).startsWith("..")) throw new Error("Symlink escaped configured root");
  return actual;
}
export async function readRecord(path: string): Promise<unknown> {
  const raw = await readFile(path, "utf8");
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(raw);
  if (!match) throw new Error("Invalid Markdown record");
  return parse(match[1] ?? "");
}
export async function atomicRecord(path: string, value: unknown, body: string) {
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.${process.pid}.${hash(value).slice(0, 12)}.tmp`;
  const text = `---\n${stringify(value)}---\n\n${body}\n`;
  try {
    await writeFile(tmp, text, { mode: 0o600, flag: "wx" });
    await rename(tmp, path);
  } finally {
    await rm(tmp, { force: true });
  }
}
export async function exists(path: string) {
  try {
    await stat(path);
    return true;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw e;
  }
}
export async function locked<T>(directory: string, fn: () => Promise<T>): Promise<T> {
  await mkdir(directory, { recursive: true });
  const lock = resolve(directory, ".local-lock");
  try {
    await mkdir(lock);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "EEXIST")
      throw new Error(
        "Workspace busy; reconcile a stale local lock only after confirming no writer is active",
      );
    throw e;
  }
  try {
    return await fn();
  } finally {
    await rm(lock, { recursive: true, force: true });
  }
}
