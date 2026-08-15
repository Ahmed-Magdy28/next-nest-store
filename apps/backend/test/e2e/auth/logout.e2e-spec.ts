import { logout, register, refresh, me } from "../../helpers/auth.helper";
import { makeUser } from "../../factories/user.factory";
import { AuthResponse } from "../../types/auth.types";

describe("POST /auth/logout", () => {
  it("should logout successfully", async () => {
    const user = makeUser();

    const registerResponse = await register(user).expect(201);
    const body = registerResponse.body as AuthResponse;

    expect(body.accessToken).toEqual(expect.any(String));

    await logout(body.accessToken!).expect(204);

    await refresh(body.refreshToken).expect(401);
  });

  it("should reject logout without access token", async () => {
    await logout("").expect(401);
  });

  it("should reject logout with invalid access token", async () => {
    await logout("invalid-access-token").expect(401);
  });

  it("should invalidate the access token after logout", async () => {
    const user = makeUser();

    const registerResponse = await register(user).expect(201);
    const body = registerResponse.body as AuthResponse;

    expect(body.accessToken).toEqual(expect.any(String));

    await logout(body.accessToken!).expect(204);

    await me(body.accessToken!).expect(401);
  });
});
