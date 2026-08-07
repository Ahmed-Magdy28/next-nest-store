import { loginSchema } from "../../../../src/modules/auth/schemas/login.schema";

describe("loginSchema", () => {
  const validData = {
    email: "ahmed@example.com",
    password: "StrongPassword123!",
  };

  it("should accept valid login data", () => {
    const result = loginSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should normalize the email", () => {
    const result = loginSchema.safeParse({
      ...validData,
      email: "AHMED@EXAMPLE.COM",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("ahmed@example.com");
    }
  });

  it("should reject an invalid email", () => {
    const result = loginSchema.safeParse({
      ...validData,
      email: "invalid-email",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a password that is too short", () => {
    const result = loginSchema.safeParse({
      ...validData,
      password: "short",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a password that is too long", () => {
    const result = loginSchema.safeParse({
      ...validData,
      password: "a".repeat(256),
    });

    expect(result.success).toBe(false);
  });

  it("should preserve the password", () => {
    const result = loginSchema.safeParse(validData);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.password).toBe(validData.password);
    }
  });
});
