import * as bcrypt from "bcrypt";
import type { PrismaClient } from "../../prisma/generated";
import { UserRole } from "../../prisma/generated";

export async function seedUsers(prisma: PrismaClient) {
  console.log("🌱 Seeding users...");

  const passwordHash = await bcrypt.hash("Password123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin",
      passwordHash,
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      username: "user",
      passwordHash,
      role: UserRole.USER,
      isVerified: true,
    },
  });

  console.log("✅ Users: admin@example.com, user@example.com");
}
