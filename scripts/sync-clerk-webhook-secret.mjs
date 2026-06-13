#!/usr/bin/env node
/**
 * Pushes CLERK_WEBHOOK_SECRET from .env.local to the Convex dev deployment.
 * Uses JSON.stringify so secrets containing "/" are not truncated by the shell.
 */
import { execSync } from "node:child_process";
import { loadProjectEnv, projectRoot } from "./load-env.mjs";

loadProjectEnv();

const secret = process.env.CLERK_WEBHOOK_SECRET?.trim();
if (!secret) {
  console.error("Missing CLERK_WEBHOOK_SECRET in .env.local");
  process.exit(1);
}

if (!secret.startsWith("whsec_")) {
  console.warn("Warning: Clerk signing secrets usually start with whsec_");
}

console.log(`Syncing CLERK_WEBHOOK_SECRET to Convex (${secret.length} chars)...`);
execSync(`npx convex env set CLERK_WEBHOOK_SECRET ${JSON.stringify(secret)}`, {
  cwd: projectRoot,
  stdio: "inherit",
});
console.log("Done. Restart npx convex dev, then send a test event from Clerk → Webhooks.");
