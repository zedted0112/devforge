# DevForge

**© 2024 HimalayanCoder (Nitin Rana). All Rights Reserved.**

DevForge is a modern project management system built with microservices architecture.  
It features a React frontend, Node.js backend services, and comprehensive CI/CD pipeline for production deployment.

> **Legal Notice**: This software is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited. See [COPYRIGHT.md](./COPYRIGHT.md) for full terms.

---

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │    Gateway  │    │ Auth Service│
│   (React)   │◄──►│   (Express) │◄──►│   (Express) │
└─────────────┘    └─────────────┘    └─────────────┘
                           │                │
                           ▼                ▼
                    ┌─────────────┐    ┌─────────────┐
                    │Project Svc  │    │   Redis     │
                    │  (Express)  │    │  (Token)    │
                    └─────────────┘    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    │  (Prisma)   │
                    └─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Git

### Local Development
```bash
# Clone the repository
git clone <your-repo-url>
cd devforge

# Quick start (recommended)
./scripts/quick-start.sh

# Or manual setup
docker-compose up -d
```

### Services
- **Frontend**: http://localhost:5173
- **Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Project Service**: http://localhost:3002

---

## 🎯 Features

### ✅ Completed
- **Authentication System**: JWT with refresh tokens
- **User Management**: Signup, login, token refresh
- **Project Management**: CRUD operations with user ownership
- **Microservices**: Auth, Project, and Gateway services
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for token storage
- **Testing**: Jest + Supertest coverage
- **Docker**: Containerized development environment

### 🔄 In Progress
- **CI/CD Pipeline**: GitHub Actions with automated testing
- **Production Deployment**: Railway + Vercel setup
- **Security**: Rate limiting, CORS, security headers
- **Monitoring**: Health checks and logging

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React + TypeScript + Vite | Modern SPA with fast development |
| **Gateway** | Express + TypeScript | API routing and load balancing |
| **Auth Service** | Node.js + Express + Prisma | Authentication and user management |
| **Project Service** | Node.js + Express + Prisma | Project CRUD operations |
| **Database** | PostgreSQL | Primary data storage |
| **Cache** | Redis | Token storage and session management |
| **Testing** | Jest + Supertest | Unit and integration tests |
| **Containerization** | Docker + Docker Compose | Development and deployment |
| **CI/CD** | GitHub Actions | Automated testing and deployment |

---

## 🔧 Development

### Scripts
```bash
# Quick start
./scripts/quick-start.sh

# Run tests
./scripts/run-tests.sh

# Deploy to production
./scripts/deploy.sh

# Environment switching
./scripts/switch-env.sh auth local
./scripts/switch-env.sh project docker
```

### Testing
```bash
# Run all tests
npm run test

# Run specific service tests
cd auth && npm test
cd project-service && npm test
```

### Database
```bash
# Run migrations
cd auth && npx prisma migrate deploy
cd project-service && npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

---

## 🚀 Deployment

### Production Stack
- **Frontend**: Vercel (React hosting)
- **Backend**: Railway (Node.js microservices)
- **Database**: PlanetScale (PostgreSQL)
- **Cache**: Upstash (Redis)

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Security Scanning**: Trivy vulnerability scanner
- **Docker Registry**: GitHub Container Registry
- **Environment Management**: Staging and production

### Quick Deploy
```bash
# 1. Set up cloud accounts (Railway, Vercel, PlanetScale, Upstash)
# 2. Configure environment variables
# 3. Push to main branch (triggers deployment)
git push origin main
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 📊 Project Status

### ✅ Ready for Production
- [x] Microservices architecture
- [x] Authentication system
- [x] Database migrations
- [x] Docker containerization
- [x] Basic testing suite
- [x] Environment configuration
- [x] API Gateway
- [x] Security headers
- [x] Health checks

### 🔄 Next Steps
- [ ] Complete CI/CD pipeline setup
- [ ] Deploy to production platforms
- [ ] Add comprehensive monitoring
- [ ] Implement rate limiting
- [ ] Add API documentation
- [ ] Performance optimization

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation
- Use conventional commits

---

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [API Documentation](./docs/api.md) - API endpoints and usage
- [Architecture Guide](./docs/architecture.md) - System design details

---

## 🆘 Support

For issues and questions:
1. Check the [troubleshooting guide](./DEPLOYMENT.md#troubleshooting)
2. Review service logs
3. Open a GitHub issue

---

Built and maintained by **@HimalayanCoder (Nitin Rana)**  
Feel free to fork, star, or suggest improvements! 🚀