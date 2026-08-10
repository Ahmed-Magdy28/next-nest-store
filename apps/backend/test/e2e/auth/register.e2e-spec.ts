import { register } from "../../helpers/auth.helper";
import { makeUser } from "../../factories/user.factory";
import { AuthResponse } from "../../types/auth.types";
import {
  PASSWORD_DIGIT_MESSAGE,
  PASSWORD_LENGTH_MESSAGE,
  PASSWORD_LOWERCASE_MESSAGE,
  PASSWORD_SPECIAL_CHAR_MESSAGE,
  PASSWORD_UPPERCASE_MESSAGE,
  USERNAME_LENGTH_MESSAGE,
  USERNAME_MESSAGE,
} from "../../../src/common/constants";

describe("POST /auth/register", () => {
  describe("Success", () => {
    it("should register a new user", async () => {
      const user = makeUser();

      const response = await register(user).expect(201);

      const body = response.body as AuthResponse;

      expect(body.user.email).toBe(user.email);
      expect(body.user.username).toBe(user.username);
      expect(body.user.role).toBe("USER");

      expect(body.accessToken).toEqual(expect.any(String));
      expect(body.refreshToken).toEqual(expect.any(String));
    });
  });

  describe("Validation", () => {
    it("should reject duplicate email", async () => {
      const user = makeUser();

      await register(user).expect(201);

      await register({
        ...user,
        username: `${user.username}2`,
      }).expect(409);
    });

    it("should reject duplicate username", async () => {
      const user = makeUser();

      await register(user).expect(201);

      await register({
        ...user,
        email: `other-${user.email}`,
      }).expect(409);
    });

    it("should reject invalid email", async () => {
      const user = makeUser();

      await register({
        ...user,
        email: "bad-email",
      }).expect(400);
    });

    it("should reject short password", async () => {
      const user = makeUser();

      await register({
        ...user,
        password: "Aa1!",
      }).expect(400);
    });

    it("should reject missing fields", async () => {
      // @ts-expect-error - Testing invalid input
      await register({}).expect(400);
    });
  });

  describe("username Validation", () => {
    it("should reject username equal to password", async () => {
      const user = makeUser({
        username: "Ahmed123",
        password: "Ahmed123",
      });

      await register(user).expect(400);
    });
    it("should reject username shorter than minimum length", async () => {
      const user = makeUser({
        username: "Ab1",
      });

      await register(user).expect(400);
    });

    it("should accept username with minimum length", async () => {
      const user = makeUser({
        username: "Abc1",
      });

      await register(user).expect(201);
    });

    it("should accept username with maximum length", async () => {
      const user = makeUser({
        username: "A" + "a".repeat(29),
      });

      await register(user).expect(201);
    });

    it("should reject username longer than maximum length", async () => {
      const user = makeUser({
        username: "A" + "a".repeat(30),
      });

      await register(user).expect(400);
    });

    it("should reject username that starts with a number", async () => {
      const user = makeUser({
        username: "1Ahmed",
      });

      await register(user).expect(400);
    });

    it("should reject username with invalid characters", async () => {
      const user = makeUser({
        username: "Ahmed@123",
      });

      await register(user).expect(400);
    });

    it("should accept username with underscores and dots", async () => {
      const user = makeUser({
        username: "Ahmed_123.test",
      });

      await register(user).expect(201);
    });
  });

  describe("Password Validation", () => {
    it("should reject password shorter than minimum length", async () => {
      const user = makeUser({
        password: "Aa1!",
      });

      await register(user).expect(400);
    });

    it("should accept password with minimum length", async () => {
      const user = makeUser({
        password: "Aa1!xxxx",
      });

      await register(user).expect(201);
    });

    it("should accept password with maximum length", async () => {
      const user = makeUser({
        password: "Aa1!" + "x".repeat(60),
      });

      await register(user).expect(201);
    });

    it("should reject password longer than maximum length", async () => {
      const user = makeUser({
        password: "Aa1!" + "x".repeat(61),
      });

      await register(user).expect(400);
    });

    it("should reject password without uppercase letter", async () => {
      const user = makeUser({
        password: "aa1!aaaa",
      });

      await register(user).expect(400);
    });

    it("should reject password without lowercase letter", async () => {
      const user = makeUser({
        password: "AA1!AAAA",
      });

      await register(user).expect(400);
    });

    it("should reject password without digit", async () => {
      const user = makeUser({
        password: "Aa!aaaaa",
      });

      await register(user).expect(400);
    });

    it("should reject password without special character", async () => {
      const user = makeUser({
        password: "Aa1aaaaa",
      });

      await register(user).expect(400);
    });
  });

  describe("Security", () => {
    it("should not return password", async () => {
      const user = makeUser();

      const response = await register(user).expect(201);

      expect(response.body.user).not.toHaveProperty("password");
      expect(response.body.user).not.toHaveProperty("passwordHash");
    });
  });

  describe("Validation Messages", () => {
    it("should return password length validation message", async () => {
      const user = makeUser({
        password: "Aa1!",
      });

      const response = await register(user).expect(400);

      expect(response.body.message).toContain(PASSWORD_LENGTH_MESSAGE);
    });

    it("should return password uppercase validation message", async () => {
      const user = makeUser({
        password: "aa1!aaaa",
      });

      const response = await register(user).expect(400);

      expect(response.body.message).toContain(PASSWORD_UPPERCASE_MESSAGE);
    });

    it("should return password lowercase validation message", async () => {
      const user = makeUser({
        password: "AA1!AAAA",
      });

      const response = await register(user).expect(400);

      expect(response.body.message).toContain(PASSWORD_LOWERCASE_MESSAGE);
    });

    it("should return password digit validation message", async () => {
      const user = makeUser({
        password: "Aa!aaaaa",
      });

      const response = await register(user).expect(400);

      expect(response.body.message).toContain(PASSWORD_DIGIT_MESSAGE);
    });

    it("should return password special character validation message", async () => {
      const user = makeUser({
        password: "Aa1aaaaa",
      });

      const response = await register(user).expect(400);

      expect(response.body.message).toContain(PASSWORD_SPECIAL_CHAR_MESSAGE);
    });

    it("should return username length validation message", async () => {
      const user = makeUser({
        username: "Ab1",
      });

      const response = await register(user).expect(400);

      expect(response.body.message).toContain(USERNAME_LENGTH_MESSAGE);
    });

    it("should return username format validation message", async () => {
      const user = makeUser({
        username: "Ahmed@123",
      });

      const response = await register(user).expect(400);

      expect(response.body.message).toContain(USERNAME_MESSAGE);
    });
  });
});
