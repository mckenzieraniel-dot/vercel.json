import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("releases"),
      _creationTime: v.number(),
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
    })
  ),
  handler: async (ctx) => {
    const releases = await ctx.db.query("releases").collect();
    return Promise.all(releases.map(async (r) => ({
      ...r,
      coverUrl: (r.coverUrl && !r.coverUrl.startsWith('http')) ? (await ctx.storage.getUrl(r.coverUrl)) || r.coverUrl : r.coverUrl,
      audioUrl: (r.audioUrl && !r.audioUrl.startsWith('http')) ? (await ctx.storage.getUrl(r.audioUrl)) || r.audioUrl : r.audioUrl,
    })));
  },
});

export const create = mutation({
  args: {
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
  },
  returns: v.id("releases"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("releases", args);
  },
});

export const remove = mutation({
  args: { id: v.id("releases") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

export const get = query({
  args: { id: v.id("releases") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("releases"),
      _creationTime: v.number(),
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
    })
  ),
  handler: async (ctx, args) => {
    const release = await ctx.db.get(args.id);
    if (!release) return null;
    return {
      ...release,
      coverUrl: (release.coverUrl && !release.coverUrl.startsWith('http')) ? (await ctx.storage.getUrl(release.coverUrl)) || release.coverUrl : release.coverUrl,
      audioUrl: (release.audioUrl && !release.audioUrl.startsWith('http')) ? (await ctx.storage.getUrl(release.audioUrl)) || release.audioUrl : release.audioUrl,
    };
  },
});
