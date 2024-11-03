import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { testSchema } from "../schemas";
import { verifyAuth } from "@/lib/auth/session-middleware";

const app = new Hono().post(
  "/test",
  verifyAuth(),
  zValidator("json", testSchema),
  async (c) => {
    const { name } = c.req.valid("json");
    const user = c.get("authUser");

    return c.json({ success: true }, 200);
  }
);
export default app;
