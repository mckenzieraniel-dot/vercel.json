import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db.query("releases").collect();
    if (existing.length > 0) return null;

    await ctx.db.insert("releases", {
      title: "Blue Note Sessions",
      artist: "Tenshon",
      year: 2023,
      coverUrl: "https://images.unsplash.com/photo-1514525253344-f856d397e33a?auto=format&fit=crop&q=80&w=800",
      genres: ["Jazz"],
      description: "A deep dive into the roots of Jamaican jazz.",
      price: 25,
      isFeatured: true,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    });

    await ctx.db.insert("releases", {
      title: "Midnight City",
      artist: "Tenshon",
      year: 2022,
      coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800",
      genres: ["Soul"],
      description: "The rhythm of the night in Kingston.",
      price: 20,
      isFeatured: true,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    });

    return null;
  },
});
