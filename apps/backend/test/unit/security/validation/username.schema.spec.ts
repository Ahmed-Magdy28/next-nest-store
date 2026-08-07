import { usernameSchema } from "../../../../src/common/validation/username.schema";

describe("usernameSchema", () => {
  it("should accept a valid username", () => {
    const result = usernameSchema.safeParse("Ahmed");

    expect(result.success).toBe(true);
  });

  it("should trim surrounding whitespace", () => {
    const result = usernameSchema.safeParse("  Ahmed  ");

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toBe("Ahmed");
    }
  });

  it("should reject a username that is too short", () => {
    const result = usernameSchema.safeParse("a");

    expect(result.success).toBe(false);
  });

  it("should reject a username that is too long", () => {
    const result = usernameSchema.safeParse("a".repeat(256));

    expect(result.success).toBe(false);
  });

  it("should reject an invalid username format", () => {
    const result = usernameSchema.safeParse("Ahmed@123");

    expect(result.success).toBe(false);
  });

  it("should reject a non-string value", () => {
    const result = usernameSchema.safeParse(12345);

    expect(result.success).toBe(false);
  });
});
