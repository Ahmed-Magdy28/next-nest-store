import { INestApplication } from "@nestjs/common";

import {
  register,
  login,
  sessions,
  revokeSession,
  revokeAllSessions,
} from "../../helpers/auth.helper";
import { createTestingApp } from "../../helpers/app.helper";
import { cleanDatabase } from "../../helpers/database.helper";
import { testContext, type TestContext } from "../../helpers/test-context";
import { makeUser } from "../../factories/user.factory";
import type { AuthResponse } from "../../types/auth.types";
import { me as authMe, refresh } from "../../helpers/auth.helper";

function expectAccessToken(body: AuthResponse): string {
  expect(body.accessToken).toEqual(expect.any(String));
  return body.accessToken!;
}

describe("Auth sessions", () => {
  let app: INestApplication;
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestingApp();
    app = ctx.app;
    testContext.app = ctx.app;
    testContext.prisma = ctx.prisma;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await cleanDatabase(ctx.prisma);
  });

  it("should create active sessions until the limit and then create a pending session", async () => {
    const user = makeUser();

    const registerResponse = await register(user).expect(201);
    const registerBody = registerResponse.body as AuthResponse;

    const activeLogins: AuthResponse[] = [];

    for (let index = 0; index < 4; index += 1) {
      const response = await login(user.email, user.password).expect(200);
      activeLogins.push(response.body as AuthResponse);
    }

    const pendingResponse = await login(user.email, user.password).expect(200);
    const pendingBody = pendingResponse.body as AuthResponse;

    expect(registerBody.session.status).toBe("ACTIVE");
    expect(registerBody.accessToken).toEqual(expect.any(String));
    expect(registerBody.refreshToken).toEqual(expect.any(String));
    expect(activeLogins).toHaveLength(4);
    for (const activeLogin of activeLogins) {
      expect(activeLogin.session.status).toBe("ACTIVE");
      expect(activeLogin.accessToken).toEqual(expect.any(String));
      expect(activeLogin.refreshToken).toEqual(expect.any(String));
    }
    expect(pendingBody.session.status).toBe("PENDING");
    expect(pendingBody).not.toHaveProperty("accessToken");
    expect(pendingBody.refreshToken).toEqual(expect.any(String));

    const activeCount = await ctx.prisma.session.count({
      where: {
        userId: registerBody.user.id,
        status: "ACTIVE",
      },
    });

    expect(activeCount).toBe(5);

    const sessionsResponse = await sessions(
      expectAccessToken(registerBody),
    ).expect(200);

    expect(sessionsResponse.body).toHaveLength(6);
    expect(
      sessionsResponse.body.filter(
        (session: { status: string }) => session.status === "ACTIVE",
      ),
    ).toHaveLength(5);
    expect(
      sessionsResponse.body.filter(
        (session: { status: string }) => session.status === "PENDING",
      ),
    ).toHaveLength(1);

    await refresh(pendingBody.refreshToken).expect(401);

    const revokeTarget = registerBody.session.id;
    const revokeActor = activeLogins[0];

    const revokeResponse = await revokeSession(
      expectAccessToken(revokeActor!),
      revokeTarget,
    ).expect(204);

    expect(revokeResponse.text).toBe("");

    const afterRevoke = await sessions(expectAccessToken(revokeActor!)).expect(
      200,
    );

    const activeAfterRevoke = afterRevoke.body.filter(
      (session: { status: string }) => session.status === "ACTIVE",
    );

    expect(activeAfterRevoke).toHaveLength(5);
    expect(
      afterRevoke.body.find(
        (session: { id: string }) => session.id === revokeTarget,
      ).status,
    ).toBe("REVOKED");
    expect(
      afterRevoke.body.find(
        (session: { id: string }) => session.id === pendingBody.session.id,
      ).status,
    ).toBe("ACTIVE");

    const activatedRefreshResponse = await refresh(
      pendingBody.refreshToken,
    ).expect(201);
    const activatedRefreshBody = activatedRefreshResponse.body as AuthResponse;

    expect(activatedRefreshBody.session.id).toBe(pendingBody.session.id);
    expect(activatedRefreshBody.accessToken).toEqual(expect.any(String));
    expect(activatedRefreshBody.refreshToken).toEqual(expect.any(String));
  });

  it("should not allow revoking another user's session", async () => {
    const firstUser = makeUser();
    const secondUser = makeUser();

    const firstResponse = await register(firstUser).expect(201);
    const secondResponse = await register(secondUser).expect(201);

    const firstBody = firstResponse.body as AuthResponse;
    const secondBody = secondResponse.body as AuthResponse;

    await revokeSession(
      expectAccessToken(firstBody),
      secondBody.session.id,
    ).expect(403);
  });

  it("should revoke all sessions for the authenticated user", async () => {
    const user = makeUser();

    const registerResponse = await register(user).expect(201);
    const registerBody = registerResponse.body as AuthResponse;

    await login(user.email, user.password).expect(200);

    await revokeAllSessions(expectAccessToken(registerBody)).expect(204);

    const activeCount = await ctx.prisma.session.count({
      where: {
        userId: registerBody.user.id,
        status: "ACTIVE",
      },
    });

    const revokedCount = await ctx.prisma.session.count({
      where: {
        userId: registerBody.user.id,
        status: "REVOKED",
      },
    });

    expect(activeCount).toBe(0);
    expect(revokedCount).toBe(2);

    await authMe(expectAccessToken(registerBody)).expect(401);
  });
});
