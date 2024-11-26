import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { verifyAdmin, verifyAuth } from "@/features/auth/middlewares";
import { removeFileFromS3, uploadFileToS3 } from "@/lib/s3";
import { removeImageSchema } from "../shemas";

const app = new Hono()
  .post("/images", verifyAuth(), verifyAdmin(), async (c) => {
    try {
      const formData = await c.req.formData();

      const uploadedFiles: string[] = [];

      const files = formData.getAll("file");
      if (!files || files.length === 0) {
        return c.json({ error: "No files provided" }, 400);
      }

      for (const file of files) {
        if (file instanceof File) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const contentType = file.type;
          const fileUrl = await uploadFileToS3(buffer, file.name, contentType);

          uploadedFiles.push(fileUrl);
        } else {
          console.error("Invalid file format:", file);
          return c.json({ error: "Invalid file format" }, 400);
        }
      }

      return c.json({ success: "Files uploaded", uploadedFiles }, 200);
    } catch (error) {
      console.error("Upload Error:", error);
      return c.json({ error: "Could not upload files" }, 500);
    }
  })
  .delete("/images/:imageUrl", verifyAuth(), verifyAdmin(), async (c) => {
    try {
      const encodedImageUrl = c.req.param("imageUrl");
      const imageUrl = decodeURIComponent(encodedImageUrl);

      console.log("WE ION HEREEE");

      const response = await removeFileFromS3(imageUrl);

      if (!response.success === true) {
        return c.json({ error: "Could not delete the image" }, 500);
      }

      return c.json({ success: true });
    } catch (error) {
      console.error("Delete Error:", error);
      return c.json({ error: "Could not delete file" }, 500);
    }
  });

export default app;
