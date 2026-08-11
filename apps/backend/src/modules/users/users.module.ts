import { Module } from "@nestjs/common";

import { UsersRepository } from "./repositories/users.repository";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PasswordService } from "../auth/services/password.service";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
