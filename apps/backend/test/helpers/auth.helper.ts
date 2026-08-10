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
