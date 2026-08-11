import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";

import { RefreshJwtStrategy } from "../../../../src/modules/auth/strategies/refresh-jwt.strategy";
import { UsersService } from "../../../../src/modules/users/users.service";
import { SessionsService } from "../../../../src/modules/sessions/sessions.service";

describe("RefreshJwtStrategy", () => {
  let strategy: RefreshJwtStrategy;
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

  const refreshToken = "refresh-token";

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

  const request = {
    headers: {
      authorization: `Bearer ${refreshToken}`,
    },
  } as Request;

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

    strategy = new RefreshJwtStrategy(
      configService,
      usersService,
      sessionsService,
    );
  });

  describe("validate", () => {
    it("should reject an access token", async () => {
      await expect(
        strategy.validate(request, {
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          type: "access",
          sessionId: session.id,
          jti: "token-id",
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid refresh token"));

      expect(usersService.findById).not.toHaveBeenCalled();
    });

    it("should reject when user does not exist", async () => {
      sessionsService.findById.mockResolvedValue(session as never);
      usersService.findById.mockResolvedValue(null);

      await expect(
        strategy.validate(request, {
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          type: "refresh",
          sessionId: session.id,
          jti: "token-id",
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(sessionsService.findById).toHaveBeenCalledWith(session.id);
      expect(usersService.findById).toHaveBeenCalledWith(user.id);
    });

    it("should reject when refresh token is missing", async () => {
      sessionsService.findById.mockResolvedValue(session as never);
      usersService.findById.mockResolvedValue(user);

      const requestWithoutToken = {
        headers: {},
      } as Request;

      await expect(
        strategy.validate(requestWithoutToken, {
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          type: "refresh",
          sessionId: session.id,
          jti: "token-id",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should return the mapped user and refresh token", async () => {
      sessionsService.findById.mockResolvedValue(session as never);
      usersService.findById.mockResolvedValue(user);

      const result = await strategy.validate(request, {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        type: "refresh",
        sessionId: session.id,
        jti: "token-id",
      });

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        refreshToken,
        sessionId: session.id,
      });
    });

    it("should find the user by token subject", async () => {
      sessionsService.findById.mockResolvedValue(session as never);
      usersService.findById.mockResolvedValue(user);

      await strategy.validate(request, {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        type: "refresh",
        sessionId: session.id,
        jti: "token-id",
      });

      expect(sessionsService.findById).toHaveBeenCalledWith(session.id);
      expect(usersService.findById).toHaveBeenCalledWith(user.id);
    });
  });
});
