#!/usr/bin/env bash
# exit on error
set -o errexit

pnpm install
pnpm run build
npx prisma generate

# Resolve any failed migrations by marking them as applied
npx prisma migrate resolve --applied 20260116095918_payment --schema=./prisma/schema 2>/dev/null || true
npx prisma migrate resolve --applied 20260118123515_payment --schema=./prisma/schema 2>/dev/null || true
npx prisma migrate resolve --applied 20260119110110_payment --schema=./prisma/schema 2>/dev/null || true
npx prisma migrate resolve --applied 20260119112804_init --schema=./prisma/schema 2>/dev/null || true
npx prisma migrate resolve --applied 20260222105547_added_image_url_field --schema=./prisma/schema 2>/dev/null || true

npx prisma migrate deploy --schema=./prisma/schema