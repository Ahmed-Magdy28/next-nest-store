import { JwtService } from "@nestjs/jwt";

import {
  ACCESS_TOKEN_TYPE,
  REFRESH_TOKEN_TYPE,
} from "../../../src/common/security";

import { TokenService } from "../../../src/modules/auth/services/token.service";
import type { AuthUserDto } from "../../../src/modules/auth/dto";

describe("TokenService", () => {
  let service: TokenService;
  let jwtService: JwtService;
  const sessionId = "session-id";

  const user: AuthUserDto = {
    id: "user-id",
    email: "ahmed@example.com",
    username: "Ahmed",
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jwtService = new JwtService({
      secret: "test-secret-that-is-long-enough-123",
    });

    service = new TokenService(jwtService);
  });

  describe("generateAccessToken", () => {
    it("should generate an access token", async () => {
      const token = await service.generateAccessToken(user, sessionId);

      const payload = await jwtService.verifyAsync(token);

      expect(payload.sub).toBe(user.id);
      expect(payload.email).toBe(user.email);
      expect(payload.username).toBe(user.username);
      expect(payload.role).toBe(user.role);
      expect(payload.type).toBe(ACCESS_TOKEN_TYPE);
      expect(payload.sessionId).toBe(sessionId);
    });

    it("should use the configured access token expiration", async () => {
      const token = await service.generateAccessToken(user, sessionId);

      const payload = await jwtService.decode(token);

      expect(payload.exp - payload.iat).toBe(15 * 60);
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a refresh token", async () => {
      const token = await service.generateRefreshToken(user, sessionId);

      const payload = await jwtService.verifyAsync(token);

      expect(payload.sub).toBe(user.id);
      expect(payload.email).toBe(user.email);
      expect(payload.username).toBe(user.username);
      expect(payload.role).toBe(user.role);
      expect(payload.type).toBe(REFRESH_TOKEN_TYPE);
      expect(payload.sessionId).toBe(sessionId);
    });

    it("should use the configured refresh token expiration", async () => {
      const token = await service.generateRefreshToken(user, sessionId);

      const payload = await jwtService.decode(token);

      expect(payload.exp - payload.iat).toBe(7 * 24 * 60 * 60);
    });
  });

  describe("generateAuthTokens", () => {
    it("should generate access and refresh tokens", async () => {
      const tokens = await service.generateAuthTokens(user, sessionId);

      expect(tokens.accessToken).toEqual(expect.any(String));
      expect(tokens.refreshToken).toEqual(expect.any(String));

      expect(tokens.accessToken).not.toBe(tokens.refreshToken);
    });
  });
});
