import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import type { PrismaClient } from "../../prisma/generated";
import { UserRole, SessionStatus } from "../../prisma/generated";

export async function seedUsers(prisma: PrismaClient) {
  console.log("🌱 Seeding users with Faker...");

  const passwordHash = await bcrypt.hash("Password123!", 12);

  // 1) Admin user
  const admin = await prisma.user.upsert({
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

  // Ensure admin has an active session
  await prisma.session.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {
      status: SessionStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      revokedAt: null,
    },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      userId: admin.id,
      status: SessionStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      deviceName: "Chrome on macOS",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      ipAddress: "192.168.1.10",
      lastUsedAt: new Date(),
    },
  });

  // 2) Standard test user
  const defaultUser = await prisma.user.upsert({
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

  // Ensure test user has an active session
  await prisma.session.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {
      status: SessionStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      revokedAt: null,
    },
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      userId: defaultUser.id,
      status: SessionStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      deviceName: "Mobile Safari on iPhone",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
      ipAddress: "192.168.1.15",
      lastUsedAt: new Date(),
    },
  });

  // 3) Generate 20 diverse users using Faker
  faker.seed(12345); // Deterministic seed for reproducible testing
  for (let i = 1; i <= 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet
      .username({ firstName, lastName })
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .slice(0, 20);
    const email = `customer${i}@example.com`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        username,
        passwordHash,
        role: UserRole.USER,
        isVerified: faker.datatype.boolean(0.85),
      },
    });

    // Make some users have active sessions, some expired, some revoked
    const hasActiveSession = i <= 12; // 12 active users
    if (hasActiveSession) {
      await prisma.session.upsert({
        where: { id: `00000000-0000-0000-0000-0000000000${String(i + 10).padStart(2, "0")}` },
        update: {
          status: SessionStatus.ACTIVE,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          revokedAt: null,
        },
        create: {
          id: `00000000-0000-0000-0000-0000000000${String(i + 10).padStart(2, "0")}`,
          userId: user.id,
          status: SessionStatus.ACTIVE,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          deviceName: faker.helpers.arrayElement([
            "Chrome on Windows",
            "Safari on Mac",
            "Firefox on Linux",
            "Samsung Internet",
            "Chrome on Android",
          ]),
          userAgent: faker.internet.userAgent(),
          ipAddress: faker.internet.ip(),
          lastUsedAt: faker.date.recent({ days: 3 }),
        },
      });
    }
  }

  console.log("✅ Seeded 22 users (including active and inactive session holders)");
}

