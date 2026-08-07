import { ConflictException, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "../../../src/modules/auth/auth.service";
import { UsersService } from "../../../src/modules/users/users.service";
import { PasswordService } from "../../../src/modules/auth/services/password.service";
import { TokenService } from "../../../src/modules/auth/services/token.service";
import type { User } from "@repo/database";

describe("AuthService", () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let passwordService: jest.Mocked<PasswordService>;
  let tokenService: jest.Mocked<TokenService>;

  const user: User = {
    id: "user-id",
    email: "ahmed@example.com",
    username: "Ahmed",
    passwordHash: "hashed-password",
    refreshTokenHash: "hashed-refresh-token",
    role: "USER" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    isVerified: true,
  };

  const tokens = {
    accessToken: "access-token",
    refreshToken: "refresh-token",
  };

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateRefreshTokenHash: jest.fn(),
      updatePasswordHash: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    passwordService = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as unknown as jest.Mocked<PasswordService>;

    tokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      generateAuthTokens: jest.fn(),
    } as unknown as jest.Mocked<TokenService>;

    service = new AuthService(usersService, passwordService, tokenService);
  });

  describe("login", () => {
    it("should reject login when user does not exist", async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: user.email,
          password: "Password123!",
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid credentials"));

      expect(usersService.findByEmail).toHaveBeenCalledWith(user.email);

      expect(passwordService.compare).not.toHaveBeenCalled();
      expect(tokenService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should reject login when password is incorrect", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(false);

      await expect(
        service.login({
          email: user.email,
          password: "WrongPassword123!",
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid credentials"));

      expect(passwordService.compare).toHaveBeenCalledWith(
        "WrongPassword123!",
        user.passwordHash,
      );

      expect(tokenService.generateAuthTokens).not.toHaveBeenCalled();
      expect(usersService.updateRefreshTokenHash).not.toHaveBeenCalled();
    });

    it("should login successfully with valid credentials", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("hashed-refresh-token");
      usersService.updateRefreshTokenHash.mockResolvedValue(user);

      const result = await service.login({
        email: user.email,
        password: "Password123!",
      });

      expect(result).toEqual({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        ...tokens,
      });
    });

    it("should generate auth tokens for the authenticated user", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("hashed-refresh-token");

      await service.login({
        email: user.email,
        password: "Password123!",
      });

      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it("should store the hashed refresh token", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("hashed-refresh-token");

      await service.login({
        email: user.email,
        password: "Password123!",
      });

      expect(passwordService.hash).toHaveBeenCalled();
      expect(usersService.updateRefreshTokenHash).toHaveBeenCalledWith(
        user.id,
        "hashed-refresh-token",
      );
    });

    it("should not store the raw refresh token", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("hashed-refresh-token");

      await service.login({
        email: user.email,
        password: "Password123!",
      });

      expect(usersService.updateRefreshTokenHash).not.toHaveBeenCalledWith(
        user.id,
        tokens.refreshToken,
      );
    });
  });

  describe("register", () => {
    it("should reject registration when email already exists", async () => {
      usersService.findByEmail.mockResolvedValue(user);

      const promise = service.register({
        email: user.email,
        username: user.username,
        password: "Password123!",
      });

      await expect(promise).rejects.toThrow(
        new ConflictException("Email already exists"),
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(user.email);
      expect(usersService.findByUsername).not.toHaveBeenCalled();
      expect(passwordService.hash).not.toHaveBeenCalled();
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it("should reject registration when username already exists", async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(user);

      await expect(
        service.register({
          email: user.email,
          username: user.username,
          password: "Password123!",
        }),
      ).rejects.toThrow(new ConflictException("Username already exists"));

      expect(usersService.findByEmail).toHaveBeenCalledWith(user.email);

      expect(usersService.findByUsername).toHaveBeenCalledWith(user.username);

      expect(passwordService.hash).not.toHaveBeenCalled();
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it("should hash the password before creating the user", async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue("hashed-password");
      usersService.create.mockResolvedValue(user);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);

      await service.register({
        email: user.email,
        username: user.username,
        password: "Password123!",
      });

      expect(passwordService.hash).toHaveBeenCalledWith("Password123!");

      expect(usersService.create).toHaveBeenCalledWith({
        email: user.email,
        username: user.username,
        passwordHash: "hashed-password",
      });
    });

    it("should not store the raw password", async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue("hashed-password");
      usersService.create.mockResolvedValue(user);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);

      await service.register({
        email: user.email,
        username: user.username,
        password: "Password123!",
      });

      expect(usersService.create).not.toHaveBeenCalledWith({
        email: user.email,
        username: user.username,
        password: "Password123!",
      });
    });

    it("should generate auth tokens after creating the user", async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue("hashed-password");
      usersService.create.mockResolvedValue(user);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);

      await service.register({
        email: user.email,
        username: user.username,
        password: "Password123!",
      });

      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it("should store the hashed refresh token", async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue("hashed-password");
      usersService.create.mockResolvedValue(user);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      usersService.updateRefreshTokenHash.mockResolvedValue(user);

      await service.register({
        email: user.email,
        username: user.username,
        password: "Password123!",
      });

      expect(usersService.updateRefreshTokenHash).toHaveBeenCalledWith(
        user.id,
        expect.any(String),
      );
    });

    it("should return the created user and tokens", async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue("hashed-password");
      usersService.create.mockResolvedValue(user);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);

      const result = await service.register({
        email: user.email,
        username: user.username,
        password: "Password123!",
      });

      expect(result).toEqual({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        ...tokens,
      });
    });
  });

  describe("refresh", () => {
    it("should reject when user does not exist", async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(
        service.refresh({
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          refreshToken: tokens.refreshToken,
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid refresh token"));

      expect(usersService.findById).toHaveBeenCalledWith(user.id);
      expect(passwordService.compare).not.toHaveBeenCalled();
      expect(tokenService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should reject when refresh token hash is missing", async () => {
      usersService.findById.mockResolvedValue({
        ...user,
        refreshTokenHash: null,
      });

      await expect(
        service.refresh({
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          refreshToken: tokens.refreshToken,
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid refresh token"));

      expect(passwordService.compare).not.toHaveBeenCalled();
      expect(tokenService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should reject when refresh token is invalid", async () => {
      usersService.findById.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(false);

      await expect(
        service.refresh({
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          refreshToken: tokens.refreshToken,
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid refresh token"));

      expect(passwordService.compare).toHaveBeenCalled();
      expect(tokenService.generateAuthTokens).not.toHaveBeenCalled();
      expect(usersService.updateRefreshTokenHash).not.toHaveBeenCalled();
    });

    it("should refresh tokens with a valid refresh token", async () => {
      usersService.findById.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("new-refresh-token-hash");
      usersService.updateRefreshTokenHash.mockResolvedValue(user);

      const result = await service.refresh({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        refreshToken: tokens.refreshToken,
      });

      expect(result).toEqual({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        ...tokens,
      });
    });

    it("should generate new auth tokens for the authenticated user", async () => {
      usersService.findById.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("new-refresh-token-hash");

      await service.refresh({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        refreshToken: tokens.refreshToken,
      });

      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it("should rotate the refresh token hash", async () => {
      usersService.findById.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });
      passwordService.hash.mockResolvedValue("new-refresh-token-hash");

      await service.refresh({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        refreshToken: tokens.refreshToken,
      });

      expect(passwordService.hash).toHaveBeenCalled();
      expect(usersService.updateRefreshTokenHash).toHaveBeenCalledWith(
        user.id,
        "new-refresh-token-hash",
      );
    });
  });
});
