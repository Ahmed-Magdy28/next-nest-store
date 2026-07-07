import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import type { JwtUser } from "../../modules/auth/types";

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
