import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { JwtStrategy } from "../../../../src/modules/auth/strategies/jwt.strategy";
import { UsersService } from "../../../../src/modules/users/users.service";
import { SessionsService } from "../../../../src/modules/sessions/sessions.service";

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;
  let usersService: jest.Mocked<UsersService>;
  let configService: jest.Mocked<ConfigService>;
  let sessionsService: jest.Mocked<SessionsService>;

  const user = {
    id: "user-id",
    email: "ahmed@example.com",
    username: "Ahmed",
    passwordHash: "hashed-password",
    refreshTokenHash: "hashed-refresh-token",
    role: "USER" as const,
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

  const session = {
    id: "session-id",
    userId: user.id,
    refreshTokenHash: "hashed-refresh-token",
    expiresAt: new Date(Date.now() + 60_000),
    status: "ACTIVE" as const,
    revokedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUsedAt: null,
  };

  beforeEach(() => {
    usersService = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
      updateRefreshTokenHash: jest.fn(),
      updatePasswordHash: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    sessionsService = {
      create: jest.fn(),
      findById: jest.fn(),
      findActiveByUserId: jest.fn(),
      countActiveByUserId: jest.fn(),
      activate: jest.fn(),
      updateRefreshTokenHash: jest.fn(),
      revoke: jest.fn(),
    } as unknown as jest.Mocked<SessionsService>;

    configService = {
      getOrThrow: jest.fn().mockReturnValue("test-jwt-secret"),
    } as unknown as jest.Mocked<ConfigService>;

    strategy = new JwtStrategy(configService, usersService, sessionsService);
  });

  describe("validate", () => {
    it("should reject when user does not exist", async () => {
      sessionsService.findById.mockResolvedValue(session as never);
      usersService.findById.mockResolvedValue(null);

      await expect(
        strategy.validate({
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          type: "access",
          sessionId: session.id,
          jti: "access-jti",
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(sessionsService.findById).toHaveBeenCalledWith(session.id);
      expect(usersService.findById).toHaveBeenCalledWith(user.id);
    });

    it("should reject a refresh token", async () => {
      usersService.findById.mockResolvedValue(user);

      await expect(
        strategy.validate({
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          type: "refresh",
          sessionId: session.id,
          jti: "access-jti",
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid token"));
    });

    it("should return the mapped JWT user", async () => {
      sessionsService.findById.mockResolvedValue(session as never);
      usersService.findById.mockResolvedValue(user);

      const result = await strategy.validate({
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        type: "access",
        sessionId: session.id,
        jti: "access-jti",
      });

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        sessionId: session.id,
      });
    });

    it("should find the user by token subject", async () => {
      sessionsService.findById.mockResolvedValue(session as never);
      usersService.findById.mockResolvedValue(user);

      await strategy.validate({
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        type: "access",
        sessionId: session.id,
        jti: "access-jti",
      });

      expect(sessionsService.findById).toHaveBeenCalledWith(session.id);
      expect(usersService.findById).toHaveBeenCalledWith(user.id);
    });
  });
});
