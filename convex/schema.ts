import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  releases: defineTable({
    title: v.string(),
    artist: v.string(),
    year: v.number(),
    coverUrl: v.string(),
    audioUrl: v.optional(v.string()),
    genres: v.array(v.string()),
    description: v.string(),
    price: v.optional(v.number()),
    spotifyUrl: v.optional(v.string()),
    appleMusicUrl: v.optional(v.string()),
    isFeatured: v.boolean(),
  }),
  events: defineTable({
    date: v.string(),
    venue: v.string(),
    location: v.string(),
    ticketUrl: v.optional(v.string()),
    isSoldOut: v.boolean(),
  }),
  newsletter: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),

  orders: defineTable({
    releaseId: v.id("releases"),
    email: v.string(),
    stripeSessionId: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
    amount: v.number(),
    delivered: v.optional(v.boolean()),
  }).index("by_session_id", ["stripeSessionId"]),
});
