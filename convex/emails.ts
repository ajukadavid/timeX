"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// ── Email sender — swap this function when you add an email provider ──────────
// Currently logs to the Convex dashboard instead of sending real emails.
// To enable real sending, replace this function body with your provider's API
// (e.g. Resend, SendGrid, Postmark, AWS SES, etc.)

async function sendEmail(to: string, subject: string, _html: string) {
  console.log(`[Email stub] Would send to ${to}: "${subject}"`);
  // TODO: integrate your email provider here, e.g.:
  //   const res = await fetch("https://api.resend.com/emails", { ... });
}

// ── Late alert (called by scheduler after a late clock-in) ────

export const sendLateAlertForOrg = internalAction({
  args: {
    organizationId: v.id("organizations"),
    staffName: v.string(),
    entryTime: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const settings = await ctx.runQuery(
      internal.settings.getOrgSettingsInternal,
      { organizationId: args.organizationId }
    );
    if (!settings?.lateAlertEnabled) return null;

    const adminEmail = await ctx.runQuery(
      internal.organizations.getOrgAdminEmailInternal,
      { organizationId: args.organizationId }
    );
    const to = settings.notificationEmail ?? adminEmail;
    if (!to) return null;

    const org = await ctx.runQuery(internal.organizations.getByIdInternal, {
      organizationId: args.organizationId,
    });

    const time = new Date(args.entryTime).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://logasiko.com";

    await sendEmail(
      to,
      `[Logasiko] Late Arrival — ${args.staffName}`,
      `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#ef4444">⏰ Late Arrival Alert</h2>
          <p><strong>${args.staffName}</strong> clocked in late at <strong>${time}</strong>
             for <strong>${org?.name ?? "your organisation"}</strong>.</p>
          <a href="${siteUrl}/dashboardEmployer"
             style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none">
            View Dashboard
          </a>
        </div>
      `
    );
    return null;
  },
});

// ── Daily digest (called by cron each morning) ────────────────

export const sendDailyDigests = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const orgs = await ctx.runQuery(internal.organizations.listAllForDigest, {});

    for (const org of orgs) {
      const settings = await ctx.runQuery(
        internal.settings.getOrgSettingsInternal,
        { organizationId: org._id }
      );
      if (!settings?.dailyDigestEnabled) continue;

      const today = new Date().toISOString().slice(0, 10);
      const summary = await ctx.runQuery(
        internal.attendance.getOrgDailySummaryInternal,
        { organizationId: org._id, date: today }
      );

      const adminEmail = await ctx.runQuery(
        internal.organizations.getOrgAdminEmailInternal,
        { organizationId: org._id }
      );
      const to = settings.notificationEmail ?? adminEmail;
      if (!to) continue;

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://logasiko.com";
      const absent = Math.max(0, summary.totalStaff - summary.uniqueStaffSignedIn);

      await sendEmail(
        to,
        `[Logasiko] Daily Attendance Digest — ${today}`,
        `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
            <h2>📋 Daily Attendance — ${org.name}</h2>
            <p><strong>Date:</strong> ${today}</p>
            <table style="border-collapse:collapse;width:100%">
              <tr style="background:#f3f4f6">
                <th style="padding:8px;text-align:left;border:1px solid #e5e7eb">Metric</th>
                <th style="padding:8px;text-align:right;border:1px solid #e5e7eb">Count</th>
              </tr>
              <tr><td style="padding:8px;border:1px solid #e5e7eb">Total Staff</td><td style="padding:8px;text-align:right;border:1px solid #e5e7eb">${summary.totalStaff}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e5e7eb">Present</td><td style="padding:8px;text-align:right;border:1px solid #e5e7eb">${summary.uniqueStaffSignedIn}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e5e7eb">On Time</td><td style="padding:8px;text-align:right;border:1px solid #e5e7eb">${summary.onTime}</td></tr>
              <tr style="background:#fef2f2"><td style="padding:8px;border:1px solid #e5e7eb">Late</td><td style="padding:8px;text-align:right;border:1px solid #e5e7eb">${summary.late}</td></tr>
              <tr style="background:#fef2f2"><td style="padding:8px;border:1px solid #e5e7eb">Absent</td><td style="padding:8px;text-align:right;border:1px solid #e5e7eb">${absent}</td></tr>
            </table>
            <br/>
            <a href="${siteUrl}/dashboardEmployer"
               style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none">
              View Dashboard
            </a>
          </div>
        `
      );
    }
    return null;
  },
});
