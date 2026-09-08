# Next Nest Store — Backend Progress Documentation

## 1. Project Overview

The project is a Turborepo monorepo containing:

- `apps/backend` — NestJS backend API
- `apps/frontend` — Next.js frontend
- `packages/database` — Prisma database package
- `packages/typescript-config` — shared TypeScript configurations
- `packages/eslint-config` — shared ESLint configurations
- `packages/ui` — shared React UI components

The backend uses:

- NestJS
- Prisma
- PostgreSQL
- JWT authentication
- Zod validation
- Swagger / OpenAPI
- Jest / E2E testing
- Turborepo + pnpm

---

# 2. Current Development Status

The current implementation is centered around the authentication system.

### Completed

- User registration
- User login
- Access JWT
- Refresh JWT
- Current authenticated user
- Refresh-token validation
- Logout
- Database sessions
- Session limits
- `ACTIVE` / `PENDING` / `REVOKED` session states
- Session listing
- Revoke one session
- Revoke all sessions
- Automatic activation of a pending session
- Password reset request
- Password reset
- Password reset token hashing and expiration
- Password reset invalidates all sessions
- Swagger documentation for the implemented authentication APIs
- Zod request validation
- Unit/E2E test infrastructure
- TypeScript validation
- Shared Prisma package exports

### Currently Being Refined

- Swagger consistency between old and newly added endpoints
- Session behavior for `PENDING` sessions
- Complete session E2E coverage
- Remaining user/account APIs
- Password change API
- Username update
- Email update and verification
- Final authentication hardening

---

# 3. Authentication APIs

The planned authentication API is:

| Method | Endpoint         | Status         |
| ------ | ---------------- | -------------- |
| POST   | `/auth/register` | ✅ Implemented |
| POST   | `/auth/login`    | ✅ Implemented |
| GET    | `/auth/me`       | ✅ Implemented |
| POST   | `/auth/refresh`  | ✅ Implemented |
| POST   | `/auth/logout`   | ✅ Implemented |

Additional authentication endpoints:

| Method | Endpoint                | Status         |
| ------ | ----------------------- | -------------- |
| POST   | `/auth/forgot-password` | ✅ Implemented |
| POST   | `/auth/reset-password`  | ✅ Implemented |

---

# 4. Registration

## Endpoint

```text
POST /auth/register
```

The registration flow:

1. Validate request using Zod.
2. Check whether the email already exists.
3. Check whether the username already exists.
4. Hash the password.
5. Create the user.
6. Create a database session.
7. Determine whether the session is `ACTIVE` or `PENDING`.
8. Generate authentication tokens.
9. Hash and store the refresh token.
10. Return the authenticated user, session information and tokens.

The response now includes session information in addition to the user and tokens.

---

# 5. Login

## Endpoint

```text
POST /auth/login
```

The login flow:

1. Validate credentials.
2. Find the user by email.
3. Verify the password.
4. Create a new session.
5. Determine the session status.
6. Generate authentication tokens.
7. Hash and store the refresh token.
8. Return the user, session and tokens.

Invalid credentials result in:

```text
401 Unauthorized
```

---

# 6. Current User

## Endpoint

```text
GET /auth/me
```

The endpoint is protected by the access-token authentication mechanism.

The authenticated JWT user is obtained through:

```ts
@CurrentUser()
```

The endpoint returns the current authenticated user information.

Swagger includes the access-token authentication requirement and unauthorized response.

---

# 7. Refresh Token

## Endpoint

```text
POST /auth/refresh
```

The refresh endpoint uses a dedicated:

```text
RefreshJwtGuard
```

The refresh flow validates:

- User existence
- Session existence
- Session ownership
- Session status
- Session revocation
- Session expiration
- Refresh-token hash existence
- Refresh-token validity

A session must now explicitly be:

```text
ACTIVE
```

Otherwise the refresh request is rejected.

This prevents a `PENDING` or `REVOKED` session from generating new authentication tokens.

---

# 8. Logout

## Endpoint

```text
POST /auth/logout
```

Logout revokes the current session.

The session receives:

```text
status = REVOKED
```

and:

```text
revokedAt = current time
```

The endpoint returns:

```text
204 No Content
```

---

# 9. Session Management

Sessions are stored in the database through Prisma.

The current session states are:

```text
ACTIVE
PENDING
REVOKED
```

## Meaning of each state

### ACTIVE

The session is currently allowed to authenticate.

An active session can:

- use the access token
- refresh authentication
- remain an active device/session

### PENDING

The session exists but is not currently active.

Pending sessions are used when the user reaches the maximum number of active sessions.

A pending session cannot refresh because `/auth/refresh` requires:

```text
status === ACTIVE
```

### REVOKED

The session has been invalidated and cannot be used anymore.

---

# 10. Maximum Active Sessions

The system uses:

```ts
MAX_SESSIONS;
```

When a user creates a new session:

```text
active sessions < MAX_SESSIONS
        ↓
     ACTIVE
```

Otherwise:

```text
active sessions >= MAX_SESSIONS
        ↓
     PENDING
```

This allows the system to keep additional login sessions without immediately deleting them.

---

# 11. Session Listing

## Endpoint

```text
GET /auth/sessions
```

The endpoint returns all sessions belonging to the authenticated user.

Sessions are mapped through:

```text
SessionMapper
```

The response uses:

```text
SessionSummaryDto
```

The mapper can also identify the current session.

---

# 12. Revoke One Session

## Endpoint

```text
DELETE /auth/sessions/:id
```

The service verifies:

1. The session exists.
2. The session belongs to the authenticated user.
3. The session is not already revoked.

If the session belongs to another user:

```text
403 Forbidden
```

If the session does not exist:

```text
404 Not Found
```

---

# 13. Pending Session Activation

When an `ACTIVE` session is revoked, the system attempts to activate the oldest pending session.

The operation is implemented through a Prisma transaction:

```text
revoke ACTIVE session
        ↓
find oldest PENDING session
        ↓
activate PENDING session
```

This is implemented in:

```text
SessionsRepository.revokeAndActivatePending()
```

Using a transaction prevents the two database operations from becoming inconsistent.

---

# 14. Revoke All Sessions

## Endpoint

```text
DELETE /auth/sessions
```

All sessions belonging to the authenticated user are revoked.

This is implemented using:

```text
revokeAllByUserId()
```

The operation changes every session to:

```text
REVOKED
```

and sets:

```text
revokedAt
```

---

# 15. Password Reset

Two password recovery endpoints are implemented.

## Request Reset

```text
POST /auth/forgot-password
```

The server:

1. Finds the user by email.
2. Generates a cryptographically random reset token.
3. Hashes the token.
4. Stores the hash.
5. Stores the expiration time.
6. Clears previous token usage state.

The raw token is not stored in the database.

During non-production environments, the token can be returned to facilitate testing.

---

# 16. Reset Password

## Endpoint

```text
POST /auth/reset-password
```

The reset token is:

1. Hashed.
2. Looked up in the database.
3. Checked for expiration.
4. Checked for previous use.
5. Used to identify the user.
6. Replaced by a newly hashed password.

After successful password reset:

```text
passwordResetTokenHash = null
passwordResetTokenExpiresAt = null
passwordResetTokenUsedAt = current time
```

Most importantly, the password reset also revokes all existing sessions.

Therefore:

```text
Password Reset
      ↓
All existing sessions
      ↓
REVOKED
```

This prevents previously authenticated devices from remaining logged in after a password compromise.

---

# 17. Session Architecture

The current architecture separates responsibilities between:

```text
AuthController
      ↓
AuthService
      ↓
SessionsService
      ↓
SessionsRepository
      ↓
PrismaService
      ↓
PostgreSQL
```

### AuthController

Responsible for:

- HTTP endpoints
- authentication decorators
- guards
- request/response handling
- Swagger metadata

### AuthService

Responsible for authentication business logic:

- register
- login
- refresh
- logout
- password reset
- session operations

### SessionsService

Acts as the session business/service layer.

It provides methods such as:

```text
create()
findById()
findByUserId()
findActiveByUserId()
findPendingByUserId()
countActiveByUserId()
activate()
revoke()
revokeAndActivatePending()
revokeAllByUserId()
updateRefreshTokenHash()
```

### SessionsRepository

Responsible for Prisma/database operations.

This keeps database access away from the authentication controller and most of the business logic.

---

# 18. Security Decisions

The current implementation includes several important security decisions.

### Passwords

Passwords are never stored directly.

They are hashed using:

```text
PasswordService
```

### Refresh Tokens

The raw refresh token is not stored.

The flow is:

```text
refresh token
      ↓
SHA-256
      ↓
password hashing
      ↓
database
```

During refresh, the supplied token goes through the same process and is compared against the stored hash.

### Password Reset Tokens

The reset token is also hashed before being stored.

The raw reset token exists only temporarily.

### Session Ownership

A user cannot revoke another user's session.

### Password Reset Session Invalidation

Changing the password through the reset mechanism revokes every existing session.

---

# 19. Validation

Authentication request bodies use Zod schemas.

Examples include:

```text
registerSchema
loginSchema
forgotPasswordSchema
resetPasswordSchema
```

Validation is integrated through:

```text
UseZodValidation
```

This keeps request validation separate from the service layer.

---

# 20. Swagger

Swagger documentation is being standardized across the API.

The project currently has a custom:

```text
Swagger()
```

decorator system.

Current endpoints use dedicated Swagger definitions such as:

```text
register.swagger.ts
login.swagger.ts
me.swagger.ts
```

The goal is to keep Swagger consistent instead of placing large amounts of Swagger metadata directly inside controllers.

Newer endpoints should follow the same convention.

Useful Swagger metadata includes:

```ts
@ApiOperation({
  summary: "..."
})
```

This was identified as an improvement that should be consistently applied to the existing endpoints as well.

---

# 21. Testing

The project has an E2E testing setup using Jest.

Authentication tests currently cover areas including:

```text
register
login
me
```

The project also has the general application E2E test suite.

The latest test output previously shared showed successful authentication E2E execution with:

```text
47 passed
2 skipped
49 total
```

A later project snapshot also reached:

```text
72 E2E tests
```

The exact count should be rerun after the latest session/password changes so the documentation reflects the current repository state.

---

# 22. Type Checking

The project currently passes the monorepo type-check pipeline.

Command:

```bash
pnpm check-types
```

The latest successful run showed:

```text
Tasks:    6 successful, 6 total
Cached:   5 cached, 6 total
```

The checked packages include:

```text
@repo/database
@repo/eslint-config
@repo/typescript-config
@repo/ui
backend
web
```

---

# 23. Database Package

The Prisma database package exports generated Prisma types and enums through:

```text
@repo/database
```

For example:

```ts
import { PrismaService, SessionStatus, type Session } from "@repo/database";
```

The generated Prisma client contains:

```text
SessionStatus.PENDING
SessionStatus.ACTIVE
SessionStatus.REVOKED
```

The database package was also fixed so these generated types can be consumed through the workspace package instead of using deep relative imports.

---

# 24. API Roadmap

The original planned API list is:

## Auth

```text
POST   /auth/register       ✅
POST   /auth/login          ✅
GET    /auth/me             ✅
POST   /auth/refresh        ✅
POST   /auth/logout         ✅
```

## Sessions

```text
GET    /auth/sessions       ✅
DELETE /auth/sessions/:id   ✅
DELETE /auth/sessions       ✅
```

## Users

```text
GET    /users/me            ⏳
PATCH  /users/me            ⏳
```

## Password

```text
PATCH  /users/me/password   ⏳
POST   /auth/forgot-password ✅
POST   /auth/reset-password  ✅
```

## Username

```text
PATCH  /users/me/username   ⏳
```

## Email

```text
PATCH  /users/me/email      ⏳
POST   /users/me/email/verify ⏳
```

---

# 25. What We Should Do Next

The recommended implementation order is:

## Phase 1 — Finish Sessions

Before moving to account-management APIs:

- [ ] Finalize `PENDING` session behavior.
- [ ] Add complete E2E tests for session limits.
- [ ] Test activation of the oldest pending session.
- [ ] Test revoking another user's session.
- [ ] Test revoking all sessions.
- [ ] Test refresh rejection for `PENDING`.
- [ ] Test refresh rejection for `REVOKED`.
- [ ] Test expired sessions.
- [ ] Review concurrent session creation / race conditions.

## Phase 2 — Password Change

Implement:

```text
PATCH /users/me/password
```

Expected behavior:

```text
Current password
      ↓
verify
      ↓
new password
      ↓
hash
      ↓
update database
      ↓
revoke all sessions
```

The decision already made is:

> Changing the password logs the user out of all devices.

This should be covered by E2E tests.

## Phase 3 — User Profile

Implement:

```text
GET /users/me
PATCH /users/me
```

This should handle the user's editable profile fields without mixing password/email/username-specific business rules into the generic user endpoint.

## Phase 4 — Username

Implement:

```text
PATCH /users/me/username
```

Requirements should include:

- authentication
- validation
- uniqueness
- database update
- Swagger
- E2E tests

## Phase 5 — Email

Implement:

```text
PATCH /users/me/email
POST /users/me/email/verify
```

This will require an email-verification token flow.

The email should not be considered verified merely because it was changed.

---

# 26. Important Remaining Technical Improvements

These are not necessarily blockers, but should be addressed before considering authentication production-ready.

### Session creation race condition

The current logic:

```ts
countActiveByUserId();
```

followed by:

```ts
create();
```

can theoretically allow two concurrent requests to both see an available slot.

This should eventually be protected through an appropriate transactional/database strategy.

### Pending session token behavior

The system currently creates a `PENDING` session when the maximum number of active sessions has been reached.

The exact client authentication behavior for a pending session should be finalized before calling the session system complete.

### Swagger consistency

All authentication endpoints should use a consistent documentation style.

Existing endpoints should receive:

```ts
@ApiOperation({
  summary: "...",
})
```

where appropriate, while keeping reusable Swagger definitions in the module's `swagger/` directory.

### Tests

Every new API should follow the existing pattern:

```text
implementation
    ↓
Swagger
    ↓
unit tests where useful
    ↓
E2E tests
    ↓
pnpm check-types
    ↓
pnpm test:e2e
```

---

# 27. Current Milestone

The project has moved beyond the initial authentication implementation.

The current milestone can be summarized as:

```text
                    AUTHENTICATION
                         │
          ┌──────────────┴──────────────┐
          │                             │
       JWT Auth                    Sessions
          │                             │
   ┌──────┼──────┐              ┌───────┼────────┐
   │      │      │              │       │        │
Register Login  Me           ACTIVE  PENDING  REVOKED
   │      │      │              │       │        │
   └──────┴──────┴──────────────┴───────┴────────┘
                         │
                  Password Reset
                         │
                 Revoke all sessions
```

The next major milestone is **Account Management**, starting with:

```text
PATCH /users/me/password
```

followed by:

```text
GET/PATCH /users/me
PATCH /users/me/username
PATCH /users/me/email
POST /users/me/email/verify
```

At that point, the backend will have a complete first version of the authentication and account-management subsystem.
