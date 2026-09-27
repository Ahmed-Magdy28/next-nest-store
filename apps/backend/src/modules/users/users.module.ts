import { Module } from "@nestjs/common";

import { UsersRepository } from "./repositories/users.repository";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { SessionsModule } from "../sessions/sessions.module";
import { PasswordModule } from "../../common/services/password.module";

@Module({
  imports: [SessionsModule, PasswordModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
