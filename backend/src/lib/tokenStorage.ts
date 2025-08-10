// backend/src/lib/tokenStorage.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface GoogleTokens {
     access_token?: string;
     refresh_token?: string | undefined;
     scope?: string;
     token_type?: string;
     expiry_date?: number;
}

export async function saveTokensToDB(userId: string, tokens: GoogleTokens) {
     if (!userId) {
          throw new Error("No userId provided when saving Google tokens");
     }

     return prisma.googleToken.upsert({
          where: { userId },
          update: {
               accessToken: tokens.access_token || "",
               refreshToken: tokens.refresh_token || undefined,
               scope: tokens.scope || "",
               tokenType: tokens.token_type || "",
               expiryDate: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
          },
          create: {
               userId,
               accessToken: tokens.access_token || "",
               refreshToken: tokens.refresh_token || '',
               scope: tokens.scope || "",
               tokenType: tokens.token_type || "",
               expiryDate: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
          },
     });
}

export async function getTokensFromDB(userId: string) {
     return prisma.googleToken.findUnique({
          where: { userId },
     });
}
