import { login, register } from "../../helpers/auth.helper";
import { makeUser } from "../../factories/user.factory";
import { AuthResponse } from "../../types/auth.types";

describe("POST /auth/login", () => {
  describe("Success", () => {
    it("should login with valid credentials", async () => {
      const user = makeUser();

      await register(user).expect(201);

      const response = await login(user.email, user.password).expect(200);

      const body = response.body as AuthResponse;

      expect(body.user.email).toBe(user.email);
      expect(body.user.username).toBe(user.username);
      expect(body.user.role).toBe("USER");
      expect(body.accessToken).toEqual(expect.any(String));
      expect(body.refreshToken).toEqual(expect.any(String));

      expect(body.accessToken).not.toBe(body.refreshToken);
    });

    it("should not return password", async () => {
      const user = makeUser();

      await register(user).expect(201);

      const response = await login(user.email, user.password).expect(200);

      expect(response.body.user).not.toHaveProperty("password");
      expect(response.body.user).not.toHaveProperty("passwordHash");
    });
  });

  describe("Validation", () => {
    it("should reject invalid email", async () => {
      const user = makeUser();

      const response = await login("invalid-email", user.password).expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining("email")]),
      );
    });

    it("should reject missing email", async () => {
      const user = makeUser();

      const response = await login("", user.password).expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining("email")]),
      );
    });

    it("should reject missing password", async () => {
      const user = makeUser();

      const response = await login(user.email, "").expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining("Password")]),
      );
    });

    it("should reject password shorter than minimum length", async () => {
      const user = makeUser({
        password: "Aa1!xxx",
      });

      const response = await login(user.email, user.password).expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining(["Password must be at least 8 characters"]),
      );
    });

    it("should reject password longer than maximum length", async () => {
      const user = makeUser({
        password: "Aa1!" + "x".repeat(61),
      });

      const response = await login(user.email, user.password).expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining(["Password must be at most 64 characters"]),
      );
    });
  });

  describe("Authentication", () => {
    it("should reject unknown email", async () => {
      const user = makeUser();

      const response = await login(user.email, user.password).expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should reject incorrect password", async () => {
      const user = makeUser();

      await register(user).expect(201);

      const response = await login(user.email, "WrongPassword123!").expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    it(
      "should use the same error for unknown email and " + "incorrect password",
      async () => {
        const user = makeUser();

        await register(user).expect(201);

        const unknownEmailResponse = await login(
          "unknown@example.com",
          user.password,
        ).expect(401);

        const wrongPasswordResponse = await login(
          user.email,
          "WrongPassword123!",
        ).expect(401);

        expect(unknownEmailResponse.body.message).toBe(
          wrongPasswordResponse.body.message,
        );

        expect(unknownEmailResponse.body.message).toBe("Invalid credentials");
      },
    );
  });
});
