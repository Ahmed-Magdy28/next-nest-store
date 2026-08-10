import { applyDecorators } from "@nestjs/common";
import { meSwagger } from "../../modules/auth/swagger/me.swagger";
import { loginSwagger } from "../../modules/auth/swagger/login.swagger";
import { registerSwagger } from "../../modules/auth/swagger/register.swagger";
// TODO: Add more swagger decorators for other endpoints as needed
type SwaggerEndpoint = "me" | "login" | "register";
export const Swagger = (name: SwaggerEndpoint) => {
  switch (name) {
    case "me":
      return applyDecorators(meSwagger);

    case "login":
      return applyDecorators(loginSwagger);

    case "register":
      return applyDecorators(registerSwagger);

    default:
      throw new Error(`Unknown Swagger decorator: ${name}`);
  }
};
