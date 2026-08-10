import { INestApplication } from "@nestjs/common";
import { PrismaService } from "@repo/database";

export interface TestContext {
  app: INestApplication;
  prisma: PrismaService;
}

export const testContext = {} as TestContext;
