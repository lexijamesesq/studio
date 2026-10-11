import { execFileSync, spawnSync } from "node:child_process";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const project = fileURLToPath(new URL("../", import.meta.url));
const root = project;
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
const { PRE_COMMIT_FROM_REF: from, PRE_COMMIT_TO_REF: to } = process.env;
let names;
let outgoing;
if (from && to) {
  outgoing = to;
  names = git("diff", "--name-only", "--no-renames", "-z", from, to);
} else if (process.env.PRE_COMMIT_REMOTE_NAME && process.env.PRE_COMMIT_LOCAL_BRANCH) {
  const branch = process.env.PRE_COMMIT_LOCAL_BRANCH;
  outgoing = branch;
  git("rev-parse", "--verify", `${branch}^{commit}`);
  names = git(
    "log",
    "--format=",
    "--name-only",
    "--no-renames",
    "-z",
    branch,
    "--not",
    `--remotes=${process.env.PRE_COMMIT_REMOTE_NAME}`,
  );
} else {
  throw new Error("Cannot select project checks: native outgoing range is unavailable");
}
const shared =
  /^(?:src\/|tests\/|scripts\/|schemas\/|samples\/|plugins\/|\.claude-plugin\/|package(?:-lock)?\.json$|tsconfig.*\.json$|vitest\.config\.[^/]+$|biome\.json$|\.pre-commit-config\.yaml$|\.npmrc$|\.nvmrc$|\.node-version$)/;
if (
  !names
    .split("\0")
    .map((name) => name.replace(/^\n/, ""))
    .some((name) => shared.test(name))
) {
  console.log("Studio: no affected inputs");
  process.exit(0);
}
// Selection can name a different commit from the tree these commands read.
outgoing = git("rev-parse", "--verify", `${outgoing}^{commit}`).trim();
const head = git("rev-parse", "--verify", "HEAD").trim();
const untracked = git("ls-files", "--others", "--exclude-standard");
if (outgoing !== head || untracked.length > 0) {
  throw new Error(
    "BLOCKED: push checks require a clean checkout/worktree at the pushed head (including the index and nonignored untracked files).",
  );
}
git("diff", "--quiet", outgoing, "--");
git("diff", "--cached", "--quiet", outgoing, "--");
function run(command, args, cwd = project) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.signal ?? result.status})`);
}
for (const tool of ["typescript/bin/tsc", "vitest/vitest.mjs"]) {
  await access(new URL(`../node_modules/${tool}`, import.meta.url)).catch(() => {
    throw new Error(
      "Project dependencies are unavailable; run npm ci --ignore-scripts before checking",
    );
  });
}
// No install/network fallback: prepare locked dependencies separately with npm ci.
run("npm", ["--ignore-scripts", "run", "typecheck"]);
run("npm", ["--ignore-scripts", "run", "build"]);
// The existing build emits the compiled CLI and committed JSON schemas before tests.
run("npm", ["--ignore-scripts", "test"]);
