// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; // Or GitHub, Google, etc.
import { authOptions } from "../../../../lib/auth"; // You can also define inline if preferred

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
