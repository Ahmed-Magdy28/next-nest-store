import { ConflictException, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "../../../src/modules/auth/auth.service";
import { UsersService } from "../../../src/modules/users/users.service";
import { PasswordService } from "../../../src/modules/auth/services/password.service";
import { TokenService } from "../../../src/modules/auth/services/token.service";
import { SessionsService } from "../../../src/modules/sessions/sessions.service";
import type { User } from "@repo/database";

describe("AuthService", () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let passwordService: jest.Mocked<PasswordService>;
  let tokenService: jest.Mocked<TokenService>;
  let sessionsService: jest.Mocked<SessionsService>;

  const user: User = {
    id: "user-id",
    email: "ahmed@example.com",
    username: "Ahmed",
    passwordHash: "hashed-password",
    role: "USER" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    isVerified: true,
    pendingEmail: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    passwordResetTokenUsedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    emailVerificationTokenUsedAt: null,
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

    sessionsService = {
      create: jest.fn(),
      findById: jest.fn(),
      findActiveByUserId: jest.fn(),
      countActiveByUserId: jest.fn(),
      activate: jest.fn(),
      updateRefreshTokenHash: jest.fn(),
      revoke: jest.fn(),
    } as unknown as jest.Mocked<SessionsService>;

    service = new AuthService(
      usersService,
      passwordService,
      tokenService,
      sessionsService,
    );
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
      expect(sessionsService.updateRefreshTokenHash).not.toHaveBeenCalled();
    });

    it("should login successfully with valid credentials", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("hashed-refresh-token");
      sessionsService.countActiveByUserId.mockResolvedValue(0);
      sessionsService.create.mockResolvedValue(session as never);
      sessionsService.updateRefreshTokenHash.mockResolvedValue(
        session as never,
      );

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

      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        session.id,
      );
      expect(sessionsService.updateRefreshTokenHash).toHaveBeenCalledWith(
        session.id,
        "hashed-refresh-token",
      );
    });

    it("should generate auth tokens for the authenticated user", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("hashed-refresh-token");
      sessionsService.countActiveByUserId.mockResolvedValue(0);
      sessionsService.create.mockResolvedValue(session as never);
      sessionsService.updateRefreshTokenHash.mockResolvedValue(
        session as never,
      );

      await service.login({
        email: user.email,
        password: "Password123!",
      });

      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        session.id,
      );
    });

    it("should store the hashed refresh token", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("hashed-refresh-token");
      sessionsService.countActiveByUserId.mockResolvedValue(0);
      sessionsService.create.mockResolvedValue(session as never);
      sessionsService.updateRefreshTokenHash.mockResolvedValue(
        session as never,
      );

      await service.login({
        email: user.email,
        password: "Password123!",
      });

      expect(passwordService.hash).toHaveBeenCalled();
      expect(sessionsService.updateRefreshTokenHash).toHaveBeenCalledWith(
        session.id,
        "hashed-refresh-token",
      );
    });

    it("should not store the raw refresh token", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("hashed-refresh-token");
      sessionsService.countActiveByUserId.mockResolvedValue(0);
      sessionsService.create.mockResolvedValue(session as never);
      sessionsService.updateRefreshTokenHash.mockResolvedValue(
        session as never,
      );

      await service.login({
        email: user.email,
        password: "Password123!",
      });

      expect(sessionsService.updateRefreshTokenHash).not.toHaveBeenCalledWith(
        session.id,
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
      sessionsService.countActiveByUserId.mockResolvedValue(0);
      sessionsService.create.mockResolvedValue(session as never);
      sessionsService.updateRefreshTokenHash.mockResolvedValue(
        session as never,
      );

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
      sessionsService.countActiveByUserId.mockResolvedValue(0);
      sessionsService.create.mockResolvedValue(session as never);
      sessionsService.updateRefreshTokenHash.mockResolvedValue(
        session as never,
      );

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
      sessionsService.countActiveByUserId.mockResolvedValue(0);
      sessionsService.create.mockResolvedValue(session as never);
      sessionsService.updateRefreshTokenHash.mockResolvedValue(
        session as never,
      );

      await service.register({
        email: user.email,
        username: user.username,
        password: "Password123!",
      });

      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        session.id,
      );
    });

    it("should store the hashed refresh token", async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue("hashed-password");
      usersService.create.mockResolvedValue(user);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      sessionsService.countActiveByUserId.mockResolvedValue(0);
      sessionsService.create.mockResolvedValue(session as never);
      sessionsService.updateRefreshTokenHash.mockResolvedValue(
        session as never,
      );

      await service.register({
        email: user.email,
        username: user.username,
        password: "Password123!",
      });

      expect(sessionsService.updateRefreshTokenHash).toHaveBeenCalledWith(
        session.id,
        expect.any(String),
      );
    });

    it("should return the created user and tokens", async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue("hashed-password");
      usersService.create.mockResolvedValue(user);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      sessionsService.countActiveByUserId.mockResolvedValue(0);
      sessionsService.create.mockResolvedValue(session as never);
      sessionsService.updateRefreshTokenHash.mockResolvedValue(
        session as never,
      );

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
      sessionsService.findById.mockResolvedValue(session as never);

      await expect(
        service.refresh({
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          sessionId: session.id,
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
      });
      sessionsService.findById.mockResolvedValue({
        ...session,
        refreshTokenHash: null,
      } as never);

      await expect(
        service.refresh({
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          sessionId: session.id,
          refreshToken: tokens.refreshToken,
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid refresh token"));

      expect(passwordService.compare).not.toHaveBeenCalled();
      expect(tokenService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should reject when refresh token is invalid", async () => {
      usersService.findById.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(false);
      sessionsService.findById.mockResolvedValue(session as never);

      await expect(
        service.refresh({
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          sessionId: session.id,
          refreshToken: tokens.refreshToken,
        }),
      ).rejects.toThrow(new UnauthorizedException("Invalid refresh token"));

      expect(passwordService.compare).toHaveBeenCalled();
      expect(tokenService.generateAuthTokens).not.toHaveBeenCalled();
      expect(sessionsService.updateRefreshTokenHash).not.toHaveBeenCalled();
    });

    it("should refresh tokens with a valid refresh token", async () => {
      usersService.findById.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue(tokens);
      passwordService.hash.mockResolvedValue("new-refresh-token-hash");
      sessionsService.findById.mockResolvedValue(session as never);
      sessionsService.updateRefreshTokenHash.mockResolvedValue(
        session as never,
      );

      const result = await service.refresh({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        sessionId: session.id,
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
      sessionsService.findById.mockResolvedValue(session as never);

      await service.refresh({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        sessionId: session.id,
        refreshToken: tokens.refreshToken,
      });

      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        session.id,
      );
    });

    it("should rotate the refresh token hash", async () => {
      usersService.findById.mockResolvedValue(user);
      passwordService.compare.mockResolvedValue(true);
      tokenService.generateAuthTokens.mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });
      passwordService.hash.mockResolvedValue("new-refresh-token-hash");
      sessionsService.findById.mockResolvedValue(session as never);

      await service.refresh({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        sessionId: session.id,
        refreshToken: tokens.refreshToken,
      });

      expect(passwordService.hash).toHaveBeenCalled();
      expect(sessionsService.updateRefreshTokenHash).toHaveBeenCalledWith(
        session.id,
        "new-refresh-token-hash",
      );
    });
  });
});
