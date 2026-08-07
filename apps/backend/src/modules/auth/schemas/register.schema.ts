import { z } from "zod";

import {
  passwordSchema,
  usernameSchema,
  emailSchema,
} from "../../../common/validation/";

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .refine((data) => data.username !== data.password, {
    path: ["password"],
    message: "Password must not be the same as username.",
  });

export type RegisterDto = z.infer<typeof registerSchema>;
