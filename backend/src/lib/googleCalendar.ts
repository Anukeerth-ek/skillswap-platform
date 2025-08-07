import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Assume you've stored the user's tokens after auth
export const setCredentials = (tokens: any) => {
  oAuth2Client.setCredentials(tokens);
};

export const createMeetEvent = async ({
  summary,
  description,
  startTime,
  endTime,
}: {
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
}) => {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const res = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary,
      description,
      start: {
        dateTime: startTime,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endTime,
        timeZone: 'Asia/Kolkata',
      },
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(7),
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  });

  return res.data.hangoutLink;
};
