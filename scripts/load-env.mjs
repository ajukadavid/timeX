import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const eq = trimmed.indexOf("=");
  if (eq === -1) return null;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return { key, value };
}

/** Map legacy NUXT_* env names from older .env.local files. */
function applyLegacyEnvAliases() {
  const aliases = [
    ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
    ["CLERK_SECRET_KEY", "NUXT_CLERK_SECRET_KEY"],
    ["NEXT_PUBLIC_CONVEX_URL", "NUXT_PUBLIC_CONVEX_URL"],
    ["NEXT_PUBLIC_CLERK_FRONTEND_API_URL", "NUXT_PUBLIC_CLERK_FRONTEND_API_URL"],
    ["NEXT_PUBLIC_SITE_URL", "NUXT_PUBLIC_SITE_URL"],
  ];

  for (const [nextKey, legacyKey] of aliases) {
    if (!process.env[nextKey] && process.env[legacyKey]) {
      process.env[nextKey] = process.env[legacyKey];
    }
  }

  if (!process.env.NEXT_PUBLIC_CONVEX_URL && process.env.CONVEX_URL) {
    process.env.NEXT_PUBLIC_CONVEX_URL = process.env.CONVEX_URL;
  }
}

/** Load .env then .env.local (local overrides). Does not overwrite existing process.env. */
export function loadProjectEnv() {
  for (const fileName of [".env", ".env.local"]) {
    const filePath = join(projectRoot, fileName);
    if (!existsSync(filePath)) continue;
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split("\n")) {
      const parsed = parseEnvLine(line);
      if (!parsed) continue;
      if (process.env[parsed.key] === undefined) {
        process.env[parsed.key] = parsed.value;
      }
    }
  }

  applyLegacyEnvAliases();
}

export function getConvexUrl() {
  return process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || null;
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.CLERK_INVITE_REDIRECT_URL ||
    "http://localhost:3000"
  );
}

export { projectRoot };
