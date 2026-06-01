import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./ResendOTP";

if (!process.env.SITE_URL) {
  process.env.SITE_URL = process.env.CONVEX_SITE_URL?.replace(".convex.site", ".app.cto.new");
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendOTP],
});
