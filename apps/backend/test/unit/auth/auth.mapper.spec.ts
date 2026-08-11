import type { User } from "@repo/database";

import { AuthMapper } from "../../../src/modules/auth/mappers/auth.mapper";

describe("AuthMapper", () => {
  const user: User = {
    id: "user-id",
    email: "ahmed@example.com",
    username: "Ahmed",
    passwordHash: "hashed-password",
    role: "USER",
    isVerified: true,
    pendingEmail: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    passwordResetTokenUsedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    emailVerificationTokenUsedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const sessionId = "session-id";

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
      const result = AuthMapper.toJwtUser(user, sessionId);

      expect(result).not.toHaveProperty("passwordHash");
      expect(result).not.toHaveProperty("isVerified");
    });
  });

  describe("toJwtUser", () => {
    it("should map a user to JwtUser", () => {
      const result = AuthMapper.toJwtUser(user, sessionId);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        sessionId,
      });
    });

    it("should not expose sensitive fields", () => {
      const result = AuthMapper.toJwtUser(user, sessionId);

      expect(result).not.toHaveProperty("passwordHash");
      expect(result).not.toHaveProperty("isVerified");
      expect(result).not.toHaveProperty("createdAt");
      expect(result).not.toHaveProperty("updatedAt");
    });
  });
});
