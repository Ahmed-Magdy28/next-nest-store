import { emailSchema } from "../../../../src/common/validation/email.schema";

describe("emailSchema", () => {
  it("should accept a valid email", () => {
    const result = emailSchema.safeParse("ahmed@example.com");

    expect(result.success).toBe(true);
  });

  it("should normalize uppercase email", () => {
    const result = emailSchema.safeParse("AHMED@EXAMPLE.COM");

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toBe("ahmed@example.com");
    }
  });

  it("should reject an invalid email", () => {
    const result = emailSchema.safeParse("invalid-email");

    expect(result.success).toBe(false);
  });

  it("should reject an empty email", () => {
    const result = emailSchema.safeParse("");

    expect(result.success).toBe(false);
  });

  it("should reject a non-string value", () => {
    const result = emailSchema.safeParse(12345);

    expect(result.success).toBe(false);
  });
});
