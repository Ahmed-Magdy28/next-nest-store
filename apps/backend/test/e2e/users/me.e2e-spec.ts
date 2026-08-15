import { INestApplication } from "@nestjs/common";

import { createTestingApp } from "../../helpers/app.helper";
import { cleanDatabase } from "../../helpers/database.helper";
import { testContext, type TestContext } from "../../helpers/test-context";
import { makeUser } from "../../factories/user.factory";
import { register, login, refresh } from "../../helpers/auth.helper";
import {
  changeMyPassword,
  getMyUser,
  updateMyEmail,
  updateMyUser,
  updateMyUsername,
  verifyMyEmail,
} from "../../helpers/users.helper";
import type { AuthResponse } from "../../types/auth.types";

describe("Users me endpoints", () => {
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

  it("should return the authenticated user profile safely", async () => {
    const user = makeUser();

    const response = await register(user).expect(201);
    const body = response.body as { accessToken: string };

    const profileResponse = await getMyUser(body.accessToken).expect(200);

    expect(profileResponse.body.email).toBe(user.email);
    expect(profileResponse.body.username).toBe(user.username);
    expect(profileResponse.body.role).toBe("USER");
    expect(profileResponse.body).not.toHaveProperty("passwordHash");
    expect(profileResponse.body).not.toHaveProperty("refreshTokenHash");
  });

  it("should update username and request email change through PATCH /users/me", async () => {
    const user = makeUser();

    const registerResponse = await register(user).expect(201);
    const body = registerResponse.body as { accessToken: string };

    const nextUsername = `${user.username}2`;
    const nextEmail = `new-${user.email}`;

    const response = await updateMyUser(body.accessToken, {
      username: nextUsername,
      email: nextEmail,
    }).expect(200);

    expect(response.body.user.username).toBe(nextUsername);
    expect(response.body.user.email).toBe(user.email);
    expect(response.body.verificationToken).toEqual(expect.any(String));

    const verifyResponse = await verifyMyEmail(
      response.body.verificationToken,
    ).expect(200);

    expect(verifyResponse.body.user.email).toBe(nextEmail);
    expect(verifyResponse.body.user.username).toBe(nextUsername);

    const refreshedProfile = await getMyUser(body.accessToken).expect(200);
    expect(refreshedProfile.body.email).toBe(nextEmail);
    expect(refreshedProfile.body.username).toBe(nextUsername);
  });

  it("should reject duplicate username and duplicate email changes", async () => {
    const firstUser = makeUser();
    const secondUser = makeUser();

    const firstRegister = await register(firstUser).expect(201);
    const secondRegister = await register(secondUser).expect(201);

    const firstBody = firstRegister.body as { accessToken: string };
    const secondBody = secondRegister.body as { accessToken: string };

    await updateMyUsername(firstBody.accessToken, secondUser.username).expect(
      409,
    );

    await updateMyEmail(firstBody.accessToken, secondUser.email).expect(409);

    await getMyUser(secondBody.accessToken).expect(200);
  });

  it("should change the password and invalidate existing sessions", async () => {
    const user = makeUser();

    const registerResponse = await register(user).expect(201);
    const secondLoginResponse = await login(user.email, user.password).expect(
      200,
    );
    const registerBody = registerResponse.body as AuthResponse;
    const secondLoginBody = secondLoginResponse.body as AuthResponse;

    await changeMyPassword(
      registerBody.accessToken!,
      user.password,
      "NewPassword123!",
    ).expect(204);

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

    await getMyUser(registerBody.accessToken!).expect(401);
    await refresh(registerBody.refreshToken).expect(401);
    await refresh(secondLoginBody.refreshToken).expect(401);

    await login(user.email, user.password).expect(401);
    const loginResponse = await login(user.email, "NewPassword123!").expect(
      200,
    );

    expect(loginResponse.body.accessToken).toEqual(expect.any(String));
  });

  it("should reject unauthenticated profile updates", async () => {
    await getMyUser("").expect(401);
  });
});
