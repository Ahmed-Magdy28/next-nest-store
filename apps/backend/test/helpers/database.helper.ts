import { PrismaService } from "@repo/database";

export async function cleanDatabase(prisma: PrismaService): Promise<void> {
  await prisma.user.deleteMany();
}
