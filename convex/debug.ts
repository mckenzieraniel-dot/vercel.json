import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getFirstReleaseAudioUrl = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const release = await ctx.db.query("releases").first();
    if (!release || !release.audioUrl) return null;
    return await ctx.storage.getUrl(release.audioUrl);
  },
});

export const updateFirstReleaseAudio = mutation({
  args: { storageId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const first = await ctx.db.query("releases").first();
    if (first) {
      await ctx.db.patch(first._id, { audioUrl: args.storageId });
    }
    return null;
  },
});

export const getOrders = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});
