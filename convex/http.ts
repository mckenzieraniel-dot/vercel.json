import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/test",
  method: "GET",
  handler: httpAction(async (_ctx, _request) => {
    return new Response("OK", { status: 200 });
  }),
});

http.route({
  pathPrefix: "/storage/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const storageId = url.pathname.split("/").pop();
    console.log("HTTP Action: Fetching storageId:", storageId);
    if (!storageId) {
      return new Response("Missing storageId", { status: 400 });
    }
    const blob = await ctx.storage.get(storageId);
    console.log("HTTP Action: Blob found:", !!blob);
    if (!blob) {
      return new Response("File not found", { status: 404 });
    }
    
    return new Response(blob, {
      headers: {
        "Content-Type": blob.type || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }),
});

auth.addHttpRoutes(http);

export default http;
