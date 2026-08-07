import { PasswordService } from "../../../../src/modules/auth/services/password.service";
import { hashPassword, verifyPassword } from "../../../../src/common/security";

jest.mock("../../../../src/common/security", () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));

describe("PasswordService", () => {
  let service: PasswordService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new PasswordService();
  });

  describe("hash", () => {
    it("should hash the password", async () => {
      jest.mocked(hashPassword).mockResolvedValue("hashed-password");

      const result = await service.hash("Password123!");

      expect(hashPassword).toHaveBeenCalledWith("Password123!");
      expect(result).toBe("hashed-password");
    });
  });

  describe("compare", () => {
    it("should return true when the password matches", async () => {
      jest.mocked(verifyPassword).mockResolvedValue(true);

      const result = await service.compare("Password123!", "hashed-password");

      expect(verifyPassword).toHaveBeenCalledWith(
        "Password123!",
        "hashed-password",
      );
      expect(result).toBe(true);
    });

    it("should return false when the password does not match", async () => {
      jest.mocked(verifyPassword).mockResolvedValue(false);

      const result = await service.compare(
        "WrongPassword123!",
        "hashed-password",
      );

      expect(verifyPassword).toHaveBeenCalledWith(
        "WrongPassword123!",
        "hashed-password",
      );
      expect(result).toBe(false);
    });
  });
});
