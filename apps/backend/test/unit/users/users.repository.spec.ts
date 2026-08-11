import type { User } from "@repo/database";

import { UsersRepository } from "../../../src/modules/users/repositories/users.repository";
import type { PrismaService } from "@repo/database";

describe("UsersRepository", () => {
  let repository: UsersRepository;

  type PrismaMock = {
    user: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  let prisma: PrismaMock;

  const user: User = {
    id: "user-id",
    email: "ahmed@example.com",
    username: "Ahmed",
    passwordHash: "hashed-password",
    role: "USER",
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
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    repository = new UsersRepository(prisma as unknown as PrismaService);
  });

  describe("create", () => {
    it("should create a user", async () => {
      const data = {
        email: user.email,
        username: user.username,
        passwordHash: user.passwordHash,
      };

      prisma.user.create.mockResolvedValue(user);

      const result = await repository.create(data);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data,
      });

      expect(result).toBe(user);
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await repository.findByEmail(user.email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
      });

      expect(result).toBe(user);
    });

    it("should return null when the user does not exist", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail(user.email);

      expect(result).toBeNull();
    });
  });

  describe("findByUsername", () => {
    it("should find a user by username", async () => {
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await repository.findByUsername(user.username);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          username: user.username,
        },
      });

      expect(result).toBe(user);
    });

    it("should return null when the user does not exist", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByUsername(user.username);

      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should find a user by id", async () => {
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await repository.findById(user.id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });

      expect(result).toBe(user);
    });

    it("should return null when the user does not exist", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await repository.findById(user.id);

      expect(result).toBeNull();
    });
  });

  describe("updatePasswordHash", () => {
    it("should update the password hash", async () => {
      prisma.user.update.mockResolvedValue(user);

      const result = await repository.updatePasswordHash(
        user.id,
        "new-password-hash",
      );

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        data: {
          passwordHash: "new-password-hash",
        },
      });

      expect(result).toBe(user);
    });
  });
});
