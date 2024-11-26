import { z } from "zod";

export const billboardFormSchema = z.object({
  label: z.string().min(1),
  message: z.string().min(1),
  imageUrl: z.array(z.string()).nonempty(),
});

export const removeImageSchema = z.object({
  imageUrl: z.string(),
});
