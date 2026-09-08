import { z } from "zod";
import { refreshTokenSchema } from "../../schemas";

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
