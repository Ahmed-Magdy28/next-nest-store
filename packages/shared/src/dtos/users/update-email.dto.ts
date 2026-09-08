import { z } from "zod";
import { updateEmailSchema } from "../../schemas";

export type UpdateEmailDto = z.infer<typeof updateEmailSchema>;
