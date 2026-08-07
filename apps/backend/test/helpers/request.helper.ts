import { INestApplication } from "@nestjs/common";
import request from "supertest";

export function api(app: INestApplication) {
  return request(app.getHttpServer());
}
