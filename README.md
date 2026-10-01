<div align="center">

# 🛒 Next Nest Store

**A full-stack, enterprise-grade e-commerce monorepo built for high performance and scalability.**

[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-ef4444?style=flat-square&logo=turborepo)](https://turbo.build/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2011-ea284e?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%206-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2017-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ed?style=flat-square&logo=docker)](https://www.docker.com/)

</div>

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Client ["Client & Admin Devices"]
        BrowserStore["Storefront Shopper (Arabic RTL / English LTR)"]
        BrowserAdmin["Store Administrator (Admin Dashboard)"]
    end

    subgraph Storefront ["Storefront Layer (Next.js 16)"]
        NextApp["Next.js App Router & Turbopack"]
        I18n["next-intl (ar / en)"]
        Query["TanStack React Query v5"]
    end

    subgraph AdminLayer ["Admin Layer (Next.js 16)"]
        AdminApp["Admin Dashboard & Turbopack"]
        AdminI18n["next-intl (ar / en)"]
        AdminMetrics["KPIs & Catalog Management"]
    end

    subgraph API ["Backend API Layer (NestJS 11)"]
        NestApp["NestJS Modular Server (Port 4005 / 3000)"]
        AuthModule["Auth & Multi-Device Sessions"]
        CatalogModule["Products, Variants & Categories"]
        CartModule["Cart, Orders & Checkout"]
        UsersModule["Users & KPI Stats"]
        Swagger["Swagger UI (/docs)"]
    end

    subgraph Data ["Data & Persistence Layer"]
        Prisma["Prisma ORM (@repo/database)"]
        Postgres[(PostgreSQL 17 Database)]
    end

    BrowserStore -->|"HTTP / HTTPS"| NextApp
    BrowserAdmin -->|"HTTP / HTTPS"| AdminApp
    NextApp -->|"API Calls (CORS)"| NestApp
    AdminApp -->|"API Calls (CORS & Bearer Auth)"| NestApp
    NestApp --> Prisma
    Prisma --> Postgres
```

---

## 📂 Monorepo Structure

```text
.
├── apps/
│   ├── frontend/             # Next.js 16 storefront (Port 4000)
│   ├── admin/                # Next.js 16 admin dashboard (Port 3001)
│   └── backend/              # NestJS 11 REST API with Swagger & JWT (Port 4005 / 3000)
├── packages/
│   ├── database/             # Prisma schema, migrations, service & seeds
│   ├── shared/               # Shared DTOs, Zod schemas, types & constants
│   ├── eslint-config/        # Monorepo ESLint flat configs
│   └── typescript-config/    # Monorepo tsconfig templates
├── docker/
│   ├── backend/              # Dockerfile (Dev & Prod)
│   ├── frontend/             # Dockerfile (Dev & Prod)
│   ├── admin/                # Dockerfile (Dev & Prod)
│   └── postgres/             # Database initialization scripts
├── docker-compose.yml        # Development environment (Hot-reloading)
└── docker-compose.prod.yml   # Production-ready stack
```

---

## ⚡ Quickstart & Local Development

### Prerequisites

- **Node.js:** `>= 22.0.0`
- **Package Manager:** `pnpm` (`v11+` or `corepack enable`)
- **Docker & Docker Compose** (for database or containerized dev)

---

### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/your-username/next-nest-store.git
cd next-nest-store
pnpm install
```

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure your `.env` contains:

```env
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars_long
CORS_ORIGIN=http://localhost:4000,http://localhost:3000
DATABASE_URL="postgresql://next_nest_store:Mango%40123@localhost:5432/next_nest_store?schema=public"
DATABASE_TEST_URL="postgresql://next_nest_store:Mango%40123@localhost:5432/next_nest_store_test?schema=public&connection_limit=1"
POSTGRES_USER=next_nest_store
POSTGRES_PASSWORD=Mango@123
POSTGRES_DB=next_nest_store
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:4000
```

---

### Step 3: Run the Database & Seed Data

1. **Start the local PostgreSQL container:**

   ```bash
   pnpm db:up
   ```

2. **Apply migrations and seed initial data:**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

> 🔑 **Pre-seeded Credentials:**
>
> - **Admin:** `admin@example.com` / `Password123!`
> - **User:** `user@example.com` / `Password123!`

---

### Step 4: Start Development Servers

You can run both apps concurrently or individually:

```bash
# Run both Frontend & Backend via Turbo
pnpm dev

# OR run individually:
pnpm dev:backend     # Runs NestJS on http://localhost:3000
pnpm dev:frontend    # Runs Next.js on http://localhost:4000
```

- **Frontend Storefront:** [http://localhost:4000](http://localhost:4000)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Interactive Swagger Docs:** [http://localhost:3000/docs](http://localhost:3000/docs)
- **Prisma Studio (DB GUI):** `pnpm db:studio` -> [http://localhost:5555](http://localhost:5555)

---

## 🚢 Comprehensive Deployment Guide

You can deploy the project using either **Cloud Managed Platforms (Serverless/PaaS)** or **A Single Linux VPS (Docker Compose)**.

---

### Method A: Cloud Managed Stack (Vercel + Railway / Render + Supabase / Neon)

This is the recommended, zero-devops setup for scalability and low maintenance.

```text
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│  Vercel        │ ───> │  Railway       │ ───> │  Supabase/Neon │
│  (Next.js App) │      │  (NestJS API)  │      │  (Postgres DB) │
└────────────────┘      └────────────────┘      └────────────────┘
```

#### 1. Deploy the Database (Neon / Supabase / Railway Postgres)

1. Create a PostgreSQL project on [Neon](https://neon.tech/) or [Supabase](https://supabase.com/).
2. Copy your connection string (`DATABASE_URL`).
3. Run the migrations and seed against your remote database from your machine:
   ```bash
   DATABASE_URL="your-remote-postgres-url" pnpm --filter @repo/database migrate:deploy
   DATABASE_URL="your-remote-postgres-url" pnpm db:seed
   ```

#### 2. Deploy the Backend API (Railway or Render)

1. Link your GitHub repo to [Railway](https://railway.app/) or [Render](https://render.com/).
2. Configure settings:
   - **Root Directory:** Leave empty (root of repository) or `apps/backend`.
   - **Build Command:**
     ```bash
     pnpm db:generate && pnpm --filter @repo/database build && pnpm --filter @repo/shared build && pnpm --filter backend build
     ```
   - **Start Command:**
     ```bash
     pnpm --filter @repo/database migrate:deploy && node apps/backend/dist/main.js
     ```
3. Set **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (or Railway provided port)
   - `DATABASE_URL`: `your-remote-postgres-url`
   - `JWT_SECRET`: Secure 32+ character random string
   - `ADMIN_SECRET`: Secure 16+ character random string
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://my-store.vercel.app`)
   - `ENABLE_GUEST_CART`: `true`
4. Copy your live backend public domain (e.g., `https://backend-production-xyz.up.railway.app`).

#### 3. Deploy the Frontend Storefront (Vercel)

1. Import your GitHub repository to [Vercel](https://vercel.com/).
2. Set **Root Directory** to `apps/frontend`.
3. Set **Framework Preset** to `Next.js`.
4. Configure **Build & Development Settings**:
   - **Build Command:** `pnpm --filter @repo/shared build && pnpm --filter frontend build`
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`
5. Configure **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your live backend URL (e.g., `https://backend-production-xyz.up.railway.app`).
   - `NEXT_PUBLIC_SITE_URL`: Your Vercel frontend URL (e.g., `https://my-store.vercel.app`).
6. Click **Deploy**.

---

### Method B: Self-Hosted Production VPS (Docker Compose)

Deploy everything (Postgres + NestJS + Next.js) on a single VPS (DigitalOcean Droplet, Hetzner, AWS EC2, or Ubuntu server).

#### 1. Setup your Server & Clone Repo

```bash
git clone https://github.com/your-username/next-nest-store.git
cd next-nest-store
cp .env.example .env
```

#### 2. Edit `.env` for Production

```env
NODE_ENV=production
POSTGRES_PASSWORD=your_strong_postgres_password
POSTGRES_USER=next_nest_store
POSTGRES_DB=next_nest_store
JWT_SECRET=generate_strong_secret_key_minimum_32_characters
ADMIN_SECRET=generate_strong_admin_key_minimum_16_characters

# Your production domains
CORS_ORIGIN=https://store.yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://store.yourdomain.com
```

#### 3. Launch Production Containers

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

This single command will:

1. Start PostgreSQL 17 with automated health monitoring.
2. Build and start the production NestJS container with automated migration deployment.
3. Build and start the standalone Next.js container on port 4000.

#### 4. Seed Database Inside Container (Optional)

```bash
docker compose -f docker-compose.prod.yml exec backend pnpm db:seed
```

#### 5. Configure Reverse Proxy & SSL (Caddy Example)

Install Caddy for automated, zero-touch Let's Encrypt SSL:

```caddy
# /etc/caddy/Caddyfile

store.yourdomain.com {
    reverse_proxy localhost:4000
}

api.yourdomain.com {
    reverse_proxy localhost:3000
}
```

Reload Caddy: `sudo systemctl reload caddy`.

---

## 🛠️ Monorepo Scripts Reference

| Command             | Description                                                  |
| :------------------ | :----------------------------------------------------------- |
| `pnpm dev`          | Starts all apps in watch mode through Turborepo              |
| `pnpm dev:frontend` | Starts Next.js app on port `4000`                            |
| `pnpm dev:backend`  | Starts NestJS API on port `3000`                             |
| `pnpm build`        | Builds all packages and applications                         |
| `pnpm check-types`  | Type-checks all 7 workspace packages without emitting JS     |
| `pnpm lint`         | Runs ESLint across all projects                              |
| `pnpm test:unit`    | Executes backend unit tests                                  |
| `pnpm test:e2e`     | Executes backend E2E tests against test database             |
| `pnpm db:up`        | Starts local PostgreSQL container                            |
| `pnpm db:down`      | Stops local PostgreSQL container                             |
| `pnpm db:generate`  | Regenerates Prisma Client                                    |
| `pnpm db:migrate`   | Runs Prisma development migrations                           |
| `pnpm db:seed`      | Populates database with default products, categories & users |
| `pnpm db:studio`    | Launches Prisma Studio GUI                                   |

---

## 🔒 Security Best Practices

- **Never commit secrets:** All credentials must live in `.env` (which is git-ignored).
- **CORS enforcement:** In production (`NODE_ENV=production`), NestJS strictly requires and validates `CORS_ORIGIN`.
- **JWT Protection:** Refresh tokens are hashed using SHA-256 and bcrypt before saving to the database to mitigate database breach exposure.
- **Session Revocation:** Resetting a password automatically revokes all other active sessions across devices.

---

## 📄 License

This project is licensed under the MIT License.
