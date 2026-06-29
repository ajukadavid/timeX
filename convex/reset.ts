import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { TableNames } from "./_generated/dataModel";

const WIPE_CONFIRM = "WIPE_ALL_APPLICATION_DATA";

const TABLES_TO_WIPE: TableNames[] = [
  "attendanceLogs",
  "staffProfiles",
  "departments",
  "employerSettings",
  "users",
  "employers",
  "staffs",
  "employees",
  "stafflogs",
];

/**
 * Deletes all application data (users, staff, attendance, legacy archives).
 * Run only on prod when starting fresh:
 *   npx convex run reset:wipeApplicationData '{"confirm":"WIPE_ALL_APPLICATION_DATA"}' --prod
 */
export const wipeApplicationData = internalMutation({
  args: {
    confirm: v.literal(WIPE_CONFIRM),
  },
  returns: v.object({
    deleted: v.record(v.string(), v.number()),
  }),
  handler: async (ctx, args) => {
    if (args.confirm !== WIPE_CONFIRM) {
      throw new Error("Invalid confirmation token");
    }

    const deleted: Record<string, number> = {};

    for (const table of TABLES_TO_WIPE) {
      const rows = await ctx.db.query(table).collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
      deleted[table] = rows.length;
    }

    return { deleted };
  },
});
