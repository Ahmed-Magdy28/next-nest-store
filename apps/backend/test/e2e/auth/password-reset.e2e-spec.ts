import { INestApplication } from "@nestjs/common";

import { createTestingApp } from "../../helpers/app.helper";
import { cleanDatabase } from "../../helpers/database.helper";
import { testContext, type TestContext } from "../../helpers/test-context";
import { makeUser } from "../../factories/user.factory";
import {
  forgotPassword,
  resetPassword,
  login,
} from "../../helpers/auth.helper";

describe("Password reset", () => {
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

  it("should request a reset token without revealing whether the email exists", async () => {
    const user = makeUser();

    const existingResponse = await forgotPassword(user.email).expect(200);
    const missingResponse = await forgotPassword("missing@example.com").expect(
      200,
    );

    expect(existingResponse.body.message).toBe(
      "If the email exists, a reset link has been sent.",
    );
    expect(missingResponse.body.message).toBe(
      "If the email exists, a reset link has been sent.",
    );
  });

  it("should reset a password with a valid token and reject reuse", async () => {
    const user = makeUser();

    await ctx.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        passwordHash: "hashed-password",
      },
    });

    const response = await forgotPassword(user.email).expect(200);
    const resetToken = response.body.resetToken as string;

    expect(resetToken).toEqual(expect.any(String));

    await resetPassword(resetToken, "NewPassword123!").expect(200);

    await login(user.email, user.password).expect(401);
    await login(user.email, "NewPassword123!").expect(200);

    await resetPassword(resetToken, "AnotherNewPassword123!").expect(401);
  });

  it("should reject invalid or expired reset tokens", async () => {
    const user = makeUser();

    await ctx.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        passwordHash: "hashed-password",
      },
    });

    await resetPassword("invalid-token", "NewPassword123!").expect(401);

    const response = await forgotPassword(user.email).expect(200);
    const resetToken = response.body.resetToken as string;

    await ctx.prisma.user.update({
      where: { email: user.email },
      data: {
        passwordResetTokenExpiresAt: new Date(Date.now() - 60_000),
      },
    });

    await resetPassword(resetToken, "NewPassword123!").expect(401);
  });

  it("should validate the new password", async () => {
    const user = makeUser();

    await ctx.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        passwordHash: "hashed-password",
      },
    });

    const response = await forgotPassword(user.email).expect(200);
    const resetToken = response.body.resetToken as string;

    await resetPassword(resetToken, "short").expect(400);
  });
});
