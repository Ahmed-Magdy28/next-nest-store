# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm workspace managed with Turborepo. Application code lives in `apps/`: `apps/frontend` is a Next.js app named `web`, and `apps/backend` is a NestJS API. Shared packages live in `packages/`: `packages/ui` contains reusable React components, `packages/database` contains Prisma schema, migrations, and Nest database utilities, while `packages/eslint-config` and `packages/typescript-config` provide shared tooling. Backend tests are under `apps/backend/test`; frontend assets and fonts are under `apps/frontend/public` and `apps/frontend/app/fonts`.

## Build, Test, and Development Commands

Use pnpm with Node `>=22`.

- `pnpm dev`: runs all app dev servers through Turbo.
- `pnpm dev:frontend`: runs Next.js on port `4000`.
- `pnpm dev:backend`: runs the Nest API in watch mode.
- `pnpm build`: builds all workspace packages and apps.
- `pnpm lint`: runs workspace ESLint tasks.
- `pnpm check-types`: runs TypeScript checks across the repo.
- `pnpm test:unit`: runs backend unit tests.
- `pnpm test:e2e`: runs backend e2e tests with `DATABASE_TEST_URL`.
- `pnpm db:generate` / `pnpm db:migrate`: generate Prisma client and run local migrations.

## Coding Style & Naming Conventions

Write TypeScript throughout the repo. Follow existing ESLint flat configs from `@repo/eslint-config` and format with Prettier via `pnpm format`. Keep React components in PascalCase, exported helpers and variables in camelCase, and Nest files aligned with framework conventions such as `*.module.ts`, `*.service.ts`, `*.controller.ts`, and `*.spec.ts`.

## Testing Guidelines

The backend uses Jest with `ts-jest`. Unit tests are configured in `apps/backend/test/jest-unit.json`, e2e tests in `apps/backend/test/jest-e2e.json`, and source-level specs match `*.spec.ts`. Put shared test utilities in `apps/backend/test/helpers` or `apps/backend/test/utils`. Run `pnpm test:unit` before API changes and `pnpm test:e2e` when database, auth, or request behavior changes.

## Commit & Pull Request Guidelines

Recent history uses short imperative commits, often Conventional Commit style such as `feat(auth): ...` or `feat(database): ...`. Prefer scoped messages when the change has a clear area. Pull requests should include a concise summary, test commands run, linked issues when applicable, and screenshots for visible frontend changes.

## Security & Configuration Tips

Do not commit secrets. Local database and test database URLs are loaded from the root `.env`; e2e and unit test scripts set `NODE_ENV=test` and use `DATABASE_TEST_URL`. Keep Prisma schema changes in `packages/database/prisma/schema.prisma` and commit generated migrations under `packages/database/prisma/migrations`.
