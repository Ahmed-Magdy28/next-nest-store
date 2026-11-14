import { createHash } from "crypto";
import { INestApplication } from "@nestjs/common";

import { createTestingApp } from "../../helpers/app.helper";
import { cleanDatabase } from "../../helpers/database.helper";
import { testContext, type TestContext } from "../../helpers/test-context";
import { makeUser } from "../../factories/user.factory";
import {
  forgotPassword,
  resetPassword,
  login,
  register,
  refresh,
} from "../../helpers/auth.helper";
import type { AuthResponse } from "../../types/auth.types";

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

  async function issueResetToken(email: string): Promise<string> {
    await forgotPassword(email).expect(200);
    const updatedUser = await ctx.prisma.user.findUniqueOrThrow({
      where: { email },
    });
    expect(updatedUser.passwordResetTokenHash).toEqual(expect.any(String));

    const resetToken = `test-reset-token-${Date.now()}-${Math.random()}`;
    const tokenHash = createHash("sha256").update(resetToken).digest("hex");
    await ctx.prisma.user.update({
      where: { email },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
        passwordResetTokenUsedAt: null,
      },
    });
    return resetToken;
  }

  it("should reset a password with a valid token and reject reuse", async () => {
    const user = makeUser();

    await ctx.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        passwordHash: "hashed-password",
      },
    });

    const resetToken = await issueResetToken(user.email);

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

    const resetToken = await issueResetToken(user.email);

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

    const resetToken = await issueResetToken(user.email);

    await resetPassword(resetToken, "short").expect(400);
  });

  it("should revoke all existing sessions after a successful reset", async () => {
    const user = makeUser();

    const registerResponse = await register(user).expect(201);
    const loginResponse = await login(
      user.email,
      user.password,
      "device-2",
    ).expect(200);

    const registerBody = registerResponse.body as AuthResponse;
    const loginBody = loginResponse.body as AuthResponse;

    const resetToken = await issueResetToken(user.email);

    await resetPassword(resetToken, "NewPassword123!").expect(200);

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

    await refresh(registerBody.refreshToken).expect(401);
    await refresh(loginBody.refreshToken).expect(401);
  });
});
