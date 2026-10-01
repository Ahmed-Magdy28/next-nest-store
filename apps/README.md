# 🚀 Applications (`apps/`)

Welcome to the **Applications** directory of the **Next Nest Store** monorepo. This directory houses the three core runnable applications that make up the e-commerce platform: the customer storefront, the administrative dashboard, and the centralized backend API engine.

All applications are built with modern TypeScript and managed seamlessly via [Turborepo](https://turbo.build/) and [pnpm](https://pnpm.io/).

---

## 🧭 Applications Overview

| Application | Directory | Port | Framework / Tech | Target Audience | Documentation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Storefront** | [`frontend/`](./frontend) | `4000` | Next.js 16, React 19, Tailwind CSS | Shoppers & Customers | [Frontend Guide](./frontend/README.md) |
| **Admin Dashboard** | [`admin/`](./admin) | `3001` | Next.js 16, React 19, Tailwind CSS | Store Managers & Admins | [Admin Guide](./admin/README.md) |
| **Core REST API** | [`backend/`](./backend) | `4005` / `3000` | NestJS 11, Express, Prisma ORM | Frontend & Admin Clients | [Backend Guide](./backend/README.md) |

---

## 📱 1. Frontend (`apps/frontend`)

The customer-facing storefront designed for speed, aesthetic appeal, and bilingual accessibility.

- **Framework**: Next.js 16 (App Router) with Turbopack.
- **Port**: `http://localhost:4000`
- **Key Features**:
  - **Full Internationalization (i18n)**: English (LTR) and Arabic (RTL) powered by `next-intl`.
  - **Catalog & Discovery**: Unified catalog view with real-time search, category filtering, price sorting, and URL-synchronized pagination across `/products`, `/deals`, `/new-arrivals`, and `/best-sellers`.
  - **Cart & Guest Persistence**: Full cart support for both guest sessions and authenticated users with automatic cart merging upon sign in.
  - **Checkout Experience**: Shipping address selection, promo coupon discounts, and multiple payment options (Cash on delivery, Credit Card, E-Wallet).
  - **User Account**: Order tracking history with expandable status details, saved addresses, and profile settings.
  - **Product Reviews & Wishlist**: Real-time customer reviews and heart-to-wishlist management.

📖 **Detailed Guide**: Read the [Frontend README](./frontend/README.md) for environment variables, scripts, and routing.

---

## 📊 2. Admin Dashboard (`apps/admin`)

The internal management center for e-commerce operations, catalog control, and business analytics.

- **Framework**: Next.js 16 (App Router) with Tailwind CSS.
- **Port**: `http://localhost:3001`
- **Key Features**:
  - **Live KPI Analytics**: Real-time metric cards tracking **Total Users**, **Active Sessions**, **Total Revenue**, and **Orders Count**.
  - **Catalog Management**: Create, update, soft-delete, and organize products, multi-attribute variants (colors, sizes, storage), and nested category hierarchies.
  - **Order Processing**: Monitor incoming orders, update fulfillment statuses (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`), and review delivery addresses.
  - **Coupons & Promotions**: Manage promo codes, percentage/fixed discounts, expiration dates, and usage limits.
  - **Bilingual Interface**: Seamless switching between English and Arabic dashboards.

📖 **Detailed Guide**: Read the [Admin README](./admin/README.md) for admin credentials, setup, and deployment tips.

---

## ⚙️ 3. Backend API (`apps/backend`)

The robust, scalable, enterprise-grade REST API server powering both the Storefront and the Admin Dashboard.

- **Framework**: NestJS 11 with Prisma ORM and PostgreSQL 17.
- **Port**: `http://localhost:4005` (or `3000`)
- **Key Features**:
  - **Authentication & Security**: JWT access tokens, HTTP-only secure refresh tokens, multi-device session management with revocation, and bcrypt hashing.
  - **Role-Based Access Control (RBAC)**: Fine-grained `@Roles(UserRole.ADMIN)` guards protecting administrative endpoints and metrics.
  - **E-Commerce Services**: Products, Variants, Categories (with tree traversal), Cart, Orders, Reviews, Wishlist, and Coupons.
  - **API Documentation**: Automated OpenAPI/Swagger documentation available at `http://localhost:4005/docs`.
  - **Validation & Data Integrity**: Comprehensive request validation via Zod schemas and NestJS pipes.

📖 **Detailed Guide**: Read the [Backend README](./backend/README.md) for API architecture, modules, test suites, and Swagger endpoints.

---

## 🔗 Shared Packages

All three applications leverage shared packages in the [`packages/`](../packages) directory for maximum code reuse and strict type safety:

- **`@repo/shared`**: Shared TypeScript interfaces, DTOs, Zod schemas, constants, and utilities.
- **`@repo/database`**: Central Prisma client, database schemas, PostgreSQL migrations, and Faker-powered database seeding.
- **`@repo/eslint-config`** & **`@repo/typescript-config`**: Standardized linting and compiler configurations.

---

## 🛠️ Development Commands

You can run each application individually or all together from the repository root:

```bash
# Run all applications simultaneously with Turbo
pnpm dev

# Run only the Storefront (Port 4000)
pnpm dev:frontend

# Run only the Admin Dashboard (Port 3001)
pnpm dev:admin

# Run only the Backend API (Port 4005 / 3000)
pnpm dev:backend
```
