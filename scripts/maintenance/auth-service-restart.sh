#!/bin/bash

# Restart script for auth-service
# Usage:
#   ./scripts/auth-restart.sh         → Safe restart (DB & volumes preserved)
#   ./scripts/auth-restart.sh --fresh → Full reset (volumes nuked)

set -e

echo "🚀 Restarting auth-service..."

if [[ "$1" == "--fresh" ]]; then
  echo "⚠️  Nuking containers AND volumes for auth-service..."
  docker compose down --volumes --remove-orphans
else
  echo "♻️  Safe restart (preserving volumes)..."
  docker compose down --remove-orphans
fi

# Rebuild and restart only auth-service and dependencies
docker compose build auth-service
docker compose up -d postgres redis auth-service

# Apply migrations
echo "📦 Deploying Prisma migrations for auth-service..."
docker compose exec auth-service npx prisma migrate deploy

echo "✅ Auth-service restarted successfully."