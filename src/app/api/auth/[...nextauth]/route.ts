import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { SafeUser } from "@/types";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            // Missing credentials
            throw new Error("Missing email or password");
          }

          // Basic email format validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(credentials.email)) {
            throw new Error("Invalid email format");
          }

          // Password length check
          if (credentials.password.length < 8) {
            throw new Error("Password must be at least 8 characters");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Don't reveal if user exists or not
          if (!user || !user.password) {
            throw new Error("Invalid email or password");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!passwordMatch) {
            throw new Error("Invalid email or password");
          }

          const { password, createdAt, updatedAt, ...safeUser } = user;
          return safeUser as SafeUser;
        } catch (err: any) {
          // NextAuth expects null for failed login, but you can log the error
          console.error("Authorize error:", err.message);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.sub as string,
        name: token.name as string,
        email: token.email as string,
        image: token.image as string,
        role: token.role as "USER" | "ADMIN",
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
