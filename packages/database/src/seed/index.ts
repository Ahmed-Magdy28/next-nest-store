import { existsSync } from "node:fs";
import { PrismaClient } from "../../prisma/generated";
import { seedUsers } from "./seed-users";
import { seedCategories } from "./seed-categories";
import { seedProducts } from "./seed-products";
import { seedCoupons } from "./seed-coupons";

// When running inside a Docker container, rewrite localhost/127.0.0.1 in DATABASE_URL
// to host.docker.internal so the seed can reach the host's local PostgreSQL.
if (existsSync("/.dockerenv") && process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
    /@(localhost|127\.0\.0\.1):/,
    "@host.docker.internal:",
  );
}

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting seed...\n");

  await seedUsers(prisma);
  const slugToId = await seedCategories(prisma);
  await seedProducts(prisma, slugToId);
  await seedCoupons(prisma);

  console.log("\n🎉 Seed completed successfully!\n");
  console.log("📝 Credentials:");
  console.log("   Admin: admin@example.com / Password123!");
  console.log("   User:  user@example.com / Password123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
