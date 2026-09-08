import { z } from "zod";
import { emailSchema } from "../common";

export const updateEmailSchema = z.object({
  email: emailSchema,
});
