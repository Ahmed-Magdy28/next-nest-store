# @repo/database

The database package provides the **Prisma ORM schema**, generated Prisma Client types, connection utilities, and automated database seeds for the **Next Nest Store** platform.

---

## 📦 What's Inside

- **Prisma Schema** (`prisma/schema.prisma`): Comprehensive PostgreSQL data model.
- **Migrations** (`prisma/migrations/`): Version-controlled database schema changes.
- **Generated Client** (`prisma/generated/`): Custom output path exporting types and models.
- **Prisma Service** (`src/prisma/prisma.service.ts`): NestJS injectable database provider with lifecycle management (`$connect`, `$disconnect`).
- **Database Seed** (`src/seed/`): Modular seeding scripts for initial users, categories, products, and coupons.

---

## 🗄️ Database Schema & Models

| Model               | Description                                                         | Key Relations                                              |
| :------------------ | :------------------------------------------------------------------ | :--------------------------------------------------------- |
| `User`              | User accounts with roles (`USER`, `ADMIN`) and hashed passwords.    | Has many `Session`, `Cart`, `Wishlist`, `Review`           |
| `Session`           | Multi-device session tracking (`ACTIVE`, `PENDING`, `REVOKED`).     | Belongs to `User`                                          |
| `Category`          | Hierarchical e-commerce categories with self-referencing tree.      | Self (`parent` / `children`), has many `CategoryProduct`   |
| `Product`           | Products with pricing, discounts, dimensions, and metadata.         | Belongs to categories, has many `ProductVariant`, `Review` |
| `ProductVariant`    | Product variants (sizes, colors, custom attributes, inventory).     | Belongs to `Product`                                       |
| `Cart` & `CartItem` | User and guest carts with automatic expiration and item quantities. | Belongs to `User`, links to `ProductVariant`               |
| `Wishlist`          | Saved items for registered users.                                   | Belongs to `User`, links to `Product`                      |
| `Coupon`            | Discount coupons with expiration and percentage/fixed discounts.    | Used in checkout flows                                     |

---

## 🛠️ CLI Commands & Scripts

All commands can be run from the root of the monorepo:

### 1. Generate Prisma Client

Generates the type-safe Prisma client in `packages/database/prisma/generated`:

```bash
pnpm db:generate
```

### 2. Run Local Migrations (Development)

Applies pending migrations or creates a new migration from changes to `schema.prisma`:

```bash
pnpm db:migrate
```

### 3. Deploy Migrations (Production / CI)

Applies migrations safely without modifying `schema.prisma` or creating new migrations:

```bash
pnpm --filter @repo/database migrate:deploy
```

### 4. Seed the Database

Populates the database with initial users, 39 categories, 38 products, and promo coupons:

```bash
pnpm db:seed
```

> **Default Seed Credentials:**
>
> - **Admin:** `admin@example.com` / `Password123!`
> - **User:** `user@example.com` / `Password123!`

### 5. Open Prisma Studio

Interactive GUI for inspecting and editing your database records:

```bash
pnpm db:studio
```

---

## 🚀 Production Deployment Notes

When deploying to production:

1. Ensure `DATABASE_URL` is set in your environment (with SSL enabled if using cloud providers like Neon, Supabase, or AWS RDS).
2. Run `migrate:deploy` as part of your CI/CD pipeline or container entrypoint before starting the backend application:
   ```bash
   pnpm --filter @repo/database migrate:deploy
   ```
3. If using connection poolers (such as PgBouncer, Neon pooling, or Supabase connection pooling), ensure your `DATABASE_URL` includes `?pgbouncer=true&connection_limit=1` for migrations or use a direct URL for migrations and pooled URL for application queries.
