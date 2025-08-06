# Development Scripts

Scripts for setting up and running the DevForge development environment.

## 🚀 Scripts Overview

### `quick-start.sh` ⭐ **RECOMMENDED FOR FIRST TIME**
Complete setup script for new developers.

**What it does:**
- Checks system requirements (Docker, Node.js, npm)
- Sets up all environment files
- Installs dependencies for all services
- Starts everything with Docker
- Provides setup verification

**Usage:**
```bash
./scripts/development/quick-start.sh
```

**When to use:** First time setup, new team members, fresh environment

---

### `start-docker.sh` ⭐ **RECOMMENDED FOR DAILY DEVELOPMENT**
Start all services using Docker Compose (most reliable).

**What it does:**
- Starts all services via Docker Compose
- Waits for services to be ready
- Shows status and access URLs
- Handles service dependencies

**Usage:**
```bash
./scripts/development/start-docker.sh
```

**When to use:** Daily development, when you want everything isolated

**Access URLs:**
- Frontend: http://localhost:5173
- Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- Project Service: http://localhost:3002

---

### `start-simple-dev.sh` ⭐ **RECOMMENDED FOR FAST DEVELOPMENT**
Start services locally without Docker (faster startup).

**What it does:**
- Starts services directly with npm
- No Docker overhead
- Faster startup and hot reload
- Uses local PostgreSQL/Redis if available

**Usage:**
```bash
./scripts/development/start-simple-dev.sh
```

**When to use:** When you want fast local development, debugging

**Prerequisites:** PostgreSQL and Redis running locally (optional)

---

### `start-development.sh` ⚠️ **LEGACY - Use simple-dev instead**
Full local development setup (requires external services).

**What it does:**
- Starts services locally
- Requires external PostgreSQL and Redis
- Full development environment

**Usage:**
```bash
./scripts/development/start-development.sh
```

**When to use:** Only if you have external PostgreSQL/Redis running

**Prerequisites:** PostgreSQL and Redis must be running externally

## 🔄 Development Workflow

### For New Developers
```bash
# Complete setup
./scripts/development/quick-start.sh
```

### For Daily Development
```bash
# Start everything (recommended)
./scripts/development/start-docker.sh

# Or for faster development
./scripts/development/start-simple-dev.sh
```

### If Issues Arise
```bash
# Debug CORS issues
./scripts/maintenance/debug-cors.sh

# Restart services
./scripts/maintenance/dev-restart.sh
```

## 📋 Environment Requirements

### For Docker Development
- Docker Desktop
- Docker Compose
- 4GB+ RAM available

### For Local Development
- Node.js 18+
- npm
- PostgreSQL (optional)
- Redis (optional)

## 🎯 Tips

- **Docker is recommended** for consistency across team members
- **Simple-dev is fastest** for active development
- **Quick-start** handles all setup automatically
- All scripts include error handling and colored output
- Services are designed to be idempotent (safe to restart) 