import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Local guard for endpoints that work for both guests and authenticated users.
 * - If a valid token exists → user is attached to the request.
 * - Otherwise → user is null and the request continues normally.
 *
 * Note: This guard should be applied at the controller/route level,
 * not registered globally.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  override handleRequest<TUser = unknown>(
    _err: unknown,
    user: TUser | false,
  ): TUser {
    return (user || null) as TUser;
  }

  override canActivate(context: ExecutionContext) {
    // Always try to authenticate, but never block the request
    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
