import { registerSchema } from "../../../../src/modules/auth/schemas/register.schema";

describe("registerSchema", () => {
  const validData = {
    username: "Ahmed",
    email: "ahmed@example.com",
    password: "StrongPassword123!",
  };

  it("should accept valid registration data", () => {
    const result = registerSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should normalize the email", () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: "AHMED@EXAMPLE.COM",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("ahmed@example.com");
    }
  });

  it("should reject an invalid email", () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a password that is too short", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "short",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a password that is too long", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "a".repeat(256),
    });

    expect(result.success).toBe(false);
  });

  it("should reject when username is the same as password", () => {
    const result = registerSchema.safeParse({
      ...validData,
      username: "Ahmed",
      password: "Ahmed",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["password"],
            message: "Password must not be the same as username.",
          }),
        ]),
      );
    }
  });
});
