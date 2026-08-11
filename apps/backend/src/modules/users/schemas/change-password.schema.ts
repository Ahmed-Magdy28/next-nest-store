import { z } from "zod";

import { passwordSchema } from "../../../common/validation";

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password.",
  });

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
