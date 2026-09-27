# @repo/shared

The `@repo/shared` package is a shared TypeScript library providing universal **Data Transfer Objects (DTOs)**, **Zod validation schemas**, **interfaces**, and **constants** used across both `apps/backend` (NestJS) and `apps/frontend` (Next.js).

---

## 📦 What's Inside

```
packages/shared/src/
├── constants/          # Shared constants (session, cart, shop, timeouts)
├── dtos/               # Data Transfer Objects for API requests/responses
│   ├── auth/           # Login, Register, Tokens, Reset Password
│   ├── e-commerce/     # Products, Categories, Cart, Wishlist
│   ├── sessions/       # User sessions and devices
│   └── users/          # Profile, avatar, password update
├── interfaces/         # Core TypeScript interfaces & contracts
├── schemas/            # Zod validation schemas
│   ├── auth/           # Authentication validation
│   ├── common/         # Password rules, pagination, UUIDs
│   └── e-commerce/     # Product creation, cart mutations
└── types/              # Utility types and Prisma payload helpers
```

---

## 🛠️ Usage

### In Backend (`apps/backend`):

```typescript
import { LoginDto, RegisterDto } from "@repo/shared/dtos/auth";
import { loginSchema } from "@repo/shared/schemas/auth";
import { ProductDto } from "@repo/shared/dtos/e-commerce";
```

### In Frontend (`apps/frontend`):

```typescript
import type { ProductDto, CategoryDto } from "@repo/shared/dtos/e-commerce";
import { passwordSchema } from "@repo/shared/schemas/common";
```

---

## 🏗️ Build & Type-checking

```bash
# Build TypeScript declarations
pnpm --filter @repo/shared build

# Check TypeScript types
pnpm --filter @repo/shared check-types
```
