import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET?.trim();
    if (!webhookSecret) {
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing Svix headers", { status: 400 });
    }

    // Must be raw body string — JSON parse/stringify breaks Svix signatures.
    const payload = await request.text();
    const svixHeaders = {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    };
    const wh = new Webhook(webhookSecret);
    let event:
      | {
          type: string;
          data: {
            id: string;
            first_name?: string | null;
            last_name?: string | null;
            username?: string | null;
            email_addresses?: { email_address: string }[];
            public_metadata?: { role?: string };
          };
        }
      | undefined;

    try {
      event = wh.verify(payload, svixHeaders) as typeof event;
    } catch (error) {
      console.error("Webhook verification failed:", error);
      console.error(
        "Check CLERK_WEBHOOK_SECRET matches Signing secret for this endpoint in Clerk (sweeping-clam app). Run: yarn sync:clerk-webhook-secret"
      );
      return new Response("Invalid webhook signature", { status: 400 });
    }

    if (!event) return new Response("Invalid webhook event", { status: 400 });

    const primaryEmail =
      event.data.email_addresses?.[0]?.email_address ||
      `${event.data.id}@users.timex.local`;
    const role = event.data.public_metadata?.role;

    if (event.type === "user.created" || event.type === "user.updated") {
      console.log("Clerk webhook received:", event.type, event.data.id);
      await ctx.runMutation(internal.users.upsertFromClerk, {
        clerkId: event.data.id,
        email: primaryEmail,
        firstName: event.data.first_name ?? undefined,
        lastName: event.data.last_name ?? undefined,
        fullName:
          `${event.data.first_name ?? ""} ${event.data.last_name ?? ""}`.trim() ||
          event.data.username ||
          undefined,
        role: role === "admin" || role === "manager" || role === "staff" ? role : "staff",
        isActive: true,
      });
    } else if (event.type === "user.deleted") {
      console.log("Clerk webhook received:", event.type, event.data.id);
      await ctx.runMutation(internal.users.removeByClerkId, {
        clerkId: event.data.id,
      });
    }

    return new Response("ok", { status: 200 });
  }),
});

export default http;
