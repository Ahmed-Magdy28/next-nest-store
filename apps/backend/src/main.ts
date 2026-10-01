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
    exposedHeaders: ["x-guest-cart-token"],
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      // Allow local network IP origins in development (e.g. mobile testing on 192.168.x.x)
      if (process.env.NODE_ENV !== "production") {
        try {
          const url = new URL(origin);
          if (
            url.hostname === "localhost" ||
            url.hostname === "127.0.0.1" ||
            /^192\.168\.\d+\.\d+$/.test(url.hostname) ||
            /^10\.\d+\.\d+\.\d+$/.test(url.hostname) ||
            /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(url.hostname)
          ) {
            callback(null, true);
            return;
          }
        } catch {
          // ignore
        }
      }
      callback(new Error("Not allowed by CORS"), false);
    },
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  await app.listen(configService.get<number>("port") ?? 3000, "0.0.0.0");
}

bootstrap();
