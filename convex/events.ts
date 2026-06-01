import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("events"),
      _creationTime: v.number(),
      date: v.string(),
      venue: v.string(),
      location: v.string(),
      ticketUrl: v.optional(v.string()),
      isSoldOut: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("events").order("asc").collect();
  },
});

export const create = mutation({
  args: {
    date: v.string(),
    venue: v.string(),
    location: v.string(),
    ticketUrl: v.optional(v.string()),
    isSoldOut: v.boolean(),
  },
  returns: v.id("events"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args);
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
