import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

export type LoginDto = z.infer<typeof loginSchema>;
