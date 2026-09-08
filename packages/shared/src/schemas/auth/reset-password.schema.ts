import { z } from "zod";
import { passwordSchema } from "../common";

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1),
  password: passwordSchema,
});
