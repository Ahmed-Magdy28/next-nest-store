import { z } from "zod";

import { passwordSchema } from "../../../common/validation";

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1),
  password: passwordSchema,
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
