#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not defined"
  exit 1
fi

npx prisma migrate deploy --config prisma.config.ts
exec node dist/main.js
