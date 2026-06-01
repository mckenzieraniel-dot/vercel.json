import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: { email: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    
    if (!existing) {
      await ctx.db.insert("newsletter", { email: args.email });
    }
    return null;
  },
});

export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("newsletter"),
    _creationTime: v.number(),
    email: v.string(),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("newsletter").order("desc").collect();
  },
});
