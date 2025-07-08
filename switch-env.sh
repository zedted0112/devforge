#!/bin/bash

SERVICE=$1
TARGET=$2

if [ "$SERVICE" != "auth" ] && [ "$SERVICE" != "project" ]; then
  echo "❌ Invalid service. Use 'auth' or 'project'"
  exit 1
fi

if [ "$TARGET" != "local" ] && [ "$TARGET" != "docker" ]; then
  echo "❌ Invalid target. Use 'local' or 'docker'"
  exit 1
fi

# 🔁 Folder mapping
if [ "$SERVICE" = "auth" ]; then
  FOLDER="auth"
else
  FOLDER="$SERVICE-service"
fi

cd "$FOLDER" || { echo "❌ Folder $FOLDER not found"; exit 1; }

cp ".env.$TARGET" .env || { echo "❌ .env.$TARGET not found in $FOLDER"; exit 1; }

echo "✅ Switched $SERVICE to .env.$TARGET"
