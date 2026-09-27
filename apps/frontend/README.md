# Next Nest Store — Frontend Storefront

Modern e-commerce storefront built with **Next.js 16** (App Router & Turbopack), **TypeScript**, **Tailwind CSS**, and **next-intl**.

---

## ✨ Features

- **Next.js 16 App Router:** Server-Side Rendering (SSR), Static Site Generation (SSG), and streaming for lightning-fast page loads.
- **Internationalization (i18n):**
  - Fully bilingual in **Arabic (العربية)** and **English**.
  - Dynamic **RTL (Right-to-Left)** and **LTR (Left-to-Right)** layout switching with directional font typography.
  - Localized URL routing (`/ar/products`, `/en/products`).
- **Data Fetching & Caching:**
  - Powered by **TanStack React Query v5** for optimistic updates, cache invalidation, and automatic background refetching.
- **Product Catalog & Shopping Experience:**
  - Dynamic faceted search, multi-attribute filtering, category browsing, and price sorting.
  - Interactive product detail pages with variant selectors (sizes, colors), high-res galleries, and real-time inventory checks.
  - Dedicated pages for **Hot Deals**, **New Arrivals**, and **Best Sellers**.
- **Cart & Wishlist:**
  - Seamless shopping cart supporting both authenticated shoppers and anonymous guest users.
  - Wishlist toggles with instant UI feedback.
- **Dark Mode Support:**
  - Persistent theme switching (Light / Dark / System default) without layout shift (FOUC).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router + Turbopack)
- **Language:** TypeScript 5
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State & Server Sync:** [TanStack Query v5](https://tanstack.com/query)
- **Localization:** [next-intl](https://next-intl-docs.vercel.app/)
- **Forms & Validation:** React Hook Form + Zod

---

## ⚙️ Environment Variables

Add these to your `.env` (or Vercel environment settings):

| Variable               | Description                          | Default / Example                                        |
| :--------------------- | :----------------------------------- | :------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Public URL of the NestJS Backend API | `http://localhost:3000` / `https://api.yourdomain.com`   |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the Next.js Storefront | `http://localhost:4000` / `https://store.yourdomain.com` |

---

## 📜 Development & Build Commands

Run from the root of the monorepo:

```bash
# Start frontend dev server on port 4000
pnpm dev:frontend

# Run TypeScript typegen and check
pnpm --filter frontend check-types

# Run ESLint (enforces zero warnings)
pnpm --filter frontend lint

# Create production build (generates static SSG pages & standalone output)
pnpm --filter frontend build

# Start production server locally
pnpm --filter frontend start
```

---

## 🚢 Production Deployment

### Option 1: Vercel (Recommended)

1. Import your repository into [Vercel](https://vercel.com/).
2. Select **Framework Preset**: `Next.js`.
3. In **Root Directory**, enter `apps/frontend`.
4. Configure **Build Settings**:
   - **Build Command**: `pnpm --filter @repo/shared build && pnpm --filter frontend build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://api.yourdomain.com` or `https://backend.railway.app`).
   - `NEXT_PUBLIC_SITE_URL`: Your Vercel frontend URL (e.g., `https://my-store.vercel.app`).

### Option 2: Docker Standalone Container

The frontend is pre-configured with Next.js `output: "standalone"` in `next.config.js`:

```bash
docker build \
  -t store-frontend \
  -f docker/frontend/Dockerfile.prod \
  --build-arg NEXT_PUBLIC_API_URL="https://api.yourdomain.com" \
  --build-arg NEXT_PUBLIC_SITE_URL="https://store.yourdomain.com" \
  .

docker run -d -p 4000:4000 store-frontend
```
