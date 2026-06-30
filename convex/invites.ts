"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const inviteResultValidator = v.object({
  email: v.string(),
  success: v.boolean(),
  message: v.string(),
});

async function sendClerkInvite(email: string, role: string) {
  const clerkSecretKey = process.env.CLERK_SECRET_KEY?.trim();
  if (!clerkSecretKey) {
    throw new Error("CLERK_SECRET_KEY is not configured");
  }

  const siteUrl = (
    process.env.CLERK_INVITE_REDIRECT_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  // Send new staff to /login so Clerk handles sign-in/sign-up before routing.
  // This avoids the issue where an already-logged-in admin session intercepts the link.
  const redirectUrl = `${siteUrl}/login`;

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

  const data = (await res.json()) as { errors?: { message?: string }[] };
  if (!res.ok) {
    const message =
      data.errors?.[0]?.message ?? `Clerk invite failed (${res.status})`;
    return { success: false, message };
  }

  return { success: true, message: "Invitation sent" };
}

export const inviteStaffByEmail = action({
  args: {
    email: v.string(),
    organizationId: v.optional(v.id("organizations")),
  },
  returns: inviteResultValidator,
  handler: async (ctx, args) => {
    const me = await ctx.runQuery(api.users.getCurrentUser, {});
    if (!me) throw new Error("Not authenticated");

    // Org model: user must be org admin OR platform super admin
    const canInvite =
      me.platformRole === "superAdmin" ||
      me.role === "admin";
    if (!canInvite) throw new Error("Admin access required");

    const email = args.email.trim().toLowerCase();
    if (!email.includes("@")) throw new Error("Invalid email address");

    const result = await sendClerkInvite(email, "staff");
    return { email, ...result };
  },
});

export const invitePendingStaff = action({
  args: {
    organizationId: v.optional(v.id("organizations")),
  },
  returns: v.object({
    invited: v.number(),
    failed: v.number(),
    results: v.array(inviteResultValidator),
  }),
  handler: async (ctx, args) => {
    const me = await ctx.runQuery(api.users.getCurrentUser, {});
    const canInvite = me?.platformRole === "superAdmin" || me?.role === "admin";
    if (!me || !canInvite) {
      throw new Error("Admin access required");
    }

    let pending: Array<{ email: string; needsInvite: boolean }> = [];

    if (args.organizationId) {
      const staffList = await ctx.runQuery(api.staff.listStaffByOrg, {
        organizationId: args.organizationId,
      });
      pending = staffList.filter((s) => s.needsInvite);
    } else {
      const staffList = await ctx.runQuery(api.staff.listStaffByEmployer, {
        employerId: me._id,
      });
      pending = staffList.filter((s) => s.needsInvite);
    }

    const results: Array<{ email: string; success: boolean; message: string }> =
      [];

    for (const staff of pending) {
      if (!staff.email) continue;
      const result = await sendClerkInvite(staff.email, "staff");
      results.push({ email: staff.email, ...result });
    }

    return {
      invited: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  },
});
