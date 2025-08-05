# DevForge Production Deployment Guide

## 🚀 Production Build Checklist

### 1. Environment Variables
Set these environment variables in your production environment:

**Frontend (.env.production):**
```env
VITE_API_URL=https://devforge-gateway-production.up.railway.app
VITE_PROJECT_API_URL=https://devforge-project-service-production.up.railway.app
VITE_APP_NAME=DevForge
VITE_APP_VERSION=1.0.0
```

**Backend Services:**
```env
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret
REFRESH_TOKEN_SECRET=your-secure-refresh-secret
DATABASE_URL=your-production-database-url
REDIS_URL=your-production-redis-url
```

### 2. Build Process
Run the production build script:
```bash
./scripts/build-production.sh
```

### 3. Code Optimizations Applied

#### Frontend Optimizations:
- ✅ Console logs commented out for production
- ✅ Lazy loading implemented for all routes
- ✅ Code splitting with manual chunks
- ✅ Terser minification enabled
- ✅ Source maps disabled for production
- ✅ Production-safe logging utility created

#### Backend Optimizations:
- ✅ Console logs commented out (can be uncommented for debugging)
- ✅ Error handling maintained for production
- ✅ Environment-specific configurations

### 4. Performance Improvements

#### Bundle Optimization:
- Vendor chunks separated (React, React-DOM)
- Router chunks separated (React Router)
- UI library chunks separated (Framer Motion)
- Utility chunks separated (Axios, Zustand)

#### Loading Performance:
- Lazy loading for all major components
- Suspense boundaries with loading spinners
- Code splitting reduces initial bundle size

### 5. Security Considerations

#### Frontend:
- Environment variables prefixed with VITE_
- No sensitive data in client-side code
- HTTPS enforced in production

#### Backend:
- JWT secrets properly configured
- CORS configured for production domains
- Input validation middleware active
- Rate limiting recommended

### 6. Monitoring & Debugging

#### Logging Strategy:
- Development: Full console logging
- Production: Errors only, debug logs commented
- Can uncomment specific logs for troubleshooting

#### Error Tracking:
- Frontend errors logged to console.error
- Backend errors logged with proper context
- Consider adding error tracking service (Sentry, etc.)

### 7. Deployment Commands

#### Railway Deployment:
```bash
# Deploy to Railway
railway up

# Set production environment
railway variables set NODE_ENV=production
```

#### Vercel Deployment:
```bash
# Deploy frontend to Vercel
vercel --prod

# Set environment variables
vercel env add VITE_API_URL
vercel env add VITE_PROJECT_API_URL
```

### 8. Post-Deployment Checklist

- [ ] All services running on production URLs
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificates active
- [ ] CORS settings updated for production domains
- [ ] Error monitoring configured
- [ ] Performance monitoring active
- [ ] Backup strategy in place

### 9. Rollback Plan

If issues occur:
1. Revert to previous deployment
2. Check environment variables
3. Verify database connectivity
4. Review error logs
5. Test critical user flows

### 10. Performance Monitoring

Monitor these metrics:
- Page load times
- API response times
- Bundle sizes
- Error rates
- User engagement metrics

---

## 🎯 Quick Deploy Commands

```bash
# Full production build
./scripts/build-production.sh

# Deploy to Railway
railway up

# Deploy frontend to Vercel
cd Frontend && vercel --prod
```

Your DevForge application is now optimized for production deployment! 🚀 