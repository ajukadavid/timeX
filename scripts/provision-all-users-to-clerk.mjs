#!/usr/bin/env node
/**
 * Creates every Convex user in Clerk (or links existing Clerk user by email),
 * then patches the Convex row with the Clerk user ID.
 *
 * Use after importing Convex data to prod — Convex rows alone cannot sign in.
 *
 * Usage:
 *   # Prod Convex + prod Clerk (set sk_live_ + prod CONVEX URL in .env.local):
 *   node scripts/provision-all-users-to-clerk.mjs --prod
 *   node scripts/provision-all-users-to-clerk.mjs --prod --dry-run
 *
 *   # Dev:
 *   node scripts/provision-all-users-to-clerk.mjs
 *   node scripts/provision-all-users-to-clerk.mjs --dry-run
 *
 * Options:
 *   --prod       Target Convex production deployment (npx convex run --prod)
 *   --dry-run    List users only, no Clerk or Convex writes
 *   --skip-ok    Skip users whose current clerkId already exists in Clerk
 */

import { getConvexUrl, loadProjectEnv } from "./load-env.mjs";
import { convexRun } from "./convex-run.mjs";

loadProjectEnv();

const DRY_RUN = process.argv.includes("--dry-run");
const USE_PROD = process.argv.includes("--prod");
const SKIP_OK = process.argv.includes("--skip-ok");

const clerkSecretKey = process.env.CLERK_SECRET_KEY?.trim();
if (!clerkSecretKey) {
  console.error("Missing CLERK_SECRET_KEY in .env.local");
  process.exit(1);
}

const isLiveKey = clerkSecretKey.startsWith("sk_live_");
const convexUrl = getConvexUrl();

console.log(
  `Convex CLI target: ${USE_PROD ? "PRODUCTION (--prod)" : "dev"}` +
    (convexUrl ? `\n.env CONVEX_URL: ${convexUrl} (informational only when using --prod)` : "") +
    `\nClerk: ${isLiveKey ? "live (sk_live_)" : "test (sk_test_)"}\n`
);

if (USE_PROD && !isLiveKey) {
  console.error(
    "Error: --prod requires CLERK_SECRET_KEY=sk_live_... in .env.local\n" +
      "Copy values from .env.vercel.production, then re-run."
  );
  process.exit(1);
}

async function createClerkUser(user) {
  const body = {
    email_address: [user.email],
    first_name: user.firstName ?? undefined,
    last_name: user.lastName ?? undefined,
    public_metadata: { role: user.role ?? "staff" },
    skip_password_checks: true,
    skip_password_requirement: true,
  };

  const res = await fetch("https://api.clerk.com/v1/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    const alreadyExists =
      res.status === 422 &&
      data.errors?.some((e) => e.code === "form_identifier_exists");

    if (alreadyExists) {
      return { _alreadyExists: true };
    }

    console.error(
      `  ✗ Clerk create failed (${res.status}): ${JSON.stringify(data.errors ?? data)}`
    );
    return null;
  }

  return data;
}

async function findClerkUserByEmail(email) {
  const res = await fetch(
    `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${clerkSecretKey}` } }
  );
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function getClerkUserById(clerkUserId) {
  const res = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
    headers: { Authorization: `Bearer ${clerkSecretKey}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function sendPasswordReset(clerkUserId) {
  const res = await fetch(
    `https://api.clerk.com/v1/users/${clerkUserId}/send_password_reset_email`,
    { method: "POST", headers: { Authorization: `Bearer ${clerkSecretKey}` } }
  );
  return res.ok;
}

async function main() {
  console.log("Fetching all users from Convex...");
  let users;
  try {
    users = convexRun(
      "internal/users:listAllUsersForProvisioning",
      {},
      { prod: USE_PROD }
    );
  } catch (err) {
    console.error(err.message);
    console.error(
      "\nTip: run `npx convex login` and retry, or test with:\n" +
        "  npx convex run users:listAllUsersForProvisioning '{}' --prod"
    );
    process.exit(1);
  }

  if (!Array.isArray(users)) {
    console.error("Unexpected response from Convex (expected user array).");
    process.exit(1);
  }

  console.log(`Found ${users.length} users with email addresses.\n`);

  if (users.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  if (DRY_RUN) {
    console.log("DRY RUN — would provision:\n");
    for (const u of users) {
      console.log(`  ${u.email}  role=${u.role}  clerkId=${u.clerkId}`);
    }
    return;
  }

  let created = 0;
  let linked = 0;
  let skipped = 0;
  let failed = 0;

  for (const u of users) {
    process.stdout.write(`  ${u.email} ... `);

    if (SKIP_OK && !u.clerkId.startsWith("legacy:")) {
      const existing = await getClerkUserById(u.clerkId);
      if (existing) {
        const clerkEmail =
          existing.email_addresses?.find(
            (e) => e.id === existing.primary_email_address_id
          )?.email_address ?? existing.email_addresses?.[0]?.email_address;
        if (clerkEmail?.toLowerCase() === u.email.toLowerCase()) {
          console.log(`skip (already linked ${u.clerkId})`);
          skipped++;
          continue;
        }
      }
    }

    let clerkUser = await createClerkUser(u);

    if (clerkUser?._alreadyExists) {
      clerkUser = await findClerkUserByEmail(u.email);
      if (!clerkUser) {
        console.log("✗ in Clerk but lookup failed");
        failed++;
        continue;
      }
      process.stdout.write("(exists in Clerk) ");
    } else if (!clerkUser) {
      console.log("✗");
      failed++;
      continue;
    } else {
      await sendPasswordReset(clerkUser.id);
      created++;
    }

    convexRun(
      "internal/users:setClerkId",
      { userId: u._id, clerkId: clerkUser.id },
      { prod: USE_PROD }
    );

    linked++;
    console.log(`✓ ${clerkUser.id}`);
  }

  console.log(`
Done.
  Created in Clerk:     ${created}
  Linked in Convex:     ${linked}
  Skipped (already ok): ${skipped}
  Failed:               ${failed}
`);

  if (created > 0) {
    console.log(
      "Password-reset emails sent to newly created users.\n" +
        "They set a password via the email, then sign in at /login."
    );
  }
}

main();
