#!/usr/bin/env bash
# exit on error
set -o errexit

pnpm install
pnpm run build
npx prisma generate

# Resolve any failed migrations by marking them as applied
npx prisma migrate resolve --applied 20260116095918_payment --schema=./prisma/schema 2>/dev/null || true

npx prisma migrate deploy --schema=./prisma/schema --skip-generate