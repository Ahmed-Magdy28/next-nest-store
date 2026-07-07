import { Injectable } from "@nestjs/common";
import type { User } from "@repo/database";

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
}
