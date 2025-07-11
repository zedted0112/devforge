#!/bin/bash

# Restart script for project-service
# Usage:
#   ./scripts/project-restart.sh         → Safe restart (DB & volumes preserved)
#   ./scripts/project-restart.sh --fresh → Full reset (volumes nuked)

set -e

echo "🚀 Restarting project-service..."

if [[ "$1" == "--fresh" ]]; then
  echo "⚠️  Nuking containers AND volumes for project-service..."
  docker compose down --volumes --remove-orphans
else
  echo "♻️  Safe restart (preserving volumes)..."
  docker compose down --remove-orphans
fi

# Rebuild and restart only project-service and dependencies
docker compose build project-service
docker compose up -d postgres project-service

# Apply migrations
echo "📦 Deploying Prisma migrations for project-service..."
docker compose exec project-service npx prisma migrate deploy

echo "✅ Project-service restarted successfully."