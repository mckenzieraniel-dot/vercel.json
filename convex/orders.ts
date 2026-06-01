import { v } from "convex/values";
import { mutation, internalMutation, query } from "./_generated/server";

export const list = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const remove = mutation({
  args: { id: v.id("orders") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

export const createOrder = mutation({
  args: {
    releaseId: v.id("releases"),
    email: v.string(),
    stripeSessionId: v.string(),
    amount: v.number(),
  },
  returns: v.id("orders"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      ...args,
      status: "pending",
    });
  },
});

export const fulfillOrder = internalMutation({
  args: { sessionId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_session_id", (q) => q.eq("stripeSessionId", args.sessionId))
      .unique();
    
    if (order) {
      await ctx.db.patch(order._id, { status: "completed" });
    }
    return null;
  },
});

export const getOrder = query({
  args: { orderId: v.id("orders") },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const markAsDelivered = internalMutation({
  args: { orderId: v.id("orders") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { delivered: true, status: "completed" });
    return null;
  },
});
