import { Hono } from "hono";
import { handle } from "hono/vercel";
import CredentialsProvider from "@auth/core/providers/credentials";
import Google from "next-auth/providers/google";

import bcrypt from "bcryptjs";
import { loginSchema } from "@/features/auth/schemas";

import auth from "@/features/auth/server/route";
import test from "@/features/home/server/route";
import user from "@/features/user/server/route";

import { getUserByEmail } from "@/features/auth/queries";
import { authHandler, initAuthConfig } from "@/lib/auth/session-middleware";

const app = new Hono().basePath("/api");

app.use(
  "*",
  initAuthConfig((c) => ({
    secret: process.env.AUTH_SECRET!,
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
              };
          }

          return null;
        },
      }),
    ],
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
  .route("/auth", auth)
  .route("/test", test)
  .route("/user", user);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
