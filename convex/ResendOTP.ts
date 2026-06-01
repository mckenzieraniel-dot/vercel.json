import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.RESEND_API_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    return "12345678";
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    console.log(`Verification code for ${email}: ${token}`);
    if (!provider.apiKey || provider.apiKey === "undefined") {
      console.log("No RESEND_API_KEY found, skipping actual email send.");
      return;
    }
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "TENSHON <auth@tenshon.shop>",
      to: [email],
      subject: "Your sign-in code",
      text: `Your verification code is: ${token}`,
    });
    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
