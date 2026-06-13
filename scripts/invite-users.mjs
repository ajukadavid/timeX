#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { getSiteUrl, loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
if (!clerkSecretKey) {
  console.error("Missing CLERK_SECRET_KEY");
  process.exit(1);
}

const EXPORTS_DIR = process.env.EXPORTS_DIR || "./exports";

function readJson(fileName) {
  return JSON.parse(readFileSync(`${EXPORTS_DIR}/${fileName}`, "utf8"));
}

function uniqueByEmail(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const email = String(item.email || "").toLowerCase();
    if (!email || !email.includes("@")) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    out.push({ ...item, email });
  }
  return out;
}

const redirectUrl =
  process.env.CLERK_INVITE_REDIRECT_URL ||
  `${getSiteUrl().replace(/\/$/, "")}/dashboardStaff`;

async function inviteUser(email, role) {
  const res = await fetch("https://api.clerk.com/v1/invitations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      public_metadata: { role },
      notify: true,
      redirect_url: redirectUrl,
      ignore_existing: true,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(`Invite failed for ${email}:`, JSON.stringify(data, null, 2));
    return false;
  }
  const link = data.url || data.public_metadata?.invitation_url;
  console.log(`Invited ${email}`);
  if (link) {
    console.log(`  Accept link: ${link}`);
  } else {
    console.log(
      `  (no url in API response — open Clerk Dashboard → Users → Invitations)`
    );
  }
  return true;
}

async function run() {
  const staffs = readJson("staffs.json");
  const employers = readJson("employers.json");

  const users = uniqueByEmail([
    ...employers.map((u) => ({ email: u.email, role: "admin" })),
    ...staffs.map((u) => ({ email: u.email, role: "staff" })),
  ]);

  const onlyEmail = process.argv.find((a) => a.includes("@"));
  const toInvite = onlyEmail
    ? users.filter((u) => u.email === onlyEmail.toLowerCase())
  : users;

  if (onlyEmail && toInvite.length === 0) {
    console.error(`Email not in exports: ${onlyEmail}`);
    process.exit(1);
  }

  console.log(`Inviting ${toInvite.length} users to Clerk...`);
  console.log(`Redirect after accept: ${redirectUrl}`);
  console.log(
    "Dev emails come from @accounts.dev — check spam. Links are also printed below.\n"
  );
  let success = 0;
  for (const user of toInvite) {
    const ok = await inviteUser(user.email, user.role);
    if (ok) success += 1;
  }
  console.log(`\nDone. Invitations sent: ${success}/${toInvite.length}`);
}

run().catch((error) => {
  console.error("Invite script failed:", error);
  process.exit(1);
});
