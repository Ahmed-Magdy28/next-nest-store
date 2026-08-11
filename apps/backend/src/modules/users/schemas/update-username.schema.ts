import { z } from "zod";

import { usernameSchema } from "../../../common/validation";

export const updateUsernameSchema = z.object({
  username: usernameSchema,
});

export type UpdateUsernameDto = z.infer<typeof updateUsernameSchema>;
