import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { RolesGuard } from "../../../../src/common/guards/roles.guard";

describe("RolesGuard", () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  const handler = jest.fn();
  const controller = jest.fn();

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new RolesGuard(reflector);
  });

  function createContext(user?: object): ExecutionContext {
    return {
      getHandler: () => handler,
      getClass: () => controller,
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
    } as unknown as ExecutionContext;
  }

  describe("canActivate", () => {
    it("should allow access when no roles are required", () => {
      reflector.getAllAndOverride.mockReturnValue(undefined);

      const result = guard.canActivate(createContext());

      expect(result).toBe(true);
    });

    it("should reject access when user is missing", () => {
      reflector.getAllAndOverride.mockReturnValue(["USER"]);

      const context = createContext();

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it("should reject access when user has insufficient permissions", () => {
      reflector.getAllAndOverride.mockReturnValue(["ADMIN"]);

      const context = createContext({
        id: "user-id",
        email: "ahmed@example.com",
        username: "Ahmed",
        role: "USER",
      });

      expect(() => guard.canActivate(context)).toThrow(
        new ForbiddenException("Insufficient permissions"),
      );
    });

    it("should allow access when user has the required role", () => {
      reflector.getAllAndOverride.mockReturnValue(["ADMIN"]);

      const context = createContext({
        id: "admin-id",
        email: "admin@example.com",
        username: "Admin",
        role: "ADMIN",
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it("should allow access when user has one of the required roles", () => {
      reflector.getAllAndOverride.mockReturnValue(["ADMIN", "USER"]);

      const context = createContext({
        id: "user-id",
        email: "ahmed@example.com",
        username: "Ahmed",
        role: "USER",
      });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});
