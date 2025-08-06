# Production Scripts

Scripts for building and deploying DevForge to production environments.

## 🏭 Scripts Overview

### `build-production.sh` ⭐ **BUILD FOR PRODUCTION**
Build all services for production deployment.

**What it does:**
- Sets NODE_ENV to production
- Builds frontend with production optimizations
- Installs production dependencies for all services
- Validates build artifacts
- Prepares for deployment

**Usage:**
```bash
./scripts/production/build-production.sh
```

**When to use:** Before deployment, CI/CD pipelines

**Build process:**
1. Frontend build (optimized for production)
2. Auth service dependencies
3. Project service dependencies
4. Gateway service dependencies
5. Build validation

---

### `deploy.sh` ⭐ **DEPLOY TO PRODUCTION**
Deploy the built application to production environment.

**What it does:**
- Validates environment variables
- Runs database migrations
- Builds Docker images
- Deploys services with production config
- Performs health checks
- Validates deployment

**Usage:**
```bash
./scripts/production/deploy.sh
```

**When to use:** Production deployment, after successful build

**Prerequisites:**
- Production environment variables set
- Database connection available
- Docker environment ready

**Required Environment Variables:**
- `DATABASE_URL` - Production database connection
- `REDIS_URL` - Production Redis connection
- `JWT_SECRET` - JWT signing secret
- `REFRESH_TOKEN_SECRET` - Refresh token secret
- `NODE_ENV` - Set to 'production'

## 🔄 Production Workflow

### Complete Production Deployment
```bash
# 1. Build for production
./scripts/production/build-production.sh

# 2. Deploy to production
./scripts/production/deploy.sh
```

### CI/CD Pipeline Integration
```bash
# In your CI/CD pipeline
./scripts/production/build-production.sh
./scripts/production/deploy.sh
```

### Manual Production Deployment
```bash
# Set production environment
export NODE_ENV=production
export DATABASE_URL="your-production-db-url"
export REDIS_URL="your-production-redis-url"
export JWT_SECRET="your-jwt-secret"
export REFRESH_TOKEN_SECRET="your-refresh-secret"

# Deploy
./scripts/production/deploy.sh
```

## 📋 Production Checklist

### Before Deployment
- [ ] All tests pass (`./scripts/testing/run-tests.sh`)
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Production database accessible
- [ ] Docker images built successfully

### During Deployment
- [ ] Build completes without errors
- [ ] Migrations run successfully
- [ ] Services start properly
- [ ] Health checks pass
- [ ] All endpoints respond

### After Deployment
- [ ] Verify application functionality
- [ ] Check monitoring and logs
- [ ] Validate security headers
- [ ] Test authentication flow
- [ ] Confirm data persistence

## 🔒 Production Security

### Environment Variables
Ensure these are properly set in production:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
JWT_SECRET=your-super-secure-jwt-secret
REFRESH_TOKEN_SECRET=your-super-secure-refresh-secret
```

### Security Considerations
- Use strong, unique secrets for JWT tokens
- Enable HTTPS in production
- Configure proper CORS origins
- Set up monitoring and logging
- Regular security updates

## 🚨 Troubleshooting Production

### Build Failures
```bash
# Check build logs
docker-compose build --no-cache

# Verify dependencies
npm ci --only=production
```

### Deployment Failures
```bash
# Check service logs
docker-compose logs -f

# Verify environment variables
echo $DATABASE_URL
echo $REDIS_URL
```

### Health Check Failures
```bash
# Test individual services
curl http://your-domain/health
curl http://your-domain/api/auth/health
curl http://your-domain/api/projects/health
```

## 📊 Monitoring Production

### Health Endpoints
- `/health` - Overall application health
- `/api/auth/health` - Auth service health
- `/api/projects/health` - Project service health

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service
docker-compose logs -f project-service
docker-compose logs -f gateway
```

## 🎯 Best Practices

- **Always test builds locally** before production
- **Use environment-specific configurations**
- **Monitor deployment logs** for issues
- **Set up automated health checks**
- **Keep secrets secure** and rotate regularly
- **Document deployment procedures**
- **Have rollback procedures** ready 