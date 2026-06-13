#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Run an internal Convex function via the CLI (requires local Convex login). */
export function convexRun(functionName, args = {}) {
  const output = execFileSync(
    "npx",
    ["convex", "run", functionName, JSON.stringify(args)],
    { cwd: root, encoding: "utf-8" }
  ).trim();

  if (!output) return null;

  const lines = output.split("\n").filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      return JSON.parse(lines[i]);
    } catch {
      // keep trying earlier lines
    }
  }

  return output;
}
