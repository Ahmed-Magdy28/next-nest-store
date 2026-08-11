import type { Test } from "supertest";

import { TestUser } from "../factories/user.factory";
import { api } from "./request.helper";

export function register(user: TestUser): Test {
  return api().post("/auth/register").send(user);
}

export function login(email: string, password: string): Test {
  return api().post("/auth/login").send({
    email,
    password,
  });
}

export function refresh(refreshToken: string): Test {
  return api()
    .post("/auth/refresh")
    .set("Authorization", `Bearer ${refreshToken}`);
}

export function me(accessToken: string): Test {
  return api().get("/auth/me").set("Authorization", `Bearer ${accessToken}`);
}

export function logout(accessToken: string): Test {
  return api()
    .post("/auth/logout")
    .set("Authorization", `Bearer ${accessToken}`);
}

export function sessions(accessToken: string): Test {
  return api()
    .get("/auth/sessions")
    .set("Authorization", `Bearer ${accessToken}`);
}

export function revokeSession(accessToken: string, sessionId: string): Test {
  return api()
    .delete(`/auth/sessions/${sessionId}`)
    .set("Authorization", `Bearer ${accessToken}`);
}

export function revokeAllSessions(accessToken: string): Test {
  return api()
    .delete("/auth/sessions")
    .set("Authorization", `Bearer ${accessToken}`);
}

export function forgotPassword(email: string): Test {
  return api().post("/auth/forgot-password").send({ email });
}

export function resetPassword(token: string, password: string): Test {
  return api().post("/auth/reset-password").send({ token, password });
}
