import { z } from "zod";

import { usernameSchema } from "../common";

export const updateUsernameSchema = z.object({
  username: usernameSchema,
});
