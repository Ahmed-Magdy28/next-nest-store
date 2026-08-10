import { createTestingApp } from "../helpers/app.helper";
import { assertTestDatabase, cleanDatabase } from "../helpers/database.helper";
import { testContext } from "../helpers/test-context";

beforeAll(async () => {
  assertTestDatabase();

  const context = await createTestingApp();

  testContext.app = context.app;
  testContext.prisma = context.prisma;
});

beforeEach(async () => {
  await cleanDatabase(testContext.prisma);
});

afterAll(async () => {
  await testContext.app.close();
});
