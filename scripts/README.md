# DevForge Scripts

This directory contains all automation scripts for the DevForge microservices platform, organized by category.

## 📁 Script Categories

### 🚀 [Development](./development/)
Scripts for setting up and running the development environment.

### 🔧 [Maintenance](./maintenance/)
Scripts for debugging, restarting services, and environment management.

### 🏭 [Production](./production/)
Scripts for building and deploying to production environments.

### 🧪 [Testing](./testing/)
Scripts for running tests and quality assurance.

## 🎯 Quick Start

For new developers:
```bash
./scripts/development/quick-start.sh
```

For daily development:
```bash
./scripts/development/start-docker.sh
```

For troubleshooting:
```bash
./scripts/maintenance/debug-cors.sh
```

## 📋 Script Index

| Category | Script | Purpose |
|----------|--------|---------|
| Development | `quick-start.sh` | Complete first-time setup |
| Development | `start-docker.sh` | Start with Docker (recommended) |
| Development | `start-simple-dev.sh` | Fast local development |
| Development | `start-development.sh` | Full local development |
| Maintenance | `debug-cors.sh` | Diagnose CORS issues |
| Maintenance | `dev-restart.sh` | Restart all services |
| Maintenance | `auth-service-restart.sh` | Restart auth service |
| Maintenance | `project-service-restart.sh` | Restart project service |
| Maintenance | `switch-env.sh` | Switch environments |
| Production | `build-production.sh` | Build for production |
| Production | `deploy.sh` | Deploy to production |
| Testing | `run-tests.sh` | Run all tests |

## 🔄 Common Workflows

### Daily Development
```bash
# Start everything
./scripts/development/start-docker.sh

# If issues arise
./scripts/maintenance/debug-cors.sh
./scripts/maintenance/dev-restart.sh
```

### Production Deployment
```bash
./scripts/production/build-production.sh
./scripts/production/deploy.sh
```

### Testing
```bash
./scripts/testing/run-tests.sh
```

## 📝 Notes

- All scripts are executable and include error handling
- Scripts use color-coded output for better readability
- Check individual category READMEs for detailed usage
- Scripts are designed to be idempotent (safe to run multiple times) 