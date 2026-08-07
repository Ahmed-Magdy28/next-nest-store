import { INestApplication } from "@nestjs/common";

import { api } from "./request.helper";
import type { Test } from "supertest";

import { TestUser } from "../factories/user.factory";

export function register(app: INestApplication, user: TestUser): Test {
  return api(app).post("/auth/register").send(user);
}

export function login(
  app: INestApplication,
  email: string,
  password: string,
): Test {
  return api(app).post("/auth/login").send({
    email,
    password,
  });
}

export function refresh(app: INestApplication, refreshToken: string): Test {
  return api(app)
    .post("/auth/refresh")
    .set("Authorization", `Bearer ${refreshToken}`);
}

export function me(app: INestApplication, accessToken: string): Test {
  return api(app).get("/auth/me").set("Authorization", `Bearer ${accessToken}`);
}
