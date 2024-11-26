import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { verifyAdmin, verifyAuth } from "@/features/auth/middlewares";
import { categoryFormSchema } from "../schemas";

const app = new Hono()
  .post(
    "/",
    zValidator("json", categoryFormSchema),
    verifyAuth(),
    verifyAdmin(),
    async (c) => {
      try {
        const { name } = c.req.valid("json");

        await db.category.create({
          data: {
            name,
          },
        });

        return c.json({ success: true });
      } catch (error) {
        console.error(error);
        return c.json({ error: true }, 500);
      }
    }
  )
  .patch(
    "/:categoryId",
    zValidator("form", categoryFormSchema),
    verifyAuth(),
    verifyAdmin(),
    async (c) => {
      try {
        const { name } = c.req.valid("form");
        const categoryId = c.req.param("categoryId");

        await db.category.update({
          where: {
            id: categoryId,
          },
          data: {
            name,
          },
        });

        return c.json({ success: true });
      } catch (error) {
        console.error(error);
        return c.json({ error: true }, 500);
      }
    }
  )
  .delete("/:categoryId", verifyAuth(), verifyAdmin(), async (c) => {
    try {
      const categoryId = c.req.param("categoryId");

      await db.category.delete({
        where: {
          id: categoryId,
        },
      });

      return c.json({ success: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: true }, 500);
    }
  });

export default app;
