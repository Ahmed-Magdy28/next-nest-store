import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { swaggerConfig } from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable cookie parsing (used for guest cart token)
  app.use(cookieParser());

  const corsOrigins =
    configService
      .get<string>("corsOrigin")
      ?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  app.enableCors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"), false);
    },
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  await app.listen(configService.get<number>("port") ?? 3000);
}

bootstrap();
