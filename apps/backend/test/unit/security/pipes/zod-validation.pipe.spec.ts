import { BadRequestException, type ArgumentMetadata } from "@nestjs/common";
import { z } from "zod";

import { ZodValidationPipe } from "../../../../src/common/pipes/zod-validation.pipe";

describe("ZodValidationPipe", () => {
  const metadata: ArgumentMetadata = {
    type: "body",
  };

  describe("transform", () => {
    it("should return parsed data when validation succeeds", () => {
      const schema = z.object({
        email: z.string().trim().toLowerCase().pipe(z.email()),
        name: z.string().trim(),
      });

      const pipe = new ZodValidationPipe(schema);

      const result = pipe.transform(
        {
          email: "  AHMED@EXAMPLE.COM  ",
          name: "  Ahmed  ",
        },
        metadata,
      );

      expect(result).toEqual({
        email: "ahmed@example.com",
        name: "Ahmed",
      });
    });

    it("should throw BadRequestException when validation fails", () => {
      const schema = z.object({
        email: z.email(),
        password: z.string().min(8),
      });

      const pipe = new ZodValidationPipe(schema);

      expect(() =>
        pipe.transform(
          {
            email: "invalid-email",
            password: "short",
          },
          metadata,
        ),
      ).toThrow(BadRequestException);
    });

    it("should include field errors in the exception", () => {
      const schema = z.object({
        email: z.email(),
        password: z.string().min(8),
      });

      const pipe = new ZodValidationPipe(schema);

      expect(() =>
        pipe.transform(
          {
            email: "invalid-email",
            password: "short",
          },
          metadata,
        ),
      ).toThrow(
        new BadRequestException([
          "Invalid email address",
          "Too small: expected string to have >=8 characters",
        ]),
      );
    });

    it("should include form errors", () => {
      const schema = z
        .object({
          username: z.string(),
          password: z.string(),
        })
        .refine((data) => data.username !== data.password, {
          message: "Password must not be the same as username.",
        });

      const pipe = new ZodValidationPipe(schema);

      expect(() =>
        pipe.transform(
          {
            username: "Ahmed",
            password: "Ahmed",
          },
          metadata,
        ),
      ).toThrow(
        new BadRequestException(["Password must not be the same as username."]),
      );
    });
  });
});
