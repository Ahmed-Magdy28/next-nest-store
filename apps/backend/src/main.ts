import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { swaggerConfig } from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
