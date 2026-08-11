import type { Test } from "supertest";

import { api } from "./request.helper";

export function getMyUser(accessToken: string): Test {
  return api().get("/users/me").set("Authorization", `Bearer ${accessToken}`);
}

export function updateMyUser(
  accessToken: string,
  body: Record<string, unknown>,
): Test {
  return api()
    .patch("/users/me")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(body);
}

export function updateMyUsername(accessToken: string, username: string): Test {
  return api()
    .patch("/users/me/username")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ username });
}

export function updateMyEmail(accessToken: string, email: string): Test {
  return api()
    .patch("/users/me/email")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ email });
}

export function verifyMyEmail(token: string): Test {
  return api().post("/users/me/email/verify").send({ token });
}

export function changeMyPassword(
  accessToken: string,
  currentPassword: string,
  newPassword: string,
): Test {
  return api()
    .patch("/users/me/password")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ currentPassword, newPassword });
}
