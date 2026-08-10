import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Next Nest Store API")
  .setDescription("API documentation for Next Nest Store")
  .setVersion("1.0")
  .addBearerAuth(
    {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
    "access-token",
  )
  .build();
