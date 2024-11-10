import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth/session-middleware";
import { CurrentUserResponse } from "../types";
import { getUserByEmail } from "@/features/auth/queries";
import { registerSchema } from "@/features/auth/schemas";

const app = new Hono()
  .get("/current", verifyAuth(), async (c) => {
    const session = c.get("authUser");

    if (!session || !session.session.user) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const response: CurrentUserResponse = {
      data: {
        id: session.session.user.id ?? "",
        name: session.session.user.name ?? "",
        email: session.session.user.email ?? "",
      },
    };

    return c.json(response, 200);
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password, confirmPassword } = c.req.valid("json");

    if (password !== confirmPassword) {
      return c.json({ error: "Passwords do not match" }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return c.json({ error: "Email already in use" }, 400);
    }

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return c.json({ success: true }, 200);
  });

export default app;
