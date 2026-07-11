# Local Development Setup

This guide walks you through setting up the timeX project locally from scratch. Read this before touching any code.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | `>=24.0.0` | [nodejs.org](https://nodejs.org) |
| Yarn | any | `npm install -g yarn` |
| Git | any | [git-scm.com](https://git-scm.com) |

---

## 1. Clone & Install

```bash
git clone <repo-url>
cd timeX
yarn install
```

---

## 2. Environment Variables

Copy the example env file and fill in the values:

```bash
cp .env.example .env.local
```

> If `.env.example` doesn't exist yet, create `.env.local` from scratch with the fields below.

### Required Values

```env
# ─── Convex ────────────────────────────────────────────────────
CONVEX_DEPLOYMENT=dev:<your-dev-deployment-name>   # e.g. dev:ardent-ibis-712
NEXT_PUBLIC_CONVEX_URL=https://<your-dev-deployment>.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://<your-dev-deployment>.convex.site

# ─── Clerk ─────────────────────────────────────────────────────
# Get these from: https://dashboard.clerk.com → Your App → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# This MUST match your Clerk app's domain — find it in:
# Clerk Dashboard → Configure → Domains (e.g. "settled-alien-27.accounts.dev")
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://<your-clerk-domain>.accounts.dev
CLERK_JWT_ISSUER_DOMAIN=https://<your-clerk-domain>.accounts.dev

# Clerk redirect URLs (leave as-is for local dev)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# ─── Clerk Webhook (optional for local dev — see note below) ───
CLERK_WEBHOOK_SECRET=whsec_...
```

> **Critical:** The `CLERK_JWT_ISSUER_DOMAIN` is the most common cause of an infinite loading spinner locally. It must exactly match your Clerk app's Accounts domain.

---

## 3. Create the Convex JWT Template in Clerk

This is the step that is easiest to miss and hardest to debug. Without it, Convex will reject every login with "No auth provider found matching the given token."

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) → your app
2. **Configure** → **JWT Templates** → **New template**
3. **Use the "Convex" preset** (look for it in the template type list — don't create a blank template)
4. The preset automatically sets:
   - Name: `convex`
   - Issuer: `https://<your-instance>.clerk.accounts.dev`
   - Audience (`aud`): `convex`
5. Hit **Save**

> **Critical:** If you manually create a blank template named "convex" instead of using the Convex preset, the `aud` claim won't be set and authentication will still fail.

---

## 4. Set Convex Environment Variables

Your Convex backend needs specific environment variables to authenticate with Clerk and send invites.

**1. Set the JWT Issuer Domain**
This must match the issuer in your JWT template. For development instances, this is the Clerk **Frontend API** URL — note it includes `.clerk.` in the subdomain.

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN "https://<your-instance>.clerk.accounts.dev"
```
> **Common mistake:** Using `https://settled-alien-27.accounts.dev` (without `.clerk.`) will look correct but fail. The JWT issuer from Clerk uses the Frontend API URL which always includes `.clerk.`.

**2. Set the Clerk Secret Key**
Convex needs this to send invite emails to new staff. Copy `CLERK_SECRET_KEY` from your `.env.local` file and run:

```bash
npx convex env set CLERK_SECRET_KEY "sk_test_..."
```

Verify they were set:

```bash
npx convex env list
```

---

## 5. Start the Dev Servers

You need **two** terminals running simultaneously:

**Terminal 1 — Convex (backend + live sync):**
```bash
npx convex dev
```

**Terminal 2 — Next.js (frontend):**
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 6. Seed Your Dev User

Your local Convex dev database starts **completely empty**. This is normal and by design — it's isolated from production data.

### Why you need to seed

When you sign in locally, Clerk fires a webhook to create your user in Convex. However, webhooks from Clerk cannot reach `localhost` by default, so your user never gets created and the dashboard keeps loading.

### Option A: Seed via script (recommended for first-time setup)

Create a temporary file `convex/seedDevUser.ts`:

```typescript
import { internalMutation } from "./_generated/server";

export const seedMe = internalMutation(async ({ db }) => {
  const now = Date.now();
  const clerkId = "user_YOUR_CLERK_USER_ID"; // Get this from Clerk Dashboard → Users

  const existing = await db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .first();

  if (existing) return `Already exists: ${existing._id}`;

  const id = await db.insert("users", {
    clerkId,
    email: "your@email.com",
    firstName: "Your",
    lastName: "Name",
    fullName: "Your Name",
    role: "admin",
    platformRole: "superAdmin",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  return `Created: ${id}`;
});
```

Run it:

```bash
npx convex run seedDevUser:seedMe --no-push
```

Then **delete the file** — it's just a one-time bootstrap tool.

### Option B: Use Convex Dashboard

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev)
2. Select your **dev** deployment
3. Open the **Data** tab → `users` table
4. Click **Add document** and fill in the fields manually

### Finding your Clerk User ID

```powershell
$headers = @{ "Authorization" = "Bearer sk_test_YOUR_SECRET_KEY" }
Invoke-RestMethod -Uri "https://api.clerk.com/v1/users?email_address=your@email.com" -Headers $headers | Select-Object -ExpandProperty id
```

---

## 7. Bootstrap an Organization & Add Users (First-Time Only)

The app requires users to belong to an **Organization** to use the dashboard. Even if you're the super admin, you need an org with an admin `staffProfile` to access most features. Here is the exact flow:

1. Sign in at [http://localhost:3000/sign-in](http://localhost:3000/sign-in)
2. Navigate to [http://localhost:3000/superAdmin](http://localhost:3000/superAdmin)
3. **Create a new organization:** This creates the org, assigns you as an `admin` of that org, and generates your `staffProfile` automatically.
4. **Access the Employer Dashboard:** Once the org is created, you can navigate to `/dashboardEmployer`.
5. **Add Workers:** From the Employer Dashboard, you can now invite or add other users to your organization as workers (`staff` role) or promote them to `admin` so they can manage workers too.

Without this flow, any new user will just be stuck as an unassigned "worker" with a confusing empty dashboard.

---

## Architecture: How Users Work

Understanding this will save you a lot of debugging time:

```
Clerk (Auth) ──webhook──► users table (Convex)
                                │
                                ▼
                          staffProfiles table
                          (links user ↔ organization)
                                │
                         ┌──────┴──────┐
                         ▼            ▼
                    orgRole:        orgRole:
                    "admin"         "staff"
                 (Employer)        (Worker)
```

**Every new sign-up starts as `role: "staff"` (worker).** They need to be:
1. Added to an Organization by an Admin, OR
2. Promoted to Admin when creating/owning an org

A user with only a `users` row but **no `staffProfiles` record** will have a broken dashboard — this is the most common bug when seeding local data.

### Role Routing (what happens after sign-in)

| User type | `getPostLoginPath` routes to |
|-----------|------------------------------|
| `platformRole: superAdmin` | `/superAdmin` |
| Has `staffProfile` with `orgRole: "admin"` | `/dashboardEmployer?org=<id>` |
| Legacy `role: "admin"` (no org) | `/dashboardEmployer` |
| Everything else | `/dashboardStaff/<userId>` |

---

## Common Issues

### Dashboard stuck on "Loading workspace..."
- **Cause:** `CLERK_JWT_ISSUER_DOMAIN` in `.env.local` is wrong or still the placeholder value.
- **Fix:** Set it to your actual Clerk domain (e.g. `https://settled-alien-27.accounts.dev`) and restart `yarn dev`.

### `getCurrentUser` returns `null`
- **Cause:** Your user doesn't exist in the local Convex `users` table.
- **Fix:** Run the seed script in Step 5.

### Dashboard loads but shows empty org / no staff
- **Cause:** You have a `users` row but no `staffProfiles` record linking you to an organization.
- **Fix:** Go to `/superAdmin` and create an organization.

### `npx convex dev` shows auth errors
- **Cause:** `CLERK_JWT_ISSUER_DOMAIN` was not set on the Convex deployment.
- **Fix:** Run `npx convex env set CLERK_JWT_ISSUER_DOMAIN "https://<your-clerk-domain>.accounts.dev"`.

### Webhooks not firing locally
- **Cause:** Clerk cannot reach `localhost` from their servers.
- **Workaround:** Use the seed script (Option A above) instead of relying on the webhook. For full webhook testing, use [ngrok](https://ngrok.com) or the [Svix CLI](https://docs.svix.com/receiving/using-svix-play).

---

## Project Structure (Key Directories)

```
timeX/
├── app/                     # Next.js App Router pages
│   ├── (app)/               # Authenticated employer-facing pages
│   │   └── dashboardEmployer/
│   ├── (auth)/              # Sign-in / sign-up pages
│   ├── (landing)/           # Public marketing pages
│   └── (staffView)/         # Staff-facing dashboard
│       └── dashboardStaff/[id]/
├── convex/                  # Backend (Convex functions + schema)
│   ├── schema.ts            # Database schema — read this first
│   ├── users.ts             # User creation, role routing, auth helpers
│   ├── organizations.ts     # Org CRUD + member management
│   ├── staff.ts             # Staff profile management
│   ├── attendance.ts        # Clock in/out logic
│   └── lib/
│       └── auth.ts          # Auth helpers (requireCurrentUser, requireOrgAdmin, etc.)
├── proxy.ts                 # Clerk middleware (public route matcher)
└── .env.local               # Local secrets (never commit this)
```
