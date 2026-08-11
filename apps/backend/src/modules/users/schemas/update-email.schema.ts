import { z } from "zod";

import { emailSchema } from "../../../common/validation";

export const updateEmailSchema = z.object({
  email: emailSchema,
});

export type UpdateEmailDto = z.infer<typeof updateEmailSchema>;
