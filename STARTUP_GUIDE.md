# 🚀 DevForge Startup Guide

## ⚠️ **IMPORTANT: Data Persistence**

### **Why Tables Disappear After Full Restart**

When you use `--fresh` restart or remove volumes, Docker deletes:
- Database data (PostgreSQL)
- Cache data (Redis)
- All application data

**This is NORMAL behavior** - it's like reinstalling your computer.

### **When to Use Different Restart Types**

| Restart Type | Command | What it does | When to use |
|--------------|---------|--------------|-------------|
| **Safe Restart** | `docker-compose up -d` | Preserves all data | Daily development |
| **Service Restart** | `docker-compose restart` | Preserves all data | After code changes |
| **Fresh Restart** | `./scripts/maintenance/dev-restart.sh --fresh` | **DELETES ALL DATA** | Only when debugging |
| **Fast Restart** | `./scripts/maintenance/fast-restart.sh` | Preserves data, optimized build | After Dockerfile changes |

## 🎯 **Proper Startup Sequence**

### **1. First Time Setup (New Environment)**
```bash
# Complete setup with fresh database
./scripts/development/quick-start.sh
```

### **2. Daily Development (Preserves Data)**
```bash
# Start everything (recommended for daily use)
./scripts/development/start-docker.sh

# Or if already running, just restart services
docker-compose restart
```

### **3. After Code Changes (Preserves Data)**
```bash
# If you changed code but not Dockerfiles
docker-compose restart

# If you changed Dockerfiles
./scripts/maintenance/fast-restart.sh
```

### **4. Emergency Reset (DELETES DATA)**
```bash
# Only use when you have serious issues
./scripts/maintenance/dev-restart.sh --fresh
```

## 📋 **Pre-Launch Checklist**

### **Before Starting Development**
- [ ] **Check Docker is running**
- [ ] **Verify no conflicting services** (local PostgreSQL/Redis)
- [ ] **Ensure you have the latest code**
- [ ] **Check environment variables**

### **After Starting Services**
- [ ] **Verify all containers are healthy**
- [ ] **Check database schema is applied**
- [ ] **Test API endpoints**
- [ ] **Verify CORS is working**

## 🔧 **Database Management**

### **Check Database Status**
```bash
# Check if tables exist
docker-compose exec project-service npx prisma db push --dry-run

# View database schema
docker-compose exec project-service npx prisma db pull
```

### **Reset Database (if needed)**
```bash
# Apply schema without losing data
docker-compose exec project-service npx prisma db push

# Reset database (WARNING: loses data)
docker-compose exec project-service npx prisma migrate reset
```

### **Backup Database**
```bash
# Create backup
docker-compose exec postgres pg_dump -U devforge_user devforge > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U devforge_user devforge < backup.sql
```

## 🚨 **Common Issues & Solutions**

### **Issue: Tables Missing After Restart**
**Cause**: Database volume was removed
**Solution**: 
```bash
# Apply schema
docker-compose exec project-service npx prisma db push
docker-compose exec auth-service npx prisma db push
```

### **Issue: Services Won't Start**
**Cause**: Port conflicts or Docker issues
**Solution**:
```bash
# Check what's using the ports
lsof -i :3000,3001,3002,5173,5432,6379

# Stop conflicting services
docker-compose down
```

### **Issue: CORS Errors**
**Cause**: Environment variables not set
**Solution**:
```bash
# Debug CORS
./scripts/maintenance/debug-cors.sh

# Restart with proper config
docker-compose restart
```

## 📊 **Service Health Monitoring**

### **Quick Health Check**
```bash
# All services at once
curl -s http://localhost:3000/health && echo "Gateway OK"
curl -s http://localhost:3001/ping && echo "Auth OK"
curl -s http://localhost:3002/health && echo "Project OK"
curl -s http://localhost:5173/health && echo "Frontend OK"
```

### **Detailed Health Check**
```bash
# Run comprehensive health check
./scripts/maintenance/debug-cors.sh
```

## 🔄 **Development Workflow**

### **Daily Workflow**
```bash
# 1. Start services (preserves data)
./scripts/development/start-docker.sh

# 2. Develop your features
# ... your development work ...

# 3. Test your changes
./scripts/testing/run-tests.sh

# 4. Stop services (optional)
docker-compose down
```

### **When Making Changes**
```bash
# Code changes only
docker-compose restart

# Dockerfile changes
./scripts/maintenance/fast-restart.sh

# Major issues (nukes everything)
./scripts/maintenance/dev-restart.sh --fresh
```

## 💾 **Data Persistence Best Practices**

### **Development Data**
- **Keep development data** for realistic testing
- **Use safe restarts** for daily development
- **Only use fresh restarts** when debugging serious issues

### **Production Data**
- **Never use fresh restarts** in production
- **Always backup** before major changes
- **Use proper migrations** for schema changes

### **Backup Strategy**
```bash
# Daily backup (optional)
docker-compose exec postgres pg_dump -U devforge_user devforge > daily_backup_$(date +%Y%m%d).sql

# Before major changes
docker-compose exec postgres pg_dump -U devforge_user devforge > pre_change_backup.sql
```

## 🎯 **Quick Reference**

### **Most Common Commands**
```bash
# Start development (preserves data)
./scripts/development/start-docker.sh

# Restart after code changes
docker-compose restart

# Restart after Dockerfile changes
./scripts/maintenance/fast-restart.sh

# Debug issues
./scripts/maintenance/debug-cors.sh

# Emergency reset (DELETES DATA)
./scripts/maintenance/dev-restart.sh --fresh
```

### **Access URLs**
- **Frontend**: http://localhost:5173
- **Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Project Service**: http://localhost:3002

## ⚡ **Pro Tips**

1. **Always use safe restarts** for daily development
2. **Keep a backup** before major changes
3. **Use the debug script** when things go wrong
4. **Check service health** after restarts
5. **Only use fresh restarts** when absolutely necessary

Remember: **Fresh restarts delete everything** - use them sparingly! 🚀 