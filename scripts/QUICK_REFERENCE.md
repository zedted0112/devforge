# 🚀 DevForge Scripts - Quick Reference

## 🎯 Most Common Commands

### First Time Setup
```bash
./scripts/development/quick-start.sh
```

### Daily Development
```bash
./scripts/development/start-docker.sh
```

### Fast Local Development
```bash
./scripts/development/start-simple-dev.sh
```

### Troubleshooting
```bash
./scripts/maintenance/debug-cors.sh
./scripts/maintenance/dev-restart.sh
```

### Production
```bash
./scripts/production/build-production.sh
./scripts/production/deploy.sh
```

### Testing
```bash
./scripts/testing/run-tests.sh
```

## 📁 Script Categories

| Category | Path | Purpose |
|----------|------|---------|
| **Development** | `./scripts/development/` | Setup and run dev environment |
| **Maintenance** | `./scripts/maintenance/` | Debug and restart services |
| **Production** | `./scripts/production/` | Build and deploy |
| **Testing** | `./scripts/testing/` | Run tests |

## 🔄 Common Workflows

### New Developer Setup
```bash
./scripts/development/quick-start.sh
```

### Daily Workflow
```bash
# Start development
./scripts/development/start-docker.sh

# If issues arise
./scripts/maintenance/debug-cors.sh
./scripts/maintenance/dev-restart.sh
```

### Before Committing
```bash
./scripts/testing/run-tests.sh
```

### Production Deployment
```bash
./scripts/production/build-production.sh
./scripts/production/deploy.sh
```

## 🚨 Emergency Commands

### Service Issues
```bash
# Restart all services
./scripts/maintenance/dev-restart.sh

# Restart specific service
./scripts/maintenance/auth-service-restart.sh
./scripts/maintenance/project-service-restart.sh
```

### CORS Issues
```bash
./scripts/maintenance/debug-cors.sh
```

### Environment Switch
```bash
./scripts/maintenance/switch-env.sh auth local
./scripts/maintenance/switch-env.sh project docker
```

## 📋 Access URLs (After Starting)

- **Frontend**: http://localhost:5173
- **Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Project Service**: http://localhost:3002

## 💡 Pro Tips

- **Docker is most reliable** for team consistency
- **Simple-dev is fastest** for active development
- **Always debug before restarting** services
- **Test before committing** to avoid issues
- **Use fresh restart sparingly** (removes all data) 