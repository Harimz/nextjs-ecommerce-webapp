import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { verifyAuth } from "@/features/auth/middlewares";
import { uploadFileToS3 } from "@/lib/s3";

const app = new Hono().get("/admin", verifyAuth(), async (c) => {});

export default app;
