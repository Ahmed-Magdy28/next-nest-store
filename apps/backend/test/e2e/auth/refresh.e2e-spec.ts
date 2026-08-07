import { INestApplication } from "@nestjs/common";

import { createTestingApp } from "../../helpers/app.helper";
import { cleanDatabase } from "../../helpers/database.helper";
import { register, refresh } from "../../helpers/auth.helper";

import { TestContext } from "../../helpers/test-context";
import { makeUser } from "../../factories/user.factory";
import { AuthResponse } from "../../types/auth.types";

describe("POST /auth/refresh", () => {
  let app: INestApplication;
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestingApp();
    app = ctx.app;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await cleanDatabase(ctx.prisma);
  });

  describe("Success", () => {
    it("should refresh tokens", async () => {
      const user = makeUser();

      const registerResponse = await register(app, user).expect(201);

      const registerBody = registerResponse.body as AuthResponse;

      const response = await refresh(app, registerBody.refreshToken).expect(
        201,
      );

      const body = response.body as AuthResponse;

      expect(body.user.email).toBe(user.email);
      expect(body.user.username).toBe(user.username);
      expect(body.user.role).toBe("USER");

      expect(body.accessToken).toEqual(expect.any(String));
      expect(body.refreshToken).toEqual(expect.any(String));

      expect(body.accessToken).not.toBe(registerBody.accessToken);
      expect(body.refreshToken).not.toBe(registerBody.refreshToken);
    });
  });

  describe("Security", () => {
    it("should reject refresh token when stored hash is missing", async () => {
      const user = makeUser();

      const registerResponse = await register(app, user).expect(201);

      const registerBody = registerResponse.body as AuthResponse;

      await ctx.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          refreshTokenHash: null,
        },
      });

      await refresh(app, registerBody.refreshToken).expect(401);
    });
    it("should reject refresh token when user no longer exists", async () => {
      const user = makeUser();

      const registerResponse = await register(app, user).expect(201);

      const registerBody = registerResponse.body as AuthResponse;

      await ctx.prisma.user.delete({
        where: {
          email: user.email,
        },
      });

      await refresh(app, registerBody.refreshToken).expect(401);
    });
    it("should reject a tampered refresh token", async () => {
      const user = makeUser();

      const registerResponse = await register(app, user).expect(201);

      const registerBody = registerResponse.body as AuthResponse;

      const tamperedToken =
        registerBody.refreshToken.slice(0, -1) +
        (registerBody.refreshToken.endsWith("a") ? "b" : "a");

      await refresh(app, tamperedToken).expect(401);
    });

    it("should reject an invalid refresh token", async () => {
      const response = await refresh(app, "invalid-refresh-token").expect(401);

      expect(response.body.message).toBe("Unauthorized");
    });

    it("should reject an access token as a refresh token", async () => {
      const user = makeUser();

      const registerResponse = await register(app, user).expect(201);

      const registerBody = registerResponse.body as AuthResponse;

      await refresh(app, registerBody.accessToken).expect(401);
    });

    it("should reject the old refresh token after rotation", async () => {
      const user = makeUser();

      const registerResponse = await register(app, user).expect(201);

      const registerBody = registerResponse.body as AuthResponse;

      const refreshResponse = await refresh(
        app,
        registerBody.refreshToken,
      ).expect(201);

      const refreshBody = refreshResponse.body as AuthResponse;

      expect(refreshBody.refreshToken).not.toBe(registerBody.refreshToken);

      await refresh(app, registerBody.refreshToken).expect(401);
    });
  });
});
