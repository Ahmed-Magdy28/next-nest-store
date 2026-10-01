import { Injectable } from "@nestjs/common";
import { PrismaService } from "@repo/database";
import type { Prisma, User } from "@repo/database";

import { CreateUserInput } from "@repo/shared/interfaces";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findByPasswordResetTokenHash(tokenHash: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
      },
    });
  }

  findByEmailVerificationTokenHash(tokenHash: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        emailVerificationTokenHash: tokenHash,
      },
    });
  }

  updateById(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<User> {
    return this.updateById(userId, {
      passwordHash,
    });
  }

  async countTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async countActiveUsers(): Promise<number> {
    // A user is considered active if they have at least one ACTIVE, unexpired and unrevoked session
    return this.prisma.user.count({
      where: {
        sessions: {
          some: {
            status: "ACTIVE",
            revokedAt: null,
            expiresAt: {
              gt: new Date(),
            },
          },
        },
      },
    });
  }
}
