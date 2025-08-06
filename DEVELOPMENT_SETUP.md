# DevForge Development Setup Guide

## 🚀 Quick Start (Recommended)

### Option 1: One-Command Startup
```bash
# From the project root directory
./scripts/start-development.sh
```

This script will:
- ✅ Check if PostgreSQL and Redis are running
- ✅ Start all services with correct environment variables
- ✅ Wait for services to be ready
- ✅ Open your browser to the correct URLs

### Option 2: Manual Startup
If you prefer to start services individually:

```bash
# 1. Start Auth Service
cd auth
export NODE_ENV=development
export PORT=3001
export DATABASE_URL=postgresql://devforge_user:devforge_password@localhost:5432/devforge
export REDIS_URL=redis://localhost:6379
export JWT_SECRET=dev-jwt-secret-key
export REFRESH_TOKEN_SECRET=dev-refresh-secret-key
export CORS_ORIGIN=http://localhost:5173
export PROJECT_SERVICE_URL=http://localhost:3002
npm run dev

# 2. Start Project Service (in new terminal)
cd project-service
export NODE_ENV=development
export PORT=3002
export DATABASE_URL=postgresql://devforge_user:devforge_password@localhost:5432/devforge
export JWT_SECRET=dev-jwt-secret-key
export CORS_ORIGIN=http://localhost:5173
export AUTH_SERVICE_URL=http://localhost:3001
npm run dev

# 3. Start Gateway Service (in new terminal)
cd gateway
export NODE_ENV=development
export PORT=3000
export AUTH_SERVICE_URL=http://localhost:3001
export PROJECT_SERVICE_URL=http://localhost:3002
export FRONTEND_URL=http://localhost:5173
npm run dev

# 4. Start Frontend (in new terminal)
cd Frontend
export VITE_API_URL=http://localhost:3000
export VITE_PROJECT_API_URL=http://localhost:3002
export VITE_APP_NAME=DevForge
export VITE_APP_VERSION=1.0.0
export VITE_DEV_MODE=true
npm run dev
```

## 📋 Prerequisites

### Required Services:
1. **PostgreSQL** - Database
2. **Redis** - Session storage
3. **Node.js** - Runtime environment

### Database Setup:
```bash
# Create database and user
createdb devforge
psql -d devforge -c "CREATE USER devforge_user WITH PASSWORD 'devforge_password';"
psql -d devforge -c "GRANT ALL PRIVILEGES ON DATABASE devforge TO devforge_user;"

# Run migrations
cd auth && npx prisma migrate dev
cd ../project-service && npx prisma migrate dev
```

## 🌐 Service URLs

| Service | Development URL | Production URL |
|---------|----------------|----------------|
| **Frontend** | `http://localhost:5173` | `https://devforge-zeta.vercel.app` |
| **Gateway** | `http://localhost:3000` | `https://devforge-gateway-production.up.railway.app` |
| **Auth Service** | `http://localhost:3001` | `https://devforge-auth-production.up.railway.app` |
| **Project Service** | `http://localhost:3002` | `https://devforge-project-service-production.up.railway.app` |

## 🔧 Environment Configuration

### Development Environment Files:
- `Frontend/env.development` - Frontend local config
- `gateway/env.development` - Gateway local config
- `auth/env.example` - Auth service config template
- `project-service/env.example` - Project service config template

### Production Environment:
- Automatically uses Railway URLs
- Environment variables set in Railway dashboard
- No local configuration needed

## 🐛 Troubleshooting

### Common Issues:

#### 1. "500 Internal Server Error"
- **Cause**: Services using production URLs in development
- **Solution**: Use the development startup script or set `NODE_ENV=development`

#### 2. "Connection Refused"
- **Cause**: Services not running
- **Solution**: Start all services using the development script

#### 3. "Database Connection Failed"
- **Cause**: PostgreSQL not running or wrong credentials
- **Solution**: Start PostgreSQL and verify database setup

#### 4. "Redis Connection Failed"
- **Cause**: Redis not running
- **Solution**: Start Redis server

### Health Checks:
```bash
# Check if services are running
curl http://localhost:3000/health  # Gateway
curl http://localhost:3001/health  # Auth (if health endpoint exists)
curl http://localhost:3002/health  # Project (if health endpoint exists)
```

## 🚀 Production Deployment

For production deployment, the app automatically uses Railway URLs:

```bash
# Build for production
./scripts/build-production.sh

# Deploy to Railway/Vercel
# (Uses production environment variables automatically)
```

## 📝 Notes

- **Development**: Uses local URLs (`localhost`)
- **Production**: Uses Railway URLs automatically
- **Environment Detection**: Based on `NODE_ENV` variable
- **CORS**: Automatically configured for both environments
- **Database**: Uses local PostgreSQL in development, Railway PostgreSQL in production 