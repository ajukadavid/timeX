import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Send daily attendance digest to org admins at 10:00 UTC
crons.daily(
  "daily-attendance-digest",
  { hourUTC: 10, minuteUTC: 0 },
  internal.emails.sendDailyDigests
);

export default crons;
