# Maintenance Scripts

Scripts for debugging, restarting services, and environment management.

## 🔧 Scripts Overview

### `debug-cors.sh` ⭐ **FOR CORS ISSUES**
Diagnose CORS and connectivity issues in the development environment.

**What it does:**
- Tests API endpoints and connectivity
- Checks Docker container status
- Shows container logs
- Tests CORS configuration
- Provides environment variable status

**Usage:**
```bash
./scripts/maintenance/debug-cors.sh
```

**When to use:** When experiencing CORS errors, API connectivity issues

**Output includes:**
- Container status and health
- API endpoint tests
- CORS preflight test results
- Service logs
- Environment configuration

---

### `fast-restart.sh` ⭐ **RECOMMENDED FOR PERFORMANCE**
Fast restart with optimized Docker builds and cache utilization.

**What it does:**
- Optimized Docker builds with cache
- Reduced build context size
- Faster npm install with flags
- Preserves data and volumes
- Runs database migrations

**Usage:**
```bash
./scripts/maintenance/fast-restart.sh
```

**When to use:** When you need fast restarts, after code changes

**Performance improvements:**
- 70-80% faster build times
- Optimized Docker layers
- Reduced context copying

---

### `dev-restart.sh` ⚠️ **LEGACY - Use fast-restart instead**
Restart all services safely with options for fresh start.

**What it does:**
- Safe restart (preserves data and volumes)
- Option for fresh restart (removes all data)
- Rebuilds services
- Runs database migrations
- Handles service dependencies

**Usage:**
```bash
# Safe restart (recommended)
./scripts/maintenance/dev-restart.sh

# Fresh restart (nukes everything)
./scripts/maintenance/dev-restart.sh --fresh
```

**When to use:** When services are misbehaving, after configuration changes

**Safe mode:** Preserves database data and volumes
**Fresh mode:** Removes all containers, volumes, and data

---

### `auth-service-restart.sh` 🔐 **AUTH SERVICE ONLY**
Restart only the authentication service and its dependencies.

**What it does:**
- Restarts auth-service container
- Restarts PostgreSQL and Redis (dependencies)
- Runs auth service migrations
- Preserves other services

**Usage:**
```bash
# Safe restart
./scripts/maintenance/auth-service-restart.sh

# Fresh restart
./scripts/maintenance/auth-service-restart.sh --fresh
```

**When to use:** When only auth service needs restarting

---

### `project-service-restart.sh` 📁 **PROJECT SERVICE ONLY**
Restart only the project service and its dependencies.

**What it does:**
- Restarts project-service container
- Restarts PostgreSQL (dependency)
- Runs project service migrations
- Preserves other services

**Usage:**
```bash
# Safe restart
./scripts/maintenance/project-service-restart.sh

# Fresh restart
./scripts/maintenance/project-service-restart.sh --fresh
```

**When to use:** When only project service needs restarting

---

### `fix-database.sh` 🗄️ **DATABASE RECOVERY**
Quickly fix missing tables and database issues.

**What it does:**
- Applies Prisma schema to both services
- Tests database connectivity
- Verifies API endpoints work
- Provides recovery status

**Usage:**
```bash
./scripts/maintenance/fix-database.sh
```

**When to use:** When tables are missing after restart, 500 errors on project creation

---

### `switch-env.sh` 🔄 **ENVIRONMENT SWITCHING**
Switch between local and Docker environment configurations.

**What it does:**
- Switches .env files for services
- Supports auth and project services
- Switches between local and Docker configs

**Usage:**
```bash
# Switch auth service to local environment
./scripts/maintenance/switch-env.sh auth local

# Switch auth service to Docker environment
./scripts/maintenance/switch-env.sh auth docker

# Switch project service to local environment
./scripts/maintenance/switch-env.sh project local

# Switch project service to Docker environment
./scripts/maintenance/switch-env.sh project docker
```

**When to use:** When switching between local and Docker development

## 🔄 Troubleshooting Workflow

### When You Have CORS Issues
```bash
# 1. Debug the issue
./scripts/maintenance/debug-cors.sh

# 2. If needed, restart services
./scripts/maintenance/dev-restart.sh
```

### When Services Are Misbehaving
```bash
# 1. Try safe restart first
./scripts/maintenance/dev-restart.sh

# 2. If that doesn't work, fresh restart
./scripts/maintenance/dev-restart.sh --fresh
```

### When Only One Service Has Issues
```bash
# For auth service issues
./scripts/maintenance/auth-service-restart.sh

# For project service issues
./scripts/maintenance/project-service-restart.sh
```

### When Switching Environments
```bash
# Switch to local development
./scripts/maintenance/switch-env.sh auth local
./scripts/maintenance/switch-env.sh project local

# Switch to Docker development
./scripts/maintenance/switch-env.sh auth docker
./scripts/maintenance/switch-env.sh project docker
```

## 📋 Common Issues & Solutions

### CORS Errors
- **Symptom:** Browser shows CORS policy errors
- **Solution:** Run `debug-cors.sh` to diagnose, then restart services

### Service Not Responding
- **Symptom:** API calls fail with connection errors
- **Solution:** Use `dev-restart.sh` to restart all services

### Database Migration Issues
- **Symptom:** Services fail to start due to database schema issues
- **Solution:** Use `dev-restart.sh --fresh` to reset everything

### Environment Configuration Issues
- **Symptom:** Services can't connect to each other
- **Solution:** Use `switch-env.sh` to ensure correct environment configs

## 🎯 Tips

- **Always try safe restart first** before using fresh restart
- **Use debug-cors.sh** to understand the root cause of issues
- **Check container logs** if services aren't starting properly
- **Fresh restart removes all data** - use with caution
- **Environment switching** is useful when working with different setups 