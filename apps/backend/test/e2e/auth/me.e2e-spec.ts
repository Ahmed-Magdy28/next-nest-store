import { me, register } from "../../helpers/auth.helper";

import { makeUser } from "../../factories/user.factory";
import { AuthResponse } from "../../types/auth.types";
import { testContext } from "../../helpers/test-context";

describe("GET /auth/me", () => {
  describe("Success", () => {
    it("should return current user", async () => {
      const user = makeUser();

      const registerResponse = await register(user).expect(201);

      const body = registerResponse.body as AuthResponse;

      expect(body.accessToken).toEqual(expect.any(String));

      const response = await me(body.accessToken!).expect(200);

      expect(response.body.email).toBe(user.email);
      expect(response.body.username).toBe(user.username);
      expect(response.body.role).toBe("USER");

      expect(response.body).not.toHaveProperty("password");
      expect(response.body).not.toHaveProperty("passwordHash");
    });
  });

  describe("Security", () => {
    it("should reject request without access token", async () => {
      await me("").expect(401);
    });

    it("should reject an invalid access token", async () => {
      await me("invalid-access-token").expect(401);
    });

    it("should reject a refresh token", async () => {
      const user = makeUser();

      const registerResponse = await register(user).expect(201);

      const body = registerResponse.body as AuthResponse;

      await me(body.refreshToken).expect(401);
    });

    it("should reject a tampered access token", async () => {
      const user = makeUser();

      const registerResponse = await register(user).expect(201);

      const body = registerResponse.body as AuthResponse;
      expect(body.accessToken).toEqual(expect.any(String));

      const tamperedToken =
        body.accessToken!.slice(0, -1) +
        (body.accessToken!.endsWith("a") ? "b" : "a");

      await me(tamperedToken).expect(401);
    });

    it("should reject access token when user no longer exists", async () => {
      const user = makeUser();

      const registerResponse = await register(user).expect(201);

      const body = registerResponse.body as AuthResponse;

      await testContext.prisma.user.delete({
        where: {
          email: user.email,
        },
      });

      expect(body.accessToken).toEqual(expect.any(String));

      await me(body.accessToken!).expect(401);
    });
  });
});
