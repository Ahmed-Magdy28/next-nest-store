import * as bcrypt from "bcrypt";

import {
  hashPassword,
  needsRehash,
  verifyPassword,
} from "../../../src/common/security/passwords";
import { PASSWORD_BCRYPT_ROUNDS as BCRYPT_ROUNDS } from "../../../src/common/security/constants";

describe("Password Security", () => {
  const password = "MangaSlayer12$";

  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash).toMatch(/^\$2[aby]\$/);
    });

    it("should produce different hashes for the same password", async () => {
      const firstHash = await hashPassword(password);
      const secondHash = await hashPassword(password);

      expect(firstHash).not.toBe(secondHash);
    });

    it("should create a hash using the configured bcrypt rounds", async () => {
      const hash = await hashPassword(password);

      expect(bcrypt.getRounds(hash)).toBe(BCRYPT_ROUNDS);
    });
  });

  describe("verifyPassword", () => {
    it("should return true for the correct password", async () => {
      const hash = await hashPassword(password);

      await expect(verifyPassword(password, hash)).resolves.toBe(true);
    });

    it("should return false for an incorrect password", async () => {
      const hash = await hashPassword(password);

      await expect(verifyPassword("WrongPassword12$", hash)).resolves.toBe(
        false,
      );
    });
  });

  describe("needsRehash", () => {
    it("should return false when the hash uses current rounds", async () => {
      const hash = await hashPassword(password);

      expect(needsRehash(hash)).toBe(false);
    });

    it("should return true when the hash uses different rounds", async () => {
      const oldHash = await bcrypt.hash(password, BCRYPT_ROUNDS - 1);

      expect(needsRehash(oldHash)).toBe(true);
    });
  });
});
