import { z } from "zod";
import { changePasswordSchema } from "../../schemas";

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
