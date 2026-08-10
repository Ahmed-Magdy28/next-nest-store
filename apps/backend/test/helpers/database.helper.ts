import { PrismaService } from "@repo/database";

export function assertTestDatabase(): void {
  const databaseUrl = process.env.DATABASE_URL;
  const testDatabaseUrl = process.env.DATABASE_TEST_URL;

  if (!databaseUrl || databaseUrl !== testDatabaseUrl) {
    throw new Error("E2E tests must use the test database.");
  }
}

export async function cleanDatabase(prisma: PrismaService): Promise<void> {
  await prisma.user.deleteMany();
}
