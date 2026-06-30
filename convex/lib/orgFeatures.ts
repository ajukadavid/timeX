import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";

export const subscriptionTierValidator = v.union(v.literal("free"), v.literal("paid"));

export type SubscriptionTier = "free" | "paid";

export type OrgFeatureFlags = {
  subscriptionTier: SubscriptionTier;
  geoFence: { allowed: boolean; enabled: boolean; active: boolean };
  biometric: { allowed: boolean; enabled: boolean; active: boolean };
  offlineSync: { allowed: boolean; enabled: boolean; active: boolean };
};

export const orgFeatureFlagsValidator = v.object({
  subscriptionTier: subscriptionTierValidator,
  geoFence: v.object({
    allowed: v.boolean(),
    enabled: v.boolean(),
    active: v.boolean(),
  }),
  biometric: v.object({
    allowed: v.boolean(),
    enabled: v.boolean(),
    active: v.boolean(),
  }),
  offlineSync: v.object({
    allowed: v.boolean(),
    enabled: v.boolean(),
    active: v.boolean(),
  }),
});

export function getSubscriptionTier(org: { subscriptionTier?: SubscriptionTier }): SubscriptionTier {
  return org.subscriptionTier ?? "free";
}

export function isPaidOrg(org: { subscriptionTier?: SubscriptionTier }): boolean {
  return getSubscriptionTier(org) === "paid";
}

/** Resolve platform entitlement + org toggle into an effective feature flag. */
export function resolveOrgFeatureFlags(org: Doc<"organizations">): OrgFeatureFlags {
  const geoAllowed = org.featuresGeoFenceAllowed ?? false;
  const bioAllowed = org.featuresBiometricAllowed ?? false;
  const offlineAllowed = org.featuresOfflineSyncAllowed ?? false;

  const geoEnabled = org.geoFenceEnabled ?? false;
  const bioEnabled = org.biometricEnabled ?? false;
  const offlineEnabled = org.offlineSyncEnabled ?? false;

  return {
    subscriptionTier: getSubscriptionTier(org),
    geoFence: {
      allowed: geoAllowed,
      enabled: geoEnabled,
      active: geoAllowed && geoEnabled,
    },
    biometric: {
      allowed: bioAllowed,
      enabled: bioEnabled,
      active: bioAllowed && bioEnabled,
    },
    offlineSync: {
      allowed: offlineAllowed,
      enabled: offlineEnabled,
      active: offlineAllowed && offlineEnabled,
    },
  };
}

/** Patches to apply when revoking premium access (downgrade or entitlement removal). */
export function revokedPremiumFeaturePatches(): Partial<Doc<"organizations">> {
  return {
    featuresGeoFenceAllowed: false,
    featuresBiometricAllowed: false,
    featuresOfflineSyncAllowed: false,
    geoFenceEnabled: false,
    biometricEnabled: false,
    offlineSyncEnabled: false,
    updatedAt: Date.now(),
  };
}
