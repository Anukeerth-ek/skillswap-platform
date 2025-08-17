import { google } from "googleapis";

export const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

type CreateMeetArgs = {
  summary: string;
  description?: string;
  startTime: string;
  endTime: string;
  timeZone?: string;
  attendees?: { email: string }[];
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
};

export async function createMeetEvent({
  summary,
  description,
  startTime,
  endTime,
  timeZone = "UTC",
  attendees = [],
  tokens,
}: CreateMeetArgs): Promise<string> {
  try {
    oAuth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const event = {
      summary,
      description,
      start: { dateTime: startTime, timeZone },
      end: { dateTime: endTime, timeZone },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `skillswap-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const created = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event as any,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    const meetLink =
      created.data.hangoutLink ||
      created.data.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video"
      )?.uri;

    if (!meetLink) {
      console.error("Calendar API response:", created.data);
      throw new Error("No Meet link returned from Calendar API");
    }

    return meetLink;
  } catch (error) {
    console.error("Error creating Google Meet event:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create Google Meet: ${error.message}`);
    }
    throw new Error("Failed to create Google Meet event");
  }
}
