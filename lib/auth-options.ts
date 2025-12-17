import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { LIMITS } from "@/lib/limits";

const MAX_ATTEMPTS = LIMITS.BLOCKED_USER;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("invalidCredentials");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("invalidCredentials");
        }

        if (user.lockUntil && user.lockUntil > new Date()) {
          throw new Error("accountLocked");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          const attempts = user.loginAttempts + 1;

          if (attempts >= MAX_ATTEMPTS) {
            await db.user.update({
              where: { id: user.id },
              data: {
                loginAttempts: attempts,
                lockUntil: new Date(Date.now() + 5 * 60 * 1000)
              },
            });

            throw new Error("accountLocked");
          }

          await db.user.update({
            where: { id: user.id },
            data: { loginAttempts: attempts },
          });

          throw new Error("invalidCredentials");
        }

        await db.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockUntil: null,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
