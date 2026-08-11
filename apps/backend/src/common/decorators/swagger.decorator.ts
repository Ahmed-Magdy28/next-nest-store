import { applyDecorators } from "@nestjs/common";

import {
  refreshSwagger,
  LogoutSwagger,
  registerSwagger,
  loginSwagger,
  meSwagger,
  SessionSwagger,
  revokeSessionSwagger,
  revokeAllSessionsSwagger,
  resetPasswordSwagger,
  forgotPasswordSwagger,
} from "../../modules/auth/swagger";
import {
  changePasswordSwagger,
  myProfileSwagger,
  updateEmailSwagger,
  updateMyProfileSwagger,
  updateMyProfileUsernameSwagger,
  verifyEmailSwagger,
} from "../../modules/users/swagger";

// TODO: Add more swagger decorators for other endpoints as needed
type SwaggerEndpoint =
  | "me"
  | "login"
  | "register"
  | "refresh"
  | "logout"
  | "sessions"
  | "revoke-session"
  | "revoke-all-sessions"
  | "forgot-password"
  | "reset-password"
  | "get-my-profile"
  | "update-my-profile"
  | "update-my-username"
  | "update-my-email"
  | "verify-email"
  | "change-password";
export const Swagger = (name: SwaggerEndpoint) => {
  switch (name) {
    case "me":
      return applyDecorators(meSwagger);

    case "login":
      return applyDecorators(loginSwagger);

    case "register":
      return applyDecorators(registerSwagger);

    case "refresh":
      return applyDecorators(refreshSwagger);

    case "logout":
      return applyDecorators(LogoutSwagger);

    case "sessions":
      return applyDecorators(SessionSwagger);

    case "revoke-session":
      return applyDecorators(revokeSessionSwagger);

    case "revoke-all-sessions":
      return applyDecorators(revokeAllSessionsSwagger);

    case "forgot-password":
      return applyDecorators(forgotPasswordSwagger);

    case "reset-password":
      return applyDecorators(resetPasswordSwagger);

    case "get-my-profile":
      return applyDecorators(myProfileSwagger);

    case "update-my-profile":
      return applyDecorators(updateMyProfileSwagger);

    case "update-my-username":
      return applyDecorators(updateMyProfileUsernameSwagger);

    case "update-my-email":
      return applyDecorators(updateEmailSwagger);

    case "verify-email":
      return applyDecorators(verifyEmailSwagger);

    case "change-password":
      return applyDecorators(changePasswordSwagger);

    default:
      throw new Error(`Unknown Swagger decorator: ${name}`);
  }
};
