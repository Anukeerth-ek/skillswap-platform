import express from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma"; // or your prisma import

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI! // e.g. http://localhost:4000/api/google/callback
);

type SafeTokens = {
  accessToken: string;
  refreshToken: string;
  scope?: string;
  tokenType?: string;
  expiryDate?: bigint | null;
};

function normalizeTokens(tokens: any): SafeTokens {
  if (!tokens?.access_token) throw new Error("No access token from Google");
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? "",
    scope: tokens.scope,
    tokenType: tokens.token_type,
    // prisma BigInt field: convert JS number | undefined to BigInt | null
    expiryDate: typeof tokens.expiry_date === "number" ? BigInt(tokens.expiry_date) : null,
  };
}

// Start OAuth. The frontend will redirect here.
router.get("/auth", (req:any, res:any) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Missing user token" });

  // Validate the JWT early (optional but nicer errors)
  try {
    const decoded = jwt.verify(String(token), process.env.JWT_SECRET!) as { userId: string };
    if (!decoded?.userId) throw new Error("Bad token payload");
  } catch {
    return res.status(400).json({ message: "Invalid token" });
  }

  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state: String(token), // we pass the *JWT* here
  });

  return res.redirect(url);
});

// OAuth callback
router.get("/callback", async (req:any, res:any) => {
  const code = String(req.query.code || "");
  const stateToken = String(req.query.state || "");

  if (!code || !stateToken) {
    res.status(400).send("Missing code or state");
    return
  }

  try {
    const decoded = jwt.verify(stateToken, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;
    if (!userId) {
      res.status(400).send("Invalid token data");
      return
    }

    const { tokens } = await oauth2Client.getToken(code);
    const safe = normalizeTokens(tokens);

    await prisma.googleToken.upsert({
      where: { userId },
      update: safe,
      create: { userId, ...safe },
    });

    // ✅ After success, bounce back to your frontend sessions page
    const redirectUrl = process.env.FRONTEND_SESSIONS_URL || "http://localhost:3000/sessions";
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return res.status(500).send("Google authentication failed");
  }
});

export default router;

