import { Hono } from "hono";
import { handle } from "hono/vercel";
import CredentialsProvider from "@auth/core/providers/credentials";
import Google from "next-auth/providers/google";

import bcrypt from "bcryptjs";
import { loginSchema } from "@/features/auth/schemas";

import user from "@/features/auth/server/route";
import billboards from "@/features/billboards/server/route";
import admin from "@/features/admin/server/route";

import { getUserByEmail } from "@/features/auth/queries";
import { authHandler, initAuthConfig } from "@/features/auth/middlewares";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { DefaultSession } from "@auth/core/types";

const app = new Hono().basePath("/api");

app.use(
  "*",
  initAuthConfig((c) => ({
    secret: process.env.AUTH_SECRET!,
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
          const validatedFields = loginSchema.safeParse(credentials);

          if (validatedFields.success) {
            const { email, password } = validatedFields.data;

            const user = await getUserByEmail(email);

            if (!user || !user.password) return null;

            const passwordsMatch = await bcrypt.compare(
              password,
              user.password
            );

            if (passwordsMatch)
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
          }

          return null;
        },
      }),
    ],
    events: {
      async linkAccount({ user, account }) {
        if (!user || !user.email) return;

        const existingUser = await getUserByEmail(user?.email);

        if (existingUser) {
          console.log(
            `Linking ${account.provider} account to user: ${user.email}`
          );
        }
      },
    },
    callbacks: {
      async session({ session, token }) {
        session.user = {
          ...session.user,
          id: token.sub as string,
          name: token.name as string,
          email: token.email as string,
          image: token.picture as string,
        };
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.id;
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image;
        }
        return token;
      },
    },
  }))
);

app.use("/auth/*", authHandler());

const routes = app
  .route("/user", user)
  .route("/admin", admin)
  .route("/admin/billboards", billboards);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
