import { Request, Response } from "express";
import { oAuth2Client } from "../lib/googleCalendar";
import { saveTokensToDB } from "../lib/tokenStorage"; // your custom token DB logic
import { prisma } from "../lib/prisma";

export const startGoogleOAuth = (req: Request, res: Response) => {
  const scopes = ["https://www.googleapis.com/auth/calendar.events"];

  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  res.redirect(url);
};

export const handleGoogleOAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const userId = (req as any).user.id; // from authenticateUser middleware

  try {
    const { tokens } = await oAuth2Client.getToken(code);

    await prisma.googleToken.upsert({
      where: { userId },
      update: {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        scope: tokens.scope,
        tokenType: tokens.token_type,
        expiryDate: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
      },
      create: {
        userId,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        scope: tokens.scope,
        tokenType: tokens.token_type,
        expiryDate: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
      },
    });

    res.send("✅ Google Calendar connected! You can now approve sessions.");
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).send("Failed to connect Google account");
  }
};
