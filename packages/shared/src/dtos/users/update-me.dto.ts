import { z } from "zod";
import { updateMeSchema } from "../../schemas";

export type UpdateMeDto = z.infer<typeof updateMeSchema>;
