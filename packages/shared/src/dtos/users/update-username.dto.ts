import { z } from "zod";
import { updateUsernameSchema } from "../../schemas";

export type UpdateUsernameDto = z.infer<typeof updateUsernameSchema>;
