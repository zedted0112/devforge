#!/bin/bash

echo "🧹 Cleaning up old containers..."
docker compose down

echo "🔄 Switching to Docker env..."
./switch-env.sh project docker

echo "�� Rebuilding and starting containers in background..."
docker compose up --build -d

echo "⏳ Waiting 6s for containers to settle..."
sleep 6

echo "🔐 Entering project-service container for migration..."
docker compose exec project-service sh -c "
  npx prisma migrate dev --name init && \
  echo '✅ DB Migrations Complete.'
"

echo "🎉 All services are up and database is synced!"
