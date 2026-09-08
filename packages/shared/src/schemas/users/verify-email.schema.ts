import { z } from "zod";

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1),
});
