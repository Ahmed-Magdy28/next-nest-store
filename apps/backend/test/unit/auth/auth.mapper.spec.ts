import type { User } from "@repo/database";

import { AuthMapper } from "../../../src/modules/auth/mappers/auth.mapper";

describe("AuthMapper", () => {
  const user: User = {
    id: "user-id",
    email: "ahmed@example.com",
    username: "Ahmed",
    passwordHash: "hashed-password",
    refreshTokenHash: "hashed-refresh-token",
    role: "USER",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("toAuthUserDto", () => {
    it("should map a user to AuthUserDto", () => {
      const result = AuthMapper.toAuthUserDto(user);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it("should not expose sensitive fields", () => {
      const result = AuthMapper.toAuthUserDto(user);

      expect(result).not.toHaveProperty("passwordHash");
      expect(result).not.toHaveProperty("refreshTokenHash");
      expect(result).not.toHaveProperty("isVerified");
    });
  });

  describe("toJwtUser", () => {
    it("should map a user to JwtUser", () => {
      const result = AuthMapper.toJwtUser(user);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
    });

    it("should not expose sensitive fields", () => {
      const result = AuthMapper.toJwtUser(user);

      expect(result).not.toHaveProperty("passwordHash");
      expect(result).not.toHaveProperty("refreshTokenHash");
      expect(result).not.toHaveProperty("isVerified");
      expect(result).not.toHaveProperty("createdAt");
      expect(result).not.toHaveProperty("updatedAt");
    });
  });
});
