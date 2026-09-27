# Next Nest Store — Backend API

Enterprise-grade **NestJS** REST API powering the Next Nest Store platform. Built with **Prisma ORM**, **PostgreSQL**, **JWT Authentication with Session Tracking**, **Zod Validation**, and **Swagger / OpenAPI Documentation**.

---

## 🚀 Key Features & Modules

- **Authentication & Security:**
  - Double JWT architecture (short-lived access tokens + securely hashed refresh tokens).
  - Multi-device session manager (`ACTIVE`, `PENDING`, `REVOKED`) with automated queue promotion upon logout.
  - Cryptographically secure password reset flow with token hashing and automatic invalidation of all active sessions.
  - Role-based authorization (`ADMIN`, `USER`) via custom decorators (`@Roles`) and guards (`RolesGuard`).
- **Products & Catalog:**
  - Advanced filtering, searching, sorting, and pagination.
  - Multi-variant management (sizes, colors, custom JSON attributes, stock tracking).
  - Deals, discounts (`PERCENTAGE`, `FIXED`), and new arrival classifications.
- **Categories:**
  - Self-referencing hierarchical category tree (`parent` / `children`).
  - Slug-based queries and recursive descendant product retrieval.
- **Cart & Checkout:**
  - Unified cart system supporting both authenticated users and anonymous guests (using HTTP-only signed cookies).
  - Inventory validation and price synchronization.
- **Wishlist:**
  - One-click user wishlist management with product relation tracking.
- **Documentation:**
  - Fully interactive **Swagger / OpenAPI** UI available at `/docs`.

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) v11
- **Language:** TypeScript 5
- **Database & ORM:** PostgreSQL 17 + [Prisma ORM](https://www.prisma.io/) v6
- **Validation:** [Zod](https://zod.dev/) + Custom NestJS ZodValidationPipes
- **Documentation:** [Swagger](https://swagger.io/) / OpenAPI
- **Testing:** Jest + Supertest (Unit & E2E)

---

## ⚙️ Environment Variables

Configure the following variables in the root `.env` file (or your deployment dashboard):

| Variable                 |   Required    | Description                                           | Example                                              |
| :----------------------- | :-----------: | :---------------------------------------------------- | :--------------------------------------------------- |
| `NODE_ENV`               |      Yes      | App environment (`development`, `production`, `test`) | `production`                                         |
| `PORT` or `BACKEND_PORT` |      No       | Port on which the API listens (defaults to `3000`)    | `3000`                                               |
| `DATABASE_URL`           |      Yes      | PostgreSQL connection string                          | `postgresql://user:pass@host:5432/db?schema=public`  |
| `JWT_SECRET`             |      Yes      | Secret key for signing JWTs (minimum 32 characters)   | `random_32_characters_secret_key...`                 |
| `ADMIN_SECRET`           |      No       | Secret key for protected administrative tasks         | `random_16_chars_admin_key`                          |
| `CORS_ORIGIN`            | Yes (in prod) | Allowed origins (comma-separated URLs)                | `https://store.yourdomain.com,http://localhost:4000` |
| `ENABLE_GUEST_CART`      |      No       | Enable anonymous guest carts with cookies             | `true`                                               |

---

## 📜 Development & Testing Commands

Run from the root of the monorepo:

```bash
# Start backend in watch/development mode
pnpm dev:backend

# Run TypeScript compilation check
pnpm --filter backend check-types

# Run ESLint
pnpm --filter backend lint

# Build for production
pnpm --filter backend build

# Run unit tests
pnpm test:unit

# Run end-to-end (E2E) tests
pnpm test:e2e
```

---

## 📖 Swagger Documentation

Once the server is running, navigate to:

```text
http://localhost:3000/docs
```

Here you can explore every endpoint, view request schemas, test authentication tokens, and inspect response types.

---

## 🚢 Production Deployment

### Option 1: Railway / Render (Cloud PaaS)

1. Link your GitHub repository to Railway or Render.
2. Set the **Root Directory** to `apps/backend` (or leave at root with `pnpm --filter backend build`).
3. Set **Build Command**:
   ```bash
   pnpm db:generate && pnpm --filter @repo/database build && pnpm --filter @repo/shared build && pnpm --filter backend build
   ```
4. Set **Start Command**:
   ```bash
   pnpm --filter @repo/database migrate:deploy && node apps/backend/dist/main.js
   ```
5. Supply the production environment variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production`).

### Option 2: Docker Container (Self-hosted / VPS)

Build and run using the optimized multi-stage production Dockerfile:

```bash
docker build -t store-backend -f docker/backend/Dockerfile.prod .
docker run -d -p 3000:3000 --env-file .env store-backend
```
