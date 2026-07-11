import { internalQuery } from "./_generated/server";

export const getMyUser = internalQuery(async ({ db }) => {
  return await db.query("users").collect();
});
