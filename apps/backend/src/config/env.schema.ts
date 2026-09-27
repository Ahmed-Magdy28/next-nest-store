import { z } from "zod";

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    BACKEND_PORT: z.coerce.number().default(3001),

    DATABASE_URL: z.string().url(),

    CORS_ORIGIN: z.string().optional(),

    JWT_SECRET: z.string().min(32),

    ADMIN_SECRET: z.string().min(16).optional(),

    ENABLE_GUEST_CART: z
      .enum(["true", "false"])
      .default("true")
      .transform((val) => val === "true"),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" && !env.CORS_ORIGIN) {
      ctx.addIssue({
        code: "custom",
        path: ["CORS_ORIGIN"],
        message: "CORS_ORIGIN is required in production",
      });
    }
  });

export type Env = z.infer<typeof envSchema>;
