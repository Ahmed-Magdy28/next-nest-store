# Deployment Guide: Neon + Railway + Vercel

This monorepo is configured for deploying:
- **Database**: [Neon](https://neon.tech) (Serverless PostgreSQL)
- **Backend API (`apps/backend`)**: [Railway](https://railway.app) (NestJS)
- **Storefront (`apps/frontend`)** & **Admin (`apps/admin`)**: [Vercel](https://vercel.com) (Next.js)

---

## 1. Database Setup on Neon

1. Create a new Neon project (PostgreSQL 16/17).
2. Copy the **Connection String** (with `?sslmode=require`).
   - Use the **direct** connection string if you run `prisma migrate deploy` from Railway, or if using the `-pooler` URL, ensure `?sslmode=require` (and optionally `&pgbouncer=true`) is included.
3. Keep this value ready as `DATABASE_URL` for Railway.

---

## 2. Backend API Setup on Railway

1. Create a new Railway project from this GitHub repository.
2. Leave **Root Directory** at the repository root `/` so Railway reads [`railway.toml`](./railway.toml).
   - `railway.toml` builds `@repo/database`, `@repo/shared`, and `backend`, runs `prisma migrate deploy` on start, and checks `/health`.
3. Set the following **Environment Variables** in Railway:
   - `NODE_ENV=production`
   - `DATABASE_URL=<your-neon-connection-string>`
   - `JWT_SECRET=<random-string-at-least-32-chars>`
   - `ADMIN_SECRET=<random-string-at-least-16-chars>`
   - `ENABLE_GUEST_CART=true`
   - `CORS_ORIGIN=https://your-storefront.vercel.app,https://your-admin.vercel.app` (update after deploying Vercel apps)
   - Optional: `SHIPPING_COST`, `SHIPPING_FREE_THRESHOLD`, `TAX_RATE_IN_PERCENTAGE`
4. Generate a public domain in Railway (e.g., `https://your-backend.up.railway.app`).
5. Verify `GET https://your-backend.up.railway.app/health` returns `{ "status": "ok", ... }`.

---

## 3. Storefront (`apps/frontend`) on Vercel

1. Import the repository in Vercel as a new project.
2. Set **Root Directory** to `apps/frontend`.
   - [`apps/frontend/vercel.json`](./apps/frontend/vercel.json) handles monorepo install and builds `@repo/shared` before `web`.
3. Set **Environment Variables**:
   - `NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app`
   - `NEXT_PUBLIC_SITE_URL=https://your-storefront.vercel.app`
   - Optional: `DEFAULT_LOCALE=en`, `siteTitle=Next Nest Store`
4. Deploy.

---

## 4. Admin Dashboard (`apps/admin`) on Vercel

1. Import the same repository in Vercel as a second project.
2. Set **Root Directory** to `apps/admin`.
   - [`apps/admin/vercel.json`](./apps/admin/vercel.json) handles monorepo install and builds `@repo/shared` before `admin`.
3. Set **Environment Variables**:
   - `NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app`
   - Optional: `ADMIN_SITE_TITLE=Next Nest Store Admin`
4. Deploy.

---

## 5. Finalize CORS on Railway

Update `CORS_ORIGIN` in Railway to include the exact production URLs of both Vercel projects (comma-separated, no trailing slashes):

```env
CORS_ORIGIN=https://your-storefront.vercel.app,https://your-admin.vercel.app
```

Redeploy or restart the Railway service for the new `CORS_ORIGIN` to take effect.
