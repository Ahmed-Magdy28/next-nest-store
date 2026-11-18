#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi

# Load variables from .env without failing on quotes/comments
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

DB_USER="${POSTGRES_USER:-next_nest_store}"
DB_PASS="${POSTGRES_PASSWORD:-}"
DB_NAME="${POSTGRES_DB:-next_nest_store}"
DB_TEST_NAME="${POSTGRES_DB_TEST:-next_nest_store_test}"

if [ -z "$DB_PASS" ] && [ -n "${DATABASE_URL:-}" ]; then
  DB_PASS="$(printf '%s' "$DATABASE_URL" | sed -nE 's|^postgresql://[^:]+:([^@]+)@.*|\1|p')"
fi

if [ -z "$DB_PASS" ]; then
  echo "Error: POSTGRES_PASSWORD (or password in DATABASE_URL) is not set in .env"
  exit 1
fi

echo "Configuring local PostgreSQL role '$DB_USER' and databases '$DB_NAME', '$DB_TEST_NAME'..."

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
    EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L CREATEDB', '${DB_USER}', '${DB_PASS}');
  ELSE
    EXECUTE format('ALTER ROLE %I WITH LOGIN PASSWORD %L CREATEDB', '${DB_USER}', '${DB_PASS}');
  END IF;
END
\$\$;
SQL

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"
fi

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_TEST_NAME}'" | grep -q 1; then
  sudo -u postgres createdb -O "$DB_USER" "$DB_TEST_NAME"
fi

echo "Running Prisma generate and migrations..."
cd "$ROOT_DIR"
pnpm db:generate
pnpm --filter @repo/database migrate:deploy
pnpm db:migrate:test

echo "Local PostgreSQL setup complete!"
