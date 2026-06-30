import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireCurrentUser } from "./lib/auth";

/** Check if the current user has a registered WebAuthn credential. */
export const getMyCredential = query({
  args: {},
  returns: v.union(
    v.object({
      credentialId: v.string(),
      deviceName: v.optional(v.string()),
      createdAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    const cred = await ctx.db
      .query("webAuthnCredentials")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!cred) return null;
    return { credentialId: cred.credentialId, deviceName: cred.deviceName, createdAt: cred.createdAt };
  },
});

/** Save (or replace) a WebAuthn credential for the current user. */
export const saveCredential = mutation({
  args: {
    credentialId: v.string(),
    publicKeyBase64: v.optional(v.string()),
    deviceName: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const now = Date.now();

    const existing = await ctx.db
      .query("webAuthnCredentials")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        credentialId: args.credentialId,
        publicKeyBase64: args.publicKeyBase64,
        deviceName: args.deviceName,
        createdAt: now,
      });
    } else {
      await ctx.db.insert("webAuthnCredentials", {
        userId: user._id,
        credentialId: args.credentialId,
        publicKeyBase64: args.publicKeyBase64,
        deviceName: args.deviceName,
        createdAt: now,
      });
    }
    return null;
  },
});

/** Remove the WebAuthn credential for the current user (re-register next clock-in). */
export const removeCredential = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    const cred = await ctx.db
      .query("webAuthnCredentials")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (cred) await ctx.db.delete(cred._id);
    return null;
  },
});
