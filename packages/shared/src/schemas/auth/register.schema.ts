import { z } from "zod";

import { passwordSchema, usernameSchema, emailSchema } from "../common";
import { PASSWORD_MUST_NOT_EQUAL_USERNAME_MSG } from "../../constants";

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .refine((data) => data.username !== data.password, {
    path: ["password"],
    message: PASSWORD_MUST_NOT_EQUAL_USERNAME_MSG,
  });
