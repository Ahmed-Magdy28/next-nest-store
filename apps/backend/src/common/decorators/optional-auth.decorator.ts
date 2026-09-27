import { SetMetadata } from "@nestjs/common";

export const OPTIONAL_AUTH_KEY = "optionalAuth";

/**
 * Marks an endpoint as optional-auth.
 * - If a valid token is provided, the user is attached to the request.
 * - If no token (or invalid), the request continues as a guest (user = null).
 */
export const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH_KEY, true);
