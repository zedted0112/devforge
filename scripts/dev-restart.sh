#!/bin/bash

# Master Restart Script for DevForge
# Usage:
#   ./scripts/dev-restart.sh         → Safe restart (volumes preserved)
#   ./scripts/dev-restart.sh --fresh → Full reset (nukes all volumes)

set -e

if [[ "$1" == "--fresh" ]]; then
  echo "⚠️  Full NUKE MODE: Removing containers + volumes + orphans..."
  docker compose down --volumes --remove-orphans
else
  echo "♻️  Safe mode: Restarting without nuking volumes..."
  docker compose down --remove-orphans
fi

echo "🔨 Rebuilding services..."
docker compose build auth-service project-service

echo "🚀 Starting services..."
docker compose up -d postgres redis auth-service project-service

echo "📦 Running Prisma Migrations..."

echo "🔁 Auth Service:"
docker compose exec auth-service npx prisma migrate deploy

echo "🔁 Project Service:"
docker compose exec project-service npx prisma migrate deploy

echo "✅ All services restarted and migrations applied."