import { passwordSchema } from "../../../../src/common/validation/password.schema";

describe("passwordSchema", () => {
  it("should accept a valid password", () => {
    const result = passwordSchema.safeParse("StrongPass123!");

    expect(result.success).toBe(true);
  });

  it("should reject a password that is too short", () => {
    const result = passwordSchema.safeParse("A1!");

    expect(result.success).toBe(false);
  });

  it("should reject a password that is too long", () => {
    const result = passwordSchema.safeParse("A".repeat(256));

    expect(result.success).toBe(false);
  });

  it("should reject a password without uppercase letters", () => {
    const result = passwordSchema.safeParse("strongpass123!");

    expect(result.success).toBe(false);
  });

  it("should reject a password without lowercase letters", () => {
    const result = passwordSchema.safeParse("STRONGPASS123!");

    expect(result.success).toBe(false);
  });

  it("should reject a password without a digit", () => {
    const result = passwordSchema.safeParse("StrongPassword!");

    expect(result.success).toBe(false);
  });

  it("should reject a password without a special character", () => {
    const result = passwordSchema.safeParse("StrongPassword123");

    expect(result.success).toBe(false);
  });

  it("should reject a non-string value", () => {
    const result = passwordSchema.safeParse(12345678);

    expect(result.success).toBe(false);
  });
});
