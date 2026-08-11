import { Injectable } from "@nestjs/common";
import type { Prisma, User } from "@repo/database";

import { UsersRepository } from "./repositories/users.repository";
import { CreateUserInput } from "./types";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(data: CreateUserInput): Promise<User> {
    return this.usersRepository.create(data);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  findByPasswordResetTokenHash(tokenHash: string): Promise<User | null> {
    return this.usersRepository.findByPasswordResetTokenHash(tokenHash);
  }

  findByEmailVerificationTokenHash(tokenHash: string): Promise<User | null> {
    return this.usersRepository.findByEmailVerificationTokenHash(tokenHash);
  }

  updateById(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.usersRepository.updateById(userId, data);
  }

  updatePasswordHash(userId: string, passwordHash: string): Promise<User> {
    return this.usersRepository.updatePasswordHash(userId, passwordHash);
  }
}
