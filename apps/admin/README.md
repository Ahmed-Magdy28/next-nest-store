# 🏪 Next Nest Store — Admin Dashboard

A modern, high-performance, bilingual (Arabic & English with full RTL support) administrative dashboard for the **Next Nest Store** e-commerce platform. Built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **TanStack Query**.

---

## 🌟 Key Features

### 🌐 Internationalization & Localization (i18n & RTL)
- **Bilingual by Design**: Full English and Arabic translations for every dashboard module.
- **Seamless RTL Layout**: Native Right-to-Left styling with Tailwind logical properties (`start`, `end`, `ms`, `pe`, `rtl:rotate-180`).
- **Dynamic Default Locale**: Reads `DEFAULT_LOCALE` directly from `.env` with localized routing (`/en` and `/ar`).

### 📊 Dashboard & Metrics
- Real-time KPI summary cards:
  - 📦 Total Orders & fulfillment tracking
  - 🏷️ Total Products & inventory status
  - ⭐ Pending Customer Reviews awaiting approval
  - 🎟️ Active Coupons & marketing campaigns

### 🛍️ Products Catalog Management
- **Catalog Management**: View paginated products list with SKU, category, price, discount price, and real-time inventory count.
- **Bilingual Content**: Support for English and Arabic product names and rich descriptions.
- **Category & Subcategory Linking**: Multi-tier category selection linking products to both parent categories and nested subcategories.
- **Variant Management**: Configure product variants (Colors, Sizes, Materials) with specific SKUs, prices, stock quantities, and attributes.
- **Image Gallery**: Multi-image gallery manager with primary thumbnail selection and image preview.

### 🗂️ Categories & Hierarchy
- Interactive category tree and nested subcategories list.
- Add, update, and organize parent-child category relationships with bilingual metadata.
- Subcategory counters and quick navigation to associated products.

### 📦 Order Fulfillment & Tracking
- View customer orders with order numbers, order date, customer details, and shipping snapshots.
- Update order lifecycle statuses (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `RETURNED`, `REFUNDED`).
- Update payment statuses (`UNPAID`, `PAID`, `FAILED`).
- Detailed line-item breakdown with product thumbnails, quantities, unit prices, and applied coupons.

### 🎟️ Promotional Coupons
- Create and manage discount codes (Percentage or Fixed amount).
- Set start/end dates, minimum purchase amounts, maximum discount caps, and usage limits.

### ⭐ Reviews Moderation
- Review customer ratings and feedback before publication.
- Moderate with one-click **Approve** or **Reject** actions.

### 🔐 Authentication & Access Control
- Secured with administrative credentials and mandatory **Admin Secret Key** verification.
- Persistent session management with JWT tokens and automatic refresh handling.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) |
| **Internationalization** | [next-intl](https://next-intl-docs.vercel.app/) |
| **Icons & Notifications** | [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) (Light, Dark & System mode) |
| **Monorepo Tooling** | [Turborepo](https://turbo.build/), [pnpm](https://pnpm.io/) |

---

## ⚙️ Environment Variables

The admin application loads configurations from the monorepo root `.env` file:

```env
# ─────────────────────────────────────────────────────────────
#  Admin Configuration
# ─────────────────────────────────────────────────────────────
ADMIN_PORT="4005"
ADMIN_SITE_TITLE="Admin Dashboard"
ADMIN_SECRET="your-super-secret-admin-key-here-min-16-chars"

# ─────────────────────────────────────────────────────────────
#  General & Backend API
# ─────────────────────────────────────────────────────────────
DEFAULT_LOCALE="en"
NEXT_PUBLIC_API_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:4000,http://localhost:4005,http://localhost:3000"
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `ADMIN_PORT` | Port for the Admin dashboard development server | `4005` |
| `ADMIN_SITE_TITLE` | Application title rendered in browser tab, header & sidebar | `"Admin Dashboard"` |
| `ADMIN_SECRET` | Secret key required for admin login authentication | — |
| `DEFAULT_LOCALE` | Default fallback locale (`en` or `ar`) | `"en"` |
| `NEXT_PUBLIC_API_URL` | NestJS backend REST API base URL | `"http://localhost:3000"` |

---

## 🚀 Getting Started

From the root of the repository:

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start the Development Server
```bash
# Run only the admin dashboard (port 4005)
pnpm --filter admin dev

# Or run through the workspace launcher:
pnpm dev
```

Open [http://localhost:4005](http://localhost:4005) in your browser.

### 3. Production Build
```bash
# Build the admin application
pnpm --filter admin build

# Run type check
pnpm --filter admin check-types
```

---

## 📂 Project Structure

```text
apps/admin/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/
│   │   │   └── login/          # Administrative login page
│   │   ├── (dashboard)/
│   │   │   ├── categories/     # Categories & Subcategories hierarchy
│   │   │   ├── coupons/        # Discount coupons management
│   │   │   ├── orders/         # Orders & fulfillment tracking
│   │   │   ├── products/       # Products, variants & inventory
│   │   │   ├── reviews/        # Customer reviews moderation
│   │   │   └── page.tsx        # KPI Overview dashboard
│   │   └── layout.tsx          # Root locale layout (theme, providers, metadata)
│   └── globals.css             # Tailwind base styles
├── components/
│   ├── categories/             # Category tables, modals & tree components
│   ├── common/                 # Pagination, badges, buttons, form controls
│   ├── coupons/                # Coupon tables & creation modals
│   ├── dashboard/              # KPI summary cards
│   ├── products/               # Product tables, form modals, variant editors
│   ├── providers/              # Auth, Query & Theme providers
│   ├── reviews/                # Review moderation table
│   ├── header.tsx              # Top navigation bar with branding & profile
│   └── sidebar.tsx             # Responsive sidebar & mobile drawer
├── hooks/                      # Custom hooks for products, orders, categories
├── lib/
│   └── api/                    # Typed API client services (Products, Orders, Auth...)
├── messages/
│   ├── en.json                 # English translations dictionary
│   └── ar.json                 # Arabic translations dictionary
├── i18n/
│   ├── request.ts              # next-intl server request configuration
│   └── routing.ts              # Localized routing & pathnames definition
├── proxy.ts                    # Edge proxy & internationalization matcher
└── next.config.ts              # Next.js configuration & environment exposure
```

---

## 📱 Mobile Responsiveness

The admin dashboard is fully responsive across mobile, tablet, and desktop viewports:
- **Slide-Over Drawer**: Mobile sidebar navigation with smooth transitions.
- **Scrollable & Stackable Tables**: Card views and horizontal scrolling for data tables on compact screens.
- **Adaptive Dialogs**: Full-screen or bottom-sheet modals on smaller screens for product creation and variant adjustments.

---

## 📄 License

This project is part of the **Next Nest Store** workspace. All rights reserved.
