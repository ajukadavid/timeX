#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Run an internal Convex function via the CLI (requires local Convex login). */
export function convexRun(functionName, args = {}, options = {}) {
  // CLI uses `users:fn`, not `internal/users:fn` (internal/ prefix breaks on current Convex).
  const cliFunction = functionName.replace(/^internal\//, "");

  const cliArgs = ["convex", "run", cliFunction, JSON.stringify(args)];
  if (options.prod) cliArgs.push("--prod");

  let output;
  try {
    output = execFileSync("npx", cliArgs, {
      cwd: root,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (err) {
    const stderr = err.stderr?.toString?.() ?? "";
    const msg = stderr.trim() || err.message;
    throw new Error(`convex run ${cliFunction} failed: ${msg}`);
  }

  if (!output) return null;

  // CLI prints pretty-printed multi-line JSON; parse whole output first.
  try {
    return JSON.parse(output);
  } catch {
    // Fallback: last line may be single JSON value (older CLI / logs mixed in).
    const lines = output.split("\n").filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        return JSON.parse(lines[i]);
      } catch {
        // keep trying earlier lines
      }
    }
  }

  throw new Error(
    `convex run ${cliFunction}: could not parse JSON from output:\n${output.slice(0, 500)}`
  );
}
