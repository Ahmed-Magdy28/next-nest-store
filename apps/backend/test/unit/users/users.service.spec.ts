import { UsersService } from "../../../src/modules/users/users.service";
import { UsersRepository } from "../../../src/modules/users/repositories/users.repository";

describe("UsersService", () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  const user = {
    id: "user-id",
    email: "ahmed@example.com",
    username: "Ahmed",
    passwordHash: "hashed-password",
    role: "USER" as const,
    isVerified: true,
    pendingEmail: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    passwordResetTokenUsedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    emailVerificationTokenUsedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    usersRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById: jest.fn(),
      updatePasswordHash: jest.fn(),
    } as unknown as jest.Mocked<UsersRepository>;

    service = new UsersService(usersRepository);
  });

  describe("create", () => {
    it("should create a user", async () => {
      const data = {
        email: user.email,
        username: user.username,
        passwordHash: user.passwordHash,
      };

      usersRepository.create.mockResolvedValue(user);

      const result = await service.create(data);

      expect(usersRepository.create).toHaveBeenCalledWith(data);
      expect(result).toBe(user);
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      usersRepository.findByEmail.mockResolvedValue(user);

      const result = await service.findByEmail(user.email);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(user.email);
      expect(result).toBe(user);
    });

    it("should return null when the user does not exist", async () => {
      usersRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail(user.email);

      expect(result).toBeNull();
    });
  });

  describe("findByUsername", () => {
    it("should find a user by username", async () => {
      usersRepository.findByUsername.mockResolvedValue(user);

      const result = await service.findByUsername(user.username);

      expect(usersRepository.findByUsername).toHaveBeenCalledWith(
        user.username,
      );
      expect(result).toBe(user);
    });

    it("should return null when the user does not exist", async () => {
      usersRepository.findByUsername.mockResolvedValue(null);

      const result = await service.findByUsername(user.username);

      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should find a user by id", async () => {
      usersRepository.findById.mockResolvedValue(user);

      const result = await service.findById(user.id);

      expect(usersRepository.findById).toHaveBeenCalledWith(user.id);
      expect(result).toBe(user);
    });

    it("should return null when the user does not exist", async () => {
      usersRepository.findById.mockResolvedValue(null);

      const result = await service.findById(user.id);

      expect(result).toBeNull();
    });
  });

  describe("updatePasswordHash", () => {
    it("should update the password hash", async () => {
      usersRepository.updatePasswordHash.mockResolvedValue(user);

      const result = await service.updatePasswordHash(
        user.id,
        "new-password-hash",
      );

      expect(usersRepository.updatePasswordHash).toHaveBeenCalledWith(
        user.id,
        "new-password-hash",
      );

      expect(result).toBe(user);
    });
  });
});
