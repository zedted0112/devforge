# 🚀 DevForge Deployment Guide

This guide covers deploying DevForge to production environments using modern cloud platforms.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ installed
- Git repository with proper access
- Cloud platform accounts (Railway, Vercel, PlanetScale, Upstash)

## 🏗️ Architecture Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │    Gateway  │    │ Auth Service│
│   (Vercel)  │◄──►│   (Railway) │◄──►│   (Railway) │
└─────────────┘    └─────────────┘    └─────────────┘
                           │                │
                           ▼                ▼
                    ┌─────────────┐    ┌─────────────┐
                    │Project Svc  │    │   Redis     │
                    │  (Railway)  │    │  (Upstash)  │
                    └─────────────┘    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    │(PlanetScale)│
                    └─────────────┘
```

## 🎯 Recommended Deployment Stack

### **Frontend**: Vercel
- **Why**: Perfect for React/Vite applications
- **Features**: Automatic deployments, CDN, SSL
- **Cost**: Free tier available

### **Backend Services**: Railway
- **Why**: Excellent for Node.js microservices
- **Features**: Auto-scaling, environment variables, monitoring
- **Cost**: Pay-as-you-go

### **Database**: PlanetScale
- **Why**: Managed PostgreSQL with branching
- **Features**: Automatic backups, scaling, migrations
- **Cost**: Free tier available

### **Redis**: Upstash
- **Why**: Serverless Redis for token storage
- **Features**: Pay-per-request, global distribution
- **Cost**: Free tier available

## 🔧 Environment Setup

### 1. Database Setup (PlanetScale)

1. Create a PlanetScale account
2. Create a new database
3. Get connection string
4. Run migrations:

```bash
# Auth service migrations
cd auth
npx prisma db push
npx prisma generate

# Project service migrations
cd ../project-service
npx prisma db push
npx prisma generate
```

### 2. Redis Setup (Upstash)

1. Create Upstash account
2. Create Redis database
3. Get connection URL

### 3. Environment Variables

Create `.env` files for each service:

#### Auth Service (`.env`)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your-planetscale-connection-string
REDIS_URL=your-upstash-redis-url
JWT_SECRET=your-super-secret-jwt-key
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

#### Project Service (`.env`)
```env
NODE_ENV=production
PORT=3002
DATABASE_URL=your-planetscale-connection-string
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

#### Gateway (`.env`)
```env
NODE_ENV=production
PORT=3000
DOCKER=true
```

#### Frontend (`.env.production`)
```env
VITE_API_URL=https://your-gateway-domain.railway.app
VITE_APP_NAME=DevForge
VITE_APP_VERSION=1.0.0
```

## 🚀 Deployment Steps

### Step 1: Deploy Backend Services (Railway)

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Deploy Auth Service**:
```bash
cd auth
railway init
railway up
```

4. **Deploy Project Service**:
```bash
cd ../project-service
railway init
railway up
```

5. **Deploy Gateway**:
```bash
cd ../gateway
railway init
railway up
```

### Step 2: Deploy Frontend (Vercel)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy Frontend**:
```bash
cd Frontend
vercel --prod
```

### Step 3: Configure Domains

1. **Set up custom domains** in Railway and Vercel
2. **Update CORS settings** with production domains
3. **Update frontend API URL** to point to gateway

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:

1. **Runs tests** on every push/PR
2. **Security scans** with Trivy
3. **Builds Docker images** on main branch
4. **Deploys to staging** from develop branch
5. **Deploys to production** from main branch

### Setup CI/CD:

1. **Add secrets** to GitHub repository:
   - `RAILWAY_TOKEN`
   - `VERCEL_TOKEN`
   - `PLANETSCALE_TOKEN`

2. **Configure environments** in GitHub:
   - `staging`
   - `production`

## 🧪 Testing Deployment

### Health Checks

```bash
# Check all services
curl https://your-gateway-domain.railway.app/ping
curl https://your-auth-domain.railway.app/ping
curl https://your-project-domain.railway.app/health
```

### API Testing

```bash
# Test authentication
curl -X POST https://your-gateway-domain.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🔒 Security Checklist

- [ ] **Environment variables** are properly set
- [ ] **JWT secrets** are strong and unique
- [ ] **CORS** is configured for production domains
- [ ] **HTTPS** is enabled on all services
- [ ] **Database** has proper access controls
- [ ] **Redis** is secured with authentication
- [ ] **Dependencies** are up to date
- [ ] **Security headers** are configured

## 📊 Monitoring & Logs

### Railway Monitoring
- View logs: `railway logs`
- Monitor performance in Railway dashboard
- Set up alerts for errors

### Vercel Analytics
- Enable Vercel Analytics for frontend
- Monitor Core Web Vitals
- Track user interactions

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check PlanetScale connection string
   - Verify database exists and is accessible
   - Run migrations manually if needed

2. **Redis Connection Errors**
   - Verify Upstash Redis URL
   - Check network connectivity
   - Ensure Redis database is active

3. **CORS Errors**
   - Update CORS_ORIGIN with correct frontend domain
   - Check if frontend is making requests to correct API URL

4. **JWT Token Issues**
   - Ensure JWT_SECRET is the same across all services
   - Check token expiration settings
   - Verify token refresh flow

### Debug Commands

```bash
# Check service logs
railway logs --service auth-service
railway logs --service project-service
railway logs --service gateway

# Check database connection
railway run --service auth-service npx prisma db push

# Test Redis connection
railway run --service auth-service node -e "
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
client.connect().then(() => console.log('Redis connected')).catch(console.error);
"
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Railway automatically scales based on traffic
- Consider using multiple instances for high availability
- Use load balancers for traffic distribution

### Database Scaling
- PlanetScale handles database scaling automatically
- Consider read replicas for heavy read workloads
- Monitor query performance and optimize

### Caching Strategy
- Implement Redis caching for frequently accessed data
- Use CDN for static assets
- Consider edge caching for global performance

## 💰 Cost Optimization

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Railway**: $5 credit/month
- **PlanetScale**: 1 billion row reads/month
- **Upstash**: 10,000 requests/day

### Optimization Tips
- Use efficient database queries
- Implement proper caching
- Monitor resource usage
- Set up billing alerts

## 🆘 Support

For deployment issues:
1. Check service logs
2. Verify environment variables
3. Test locally with Docker
4. Review CI/CD pipeline logs
5. Contact platform support if needed

---

**Happy Deploying! 🚀** 