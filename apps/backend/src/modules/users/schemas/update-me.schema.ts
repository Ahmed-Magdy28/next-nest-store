import { z } from "zod";

import { emailSchema, usernameSchema } from "../../../common/validation";

export const updateMeSchema = z
  .object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
  })
  .refine((data) => data.username || data.email, {
    message: "At least one field must be provided.",
  });

export type UpdateMeDto = z.infer<typeof updateMeSchema>;
