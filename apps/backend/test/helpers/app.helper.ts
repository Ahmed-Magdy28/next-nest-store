import { Test } from "@nestjs/testing";
import { PrismaService } from "@repo/database";
import { AppModule } from "../../src/app.module";
import { TestContext } from "./test-context";
export async function createTestingApp(): Promise<TestContext> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  await app.init();
  const prisma = app.get(PrismaService);

  return {
    app,
    prisma,
  };
}
