import { z } from "zod";

import { emailSchema } from "../../../common/validation";

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
