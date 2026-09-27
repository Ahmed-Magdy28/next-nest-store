import * as bcrypt from "bcrypt";
import {
  PrismaClient,
  UserRole,
  DiscountType,
  CouponType,
} from "../prisma/generated/index.js";

const prisma = new PrismaClient();

const PASSWORD = "Password123!";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function seedUsers() {
  console.log("🌱 Seeding users...");

  const passwordHash = await hashPassword(PASSWORD);

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

  const user = await prisma.user.upsert({
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

  console.log(`✅ Users: admin, user`);
  return { admin, user };
}

async function seedCategories() {
  console.log("🌱 Seeding categories...");

  // Root categories
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      arName: "إلكترونيات",
      slug: "electronics",
      isActive: true,
      sortOrder: 0,
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: {
      name: "Clothing",
      arName: "ملابس",
      slug: "clothing",
      isActive: true,
      sortOrder: 1,
    },
  });

  const books = await prisma.category.upsert({
    where: { slug: "books" },
    update: {},
    create: {
      name: "Books",
      arName: "كتب",
      slug: "books",
      isActive: true,
      sortOrder: 2,
    },
  });

  // Subcategories
  const laptops = await prisma.category.upsert({
    where: { slug: "laptops" },
    update: {},
    create: {
      name: "Laptops",
      arName: "لابتوبات",
      slug: "laptops",
      parentId: electronics.id,
      isActive: true,
      sortOrder: 0,
    },
  });

  const phones = await prisma.category.upsert({
    where: { slug: "phones" },
    update: {},
    create: {
      name: "Phones",
      arName: "هواتف",
      slug: "phones",
      parentId: electronics.id,
      isActive: true,
      sortOrder: 1,
    },
  });

  const menClothing = await prisma.category.upsert({
    where: { slug: "men-clothing" },
    update: {},
    create: {
      name: "Men's Clothing",
      arName: "ملابس رجالية",
      slug: "men-clothing",
      parentId: clothing.id,
      isActive: true,
      sortOrder: 0,
    },
  });

  console.log(
    `✅ Categories: ${electronics.name}, ${clothing.name}, ${books.name}, ${laptops.name}, ${phones.name}, ${menClothing.name}`,
  );

  return {
    electronics,
    clothing,
    books,
    laptops,
    phones,
    menClothing,
  };
}

async function seedProducts(
  categories: Awaited<ReturnType<typeof seedCategories>>,
) {
  console.log("🌱 Seeding products...");

  // MacBook
  const macbook = await prisma.product.upsert({
    where: { slug: "macbook-pro-16" },
    update: {},
    create: {
      name: "MacBook Pro 16",
      arName: "ماك بوك برو 16",
      slug: "macbook-pro-16",
      sku: "MBP-16-001",
      regularPrice: 2499.99,
      discountPrice: 2299.99,
      onDiscount: true,
      discountType: DiscountType.PERCENTAGE,
      discountValue: 8,
      description: "Powerful laptop for professionals.",
      arDescription: "لابتوب قوي للمحترفين.",
      mainImage: "https://picsum.photos/seed/macbook/800/800",
      imageGallery: [
        "https://picsum.photos/seed/macbook1/800/800",
        "https://picsum.photos/seed/macbook2/800/800",
      ],
      isNew: true,
      isActive: true,
      isAvailable: true,
      categories: {
        create: [{ categoryId: categories.laptops.id }],
      },
      variants: {
        create: [
          {
            sku: "MBP-16-001-512",
            name: "512GB / 16GB RAM",
            arName: "٥١٢ جيجا / ١٦ رام",
            attributes: { storage: "512GB", ram: "16GB" },
            regularPrice: 2499.99,
            discountPrice: 2299.99,
            stockQuantity: 10,
            isAvailable: true,
            isActive: true,
            sortOrder: 0,
          },
          {
            sku: "MBP-16-001-1TB",
            name: "1TB / 32GB RAM",
            arName: "١ تيرا / ٣٢ رام",
            attributes: { storage: "1TB", ram: "32GB" },
            regularPrice: 2999.99,
            discountPrice: 2799.99,
            stockQuantity: 5,
            isAvailable: true,
            isActive: true,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  // iPhone
  const iphone = await prisma.product.upsert({
    where: { slug: "iphone-15-pro" },
    update: {},
    create: {
      name: "iPhone 15 Pro",
      arName: "آيفون 15 برو",
      slug: "iphone-15-pro",
      sku: "IPH-15P-001",
      regularPrice: 1199.99,
      discountPrice: 1199.99,
      description: "Latest iPhone with A17 Pro chip.",
      arDescription: "أحدث آيفون بمعالج A17 Pro.",
      mainImage: "https://picsum.photos/seed/iphone15/800/800",
      imageGallery: ["https://picsum.photos/seed/iphone15-1/800/800"],
      isNew: true,
      isActive: true,
      isAvailable: true,
      categories: {
        create: [{ categoryId: categories.phones.id }],
      },
    },
  });

  // T-Shirt
  const tshirt = await prisma.product.upsert({
    where: { slug: "cotton-tshirt" },
    update: {},
    create: {
      name: "Cotton T-Shirt",
      arName: "تي شيرت قطن",
      slug: "cotton-tshirt",
      sku: "TS-COT-001",
      regularPrice: 29.99,
      discountPrice: 19.99,
      onDiscount: true,
      discountType: DiscountType.FIXED,
      discountValue: 10,
      description: "Comfortable cotton t-shirt.",
      arDescription: "تي شيرت قطن مريح.",
      mainImage: "https://picsum.photos/seed/tshirt/800/800",
      isActive: true,
      isAvailable: true,
      categories: {
        create: [{ categoryId: categories.menClothing.id }],
      },
      variants: {
        create: [
          {
            sku: "TS-COT-001-S",
            name: "Small",
            arName: "صغير",
            size: "S",
            attributes: { color: "white" },
            stockQuantity: 20,
            isAvailable: true,
            isActive: true,
            sortOrder: 0,
          },
          {
            sku: "TS-COT-001-M",
            name: "Medium",
            arName: "متوسط",
            size: "M",
            attributes: { color: "white" },
            stockQuantity: 15,
            isAvailable: true,
            isActive: true,
            sortOrder: 1,
          },
          {
            sku: "TS-COT-001-L",
            name: "Large",
            arName: "كبير",
            size: "L",
            attributes: { color: "white" },
            stockQuantity: 0,
            isAvailable: false,
            isActive: true,
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // Book
  const book = await prisma.product.upsert({
    where: { slug: "clean-code" },
    update: {},
    create: {
      name: "Clean Code",
      arName: "الكود النظيف",
      slug: "clean-code",
      sku: "BK-CC-001",
      regularPrice: 49.99,
      discountPrice: 49.99,
      description: "A Handbook of Agile Software Craftsmanship.",
      arDescription: "دليل البرمجة الرشيقة.",
      mainImage: "https://picsum.photos/seed/cleancode/800/800",
      isActive: true,
      isAvailable: true,
      categories: {
        create: [{ categoryId: categories.books.id }],
      },
    },
  });

  console.log(
    `✅ Products: ${macbook.name}, ${iphone.name}, ${tshirt.name}, ${book.name}`,
  );

  return { macbook, iphone, tshirt, book };
}

async function seedCoupons() {
  console.log("🌱 Seeding coupons...");

  const coupon = await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: CouponType.PERCENTAGE,
      value: 10,
      minOrderAmount: 50,
      maxDiscount: 100,
      usageLimit: 1000,
      usageLimitPerUser: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true,
    },
  });

  console.log(`✅ Coupon: ${coupon.code}`);
}

async function main() {
  console.log("🚀 Starting seed...\n");

  const users = await seedUsers();
  const categories = await seedCategories();
  await seedProducts(categories);
  await seedCoupons();

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📝 Credentials:");
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
