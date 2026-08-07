import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";

import { RefreshJwtStrategy } from "../../../../src/modules/auth/strategies/refresh-jwt.strategy";
import { UsersService } from "../../../../src/modules/users/users.service";

describe("RefreshJwtStrategy", () => {
  let strategy: RefreshJwtStrategy;
  let usersService: jest.Mocked<UsersService>;
  let configService: jest.Mocked<ConfigService>;

  const user = {
    id: "user-id",
    email: "ahmed@example.com",
    username: "Ahmed",
    passwordHash: "hashed-password",
    refreshTokenHash: "hashed-refresh-token",
    role: "USER" as const,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const refreshToken = "refresh-token";

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

    configService = {
      getOrThrow: jest.fn().mockReturnValue("test-jwt-secret"),
    } as unknown as jest.Mocked<ConfigService>;

    strategy = new RefreshJwtStrategy(configService, usersService);
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
          jti: "token-id",
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid refresh token"));

      expect(usersService.findById).not.toHaveBeenCalled();
    });

    it("should reject when user does not exist", async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(
        strategy.validate(request, {
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          type: "refresh",
          jti: "token-id",
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(usersService.findById).toHaveBeenCalledWith(user.id);
    });

    it("should reject when refresh token is missing", async () => {
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
          jti: "token-id",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should return the mapped user and refresh token", async () => {
      usersService.findById.mockResolvedValue(user);

      const result = await strategy.validate(request, {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        type: "refresh",
        jti: "token-id",
      });

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        refreshToken,
      });
    });

    it("should find the user by token subject", async () => {
      usersService.findById.mockResolvedValue(user);

      await strategy.validate(request, {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        type: "refresh",
        jti: "token-id",
      });

      expect(usersService.findById).toHaveBeenCalledWith(user.id);
    });
  });
});
