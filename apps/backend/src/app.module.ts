import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { configuration, envSchema } from "./config";
import { join } from "node:path";
import { DatabaseModule } from "@repo/database";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: join(process.cwd(), "../../.env"),
      load: [configuration],

      validate: (config) => {
        return envSchema.parse(config);
      },
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
