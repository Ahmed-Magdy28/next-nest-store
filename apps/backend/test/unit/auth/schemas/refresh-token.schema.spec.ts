import { refreshTokenSchema } from "../../../../src/modules/auth/schemas/refresh-token.schema";

describe("refreshTokenSchema", () => {
  it("should accept an empty object", () => {
    const result = refreshTokenSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it("should strip unexpected fields", () => {
    const result = refreshTokenSchema.safeParse({
      refreshToken: "some-refresh-token",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("should reject a non-object value", () => {
    const result = refreshTokenSchema.safeParse("refresh-token");

    expect(result.success).toBe(false);
  });
});
