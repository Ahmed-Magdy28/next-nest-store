import { z } from "zod";

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1),
});

export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;
