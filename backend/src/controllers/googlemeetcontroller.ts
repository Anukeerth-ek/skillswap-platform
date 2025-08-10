import { Request, Response } from "express";
import { oAuth2Client } from "../lib/googleCalendar";
import { saveTokensToDB } from "../lib/tokenStorage"; // your custom token DB logic

export const startGoogleOAuth = (req: Request, res: Response) => {
  console.log("anukeer", req)
  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
  ];

  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
    state: String(req.query.userId),
  });

  res.redirect(url);
};

export const handleGoogleOAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).send("No code provided");
    return
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);

    // Get mentor ID from session or query param
  const mentorUserId = req.query.state as string;

    if (!mentorUserId) {
      res.status(400).send("No mentor user ID provided");
      return
    }

    await saveTokensToDB(mentorUserId, tokens as any);

    res.redirect("http://localhost:3000/frontend/sessions");
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
};

