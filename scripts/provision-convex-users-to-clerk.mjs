#!/usr/bin/env node
/**
 * Creates every Convex user that still has a "legacy:*" clerkId as a real
 * Clerk user, then patches the Convex row with the new Clerk ID.
 *
 * After this runs:
 *  - All users exist in Clerk (real Clerk IDs).
 *  - All Convex rows have real clerkIds.
 *  - Users receive a "You've been invited" / password-reset email from Clerk
 *    so they can set their password and sign in.
 *
 * Usage:
 *   node scripts/provision-convex-users-to-clerk.mjs            # live run
 *   node scripts/provision-convex-users-to-clerk.mjs --dry-run  # preview only
 */

import { loadProjectEnv } from "./load-env.mjs";
import { convexRun } from "./convex-run.mjs";

loadProjectEnv();

const DRY_RUN = process.argv.includes("--dry-run");

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
if (!clerkSecretKey) {
  console.error("Missing CLERK_SECRET_KEY in .env.local");
  process.exit(1);
}

/** Create a user in Clerk. Returns the Clerk user object or null on failure. */
async function createClerkUser(user) {
  const body = {
    email_address: [user.email],
    first_name: user.firstName ?? undefined,
    last_name: user.lastName ?? undefined,
    public_metadata: { role: user.role ?? "staff" },
    // No password — user will receive a "set your password" link automatically.
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
    // 422 with "already exists" means they're in Clerk but not linked yet.
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

/** Look up an existing Clerk user by email. */
async function findClerkUserByEmail(email) {
  const res = await fetch(
    `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${clerkSecretKey}` } }
  );
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

/** Send Clerk's "reset password" email so the user can set a password. */
async function sendPasswordReset(clerkUserId) {
  const res = await fetch(
    `https://api.clerk.com/v1/users/${clerkUserId}/send_password_reset_email`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${clerkSecretKey}` },
    }
  );
  return res.ok;
}

async function main() {
  console.log("Fetching legacy users from Convex...");
  const legacyUsers = convexRun("internal/users:listLegacyUsers", {}, {
    prod: process.argv.includes("--prod"),
  });
  console.log(`Found ${legacyUsers.length} users with legacy clerkIds.\n`);

  if (legacyUsers.length === 0) {
    console.log("Nothing to do — all users already have real Clerk IDs.");
    return;
  }

  if (DRY_RUN) {
    console.log("DRY RUN — no writes. Would provision:\n");
    legacyUsers.forEach((u) => console.log(`  ${u.email}  (${u.clerkId})`));
    return;
  }

  let created = 0;
  let linked = 0;
  let failed = 0;

  for (const u of legacyUsers) {
    process.stdout.write(`  ${u.email} ... `);

    let clerkUser = await createClerkUser(u);

    if (clerkUser?._alreadyExists) {
      // User is already in Clerk — look up their real ID.
      clerkUser = await findClerkUserByEmail(u.email);
      if (!clerkUser) {
        console.log("✗ could not find existing Clerk user");
        failed++;
        continue;
      }
      process.stdout.write("(already in Clerk) ");
    } else if (!clerkUser) {
      failed++;
      continue;
    } else {
      // Newly created — send password-reset so they can log in.
      await sendPasswordReset(clerkUser.id);
      created++;
    }

    // Patch Convex row with the real Clerk ID.
    convexRun(
      "internal/users:setClerkId",
      {
        userId: u._id,
        clerkId: clerkUser.id,
      },
      { prod: process.argv.includes("--prod") }
    );

    linked++;
    console.log(`✓  Clerk ID: ${clerkUser.id}`);
  }

  console.log(`
Done.
  Created in Clerk:  ${created}
  Already existed:   ${linked - created}
  Total linked:      ${linked}
  Failed:            ${failed}
`);

  if (created > 0) {
    console.log(
      "Password-reset emails have been sent to newly created users.\n" +
        "They can open the link to set a password, then sign in at /login."
    );
  }
}

main();
