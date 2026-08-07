import { INestApplication } from "@nestjs/common";

import { createTestingApp } from "../../helpers/app.helper";
import { cleanDatabase } from "../../helpers/database.helper";
import { me, register } from "../../helpers/auth.helper";

import { TestContext } from "../../helpers/test-context";
import { makeUser } from "../../factories/user.factory";
import { AuthResponse } from "../../types/auth.types";

describe("GET /auth/me", () => {
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
    it("should return current user", async () => {
      const user = makeUser();

      const registerResponse = await register(app, user).expect(201);

      const body = registerResponse.body as AuthResponse;

      const response = await me(app, body.accessToken).expect(200);

      expect(response.body.email).toBe(user.email);
      expect(response.body.username).toBe(user.username);
      expect(response.body.role).toBe("USER");

      expect(response.body).not.toHaveProperty("password");
      expect(response.body).not.toHaveProperty("passwordHash");
    });
  });

  describe("Security", () => {
    it("should reject request without access token", async () => {
      await me(app, "").expect(401);
    });

    it("should reject an invalid access token", async () => {
      await me(app, "invalid-access-token").expect(401);
    });

    it("should reject a refresh token", async () => {
      const user = makeUser();

      const registerResponse = await register(app, user).expect(201);

      const body = registerResponse.body as AuthResponse;

      await me(app, body.refreshToken).expect(401);
    });

    it("should reject a tampered access token", async () => {
      const user = makeUser();

      const registerResponse = await register(app, user).expect(201);

      const body = registerResponse.body as AuthResponse;

      const tamperedToken =
        body.accessToken.slice(0, -1) +
        (body.accessToken.endsWith("a") ? "b" : "a");

      await me(app, tamperedToken).expect(401);
    });

    it("should reject access token when user no longer exists", async () => {
      const user = makeUser();

      const registerResponse = await register(app, user).expect(201);

      const body = registerResponse.body as AuthResponse;

      await ctx.prisma.user.delete({
        where: {
          email: user.email,
        },
      });

      await me(app, body.accessToken).expect(401);
    });
  });
});
