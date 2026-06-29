const clerkIssuer =
  process.env.CLERK_JWT_ISSUER_DOMAIN?.trim() ||
  process.env.CLERK_FRONTEND_API_URL?.trim();

if (!clerkIssuer) {
  throw new Error(
    "CLERK_JWT_ISSUER_DOMAIN must be set on this Convex deployment (e.g. npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-app.clerk.accounts.dev)"
  );
}

export default {
  providers: [
    {
      domain: clerkIssuer,
      applicationID: "convex",
    },
  ],
};
