import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { setCookie, deleteCookie } from "hono/cookie";
import { loginSchema, registerSchema } from "../schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "../queries";
import { db } from "@/lib/db";

const app = new Hono().post(
  "/register",
  zValidator("json", registerSchema),
  async (c) => {
    const { name, email, password, confirmPassword } = c.req.valid("json");

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
  }
);

export default app;
