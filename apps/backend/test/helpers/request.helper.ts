import request from "supertest";

import { testContext } from "./test-context";

export function api() {
  return request(testContext.app.getHttpServer());
}
