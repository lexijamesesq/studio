#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { loadConfig, Studio } from "./index.js";

const args = process.argv.slice(2);
const command = args.shift();
const options = new Map<string, string>();
while (args.length) {
  const k = args.shift();
  const v = args.shift();
  if (!k?.startsWith("--") || !v) throw new Error("Expected --option value");
  options.set(k.slice(2), v);
}
const required = (name: string) => {
  const value = options.get(name);
  if (!value) throw new Error(`Missing --${name}`);
  return value;
};
try {
  const configPath =
    options.get("config") ??
    process.env.STUDIO_CONFIG ??
    join(homedir(), ".config", "studio", "instance.json");
  if (!configPath) throw new Error("Provide --config or STUDIO_CONFIG");
  const studio = new Studio(await loadConfig(configPath));
  const request = async () => JSON.parse(await readFile(required("input"), "utf8")) as unknown;
  let result: unknown;
  switch (command) {
    case "discovery-input":
      result = await studio.discoveryInput(required("run-id"), false);
      break;
    case "discovery-validate":
      result = await studio.saveDiscovery(
        await request(),
        true,
        options.get("input-context")
          ? (JSON.parse(await readFile(required("input-context"), "utf8")) as unknown)
          : undefined,
      );
      break;
    case "discovery-save":
      result = await studio.saveDiscovery(
        await request(),
        false,
        options.get("input-context")
          ? (JSON.parse(await readFile(required("input-context"), "utf8")) as unknown)
          : undefined,
      );
      break;
    case "discovery-fail":
      result = await studio.failDiscovery(required("run-id"), required("message"));
      break;
    case "present":
    case "resume":
      result = await studio.present();
      break;
    case "select":
      result = await studio.select(await request());
      break;
    case "decide":
      result = await studio.decide(await request());
      break;
    case "prepare":
      result = await studio.prepare(await request());
      break;
    default:
      throw new Error(
        "Commands: discovery-input, discovery-save, discovery-fail, present, resume, select, decide, prepare",
      );
  }
  const output = JSON.stringify(result, null, 2);
  const file = options.get("output");
  if (file) {
    await writeFile(file, `${output}\n`, { mode: 0o600 });
    console.log(JSON.stringify({ status: "saved", command }));
  } else if (command === "discovery-input")
    throw new Error("discovery-input requires --output to prevent private source logging");
  else console.log(output);
} catch (error) {
  console.error(
    JSON.stringify({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    }),
  );
  process.exitCode = 1;
}
