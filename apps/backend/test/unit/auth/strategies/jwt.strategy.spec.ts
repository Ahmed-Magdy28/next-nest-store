import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { JwtStrategy } from "../../../../src/modules/auth/strategies/jwt.strategy";
import { UsersService } from "../../../../src/modules/users/users.service";

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;
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

    strategy = new JwtStrategy(configService, usersService);
  });

  describe("validate", () => {
    it("should reject when user does not exist", async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(
        strategy.validate({
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          type: "access",
          jti: "access-jti",
        }),
      ).rejects.toThrow(UnauthorizedException);

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
          jti: "access-jti",
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid token"));
    });

    it("should return the mapped JWT user", async () => {
      usersService.findById.mockResolvedValue(user);

      const result = await strategy.validate({
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        type: "access",
        jti: "access-jti",
      });

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
    });

    it("should find the user by token subject", async () => {
      usersService.findById.mockResolvedValue(user);

      await strategy.validate({
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        type: "access",
        jti: "access-jti",
      });

      expect(usersService.findById).toHaveBeenCalledWith(user.id);
    });
  });
});
