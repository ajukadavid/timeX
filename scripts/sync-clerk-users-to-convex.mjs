#!/usr/bin/env node
/**
 * Fetches every user from Clerk and upserts them into Convex.
 * Users that already have a real clerkId are skipped (no-op patch).
 * Users whose Convex row has clerkId = "legacy:*" get upgraded to the real Clerk ID.
 *
 * Usage:
 *   node scripts/sync-clerk-users-to-convex.mjs
 *   node scripts/sync-clerk-users-to-convex.mjs --dry-run   (list only, no writes)
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { getConvexUrl, loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const DRY_RUN = process.argv.includes("--dry-run");

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
if (!clerkSecretKey) {
  console.error("Missing CLERK_SECRET_KEY in .env.local");
  process.exit(1);
}

const convexUrl = getConvexUrl();
if (!convexUrl) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL or CONVEX_URL in .env.local");
  process.exit(1);
}

const convex = new ConvexHttpClient(convexUrl);

/** Fetch all Clerk users via cursor-based pagination. */
async function fetchAllClerkUsers() {
  const users = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetch(
      `https://api.clerk.com/v1/users?limit=${limit}&offset=${offset}&order_by=-created_at`,
      { headers: { Authorization: `Bearer ${clerkSecretKey}` } }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`Clerk API error ${res.status}: ${body}`);
      process.exit(1);
    }

    const page = await res.json();
    if (!Array.isArray(page) || page.length === 0) break;

    users.push(...page);
    if (page.length < limit) break;
    offset += limit;
  }

  return users;
}

async function main() {
  console.log("Fetching users from Clerk...");
  const clerkUsers = await fetchAllClerkUsers();
  console.log(`Found ${clerkUsers.length} Clerk users.\n`);

  if (DRY_RUN) {
    console.log("DRY RUN — no writes will be made.\n");
  }

  let synced = 0;
  let failed = 0;

  for (const u of clerkUsers) {
    const primaryEmail =
      u.email_addresses?.find((e) => e.id === u.primary_email_address_id)
        ?.email_address ||
      u.email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      console.warn(`  ⚠  Skipping ${u.id} — no email address`);
      continue;
    }

    const role =
      u.public_metadata?.role === "admin" ||
      u.public_metadata?.role === "manager" ||
      u.public_metadata?.role === "staff"
        ? u.public_metadata.role
        : "staff";

    const fullName =
      `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() ||
      u.username ||
      undefined;

    console.log(`  → ${primaryEmail} (${u.id})`);

    if (!DRY_RUN) {
      try {
        await convex.mutation(api.users.upsertFromClerk, {
          clerkId: u.id,
          email: primaryEmail,
          firstName: u.first_name ?? undefined,
          lastName: u.last_name ?? undefined,
          fullName,
          role,
          isActive: true,
        });
        synced++;
      } catch (err) {
        console.error(`     ✗ Failed: ${err.message}`);
        failed++;
      }
    } else {
      synced++;
    }
  }

  console.log(
    `\n${DRY_RUN ? "Would sync" : "Synced"} ${synced}/${clerkUsers.length} users.${
      failed ? ` ${failed} failed.` : ""
    }`
  );
}

main();
