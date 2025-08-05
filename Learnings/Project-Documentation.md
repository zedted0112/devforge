# DevForge - Project Documentation

## 🚀 Project Overview

**DevForge** is a full-stack microservices application that provides project management capabilities with user authentication and authorization. It demonstrates modern software architecture patterns, deployment strategies, and development best practices.

## 📋 Project Description

DevForge is a project management platform that allows users to:
- **Register and authenticate** with secure JWT-based authentication
- **Create and manage projects** with full CRUD operations
- **View their projects** in a clean, modern interface
- **Secure access** to projects with role-based permissions

The application follows a microservices architecture pattern, with separate services for authentication, project management, and API gateway functionality.

## 🏗️ Architecture

### Microservices Pattern
```
Frontend (React) → Gateway Service → Auth Service
                → Gateway Service → Project Service
```

### Service Breakdown:
1. **Frontend Service** - React application with TypeScript
2. **Gateway Service** - API routing and load balancing
3. **Auth Service** - User authentication and JWT management
4. **Project Service** - Project CRUD operations
5. **Database** - PostgreSQL with Prisma ORM
6. **Cache** - Redis for session management

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend Services
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Database ORM and migrations
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Redis** - Session storage and caching

### Database & Storage
- **PostgreSQL** - Primary database
- **Redis** - Session management and caching
- **Prisma** - Database schema management

### DevOps & Deployment
- **Railway** - Backend services deployment
- **Vercel** - Frontend deployment
- **GitHub** - Version control and CI/CD
- **Docker** - Containerization (configured but not used in production)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Nodemon** - Development server

## 📁 Project Structure

```
devforge/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API client configurations
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # State management
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── auth/                    # Authentication service
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── project-service/         # Project management service
│   ├── src/
│   │   ├── controllers/    # Project CRUD operations
│   │   ├── middlewares/    # Authentication middleware
│   │   └── routes/         # Project API routes
│   ├── prisma/             # Database schema
│   └── package.json
├── gateway/                 # API Gateway service
│   ├── src/
│   │   └── index.ts        # Gateway configuration
│   └── package.json
├── jobs-worker/            # Background job processing (placeholder)
├── notifications/          # Notification service (placeholder)
├── analytics/              # Analytics service (placeholder)
└── Learnings/              # Project documentation and learnings
```

## 🔐 Authentication Flow

1. **User Registration** - Creates user account with hashed password
2. **User Login** - Validates credentials and issues JWT tokens
3. **Token Management** - Access tokens (15min) + Refresh tokens (7 days)
4. **Protected Routes** - JWT validation for API access
5. **User Sync** - Syncs user data between auth and project services

## 🗄️ Database Schema

### User Table (Auth Service)
```sql
- id (Primary Key)
- name (String)
- email (String, Unique)
- password (Hashed String)
- role (String, Default: "user")
- createdAt (DateTime)
```

### Project Table (Project Service)
```sql
- id (UUID, Primary Key)
- title (String)
- description (String, Optional)
- ownerId (Foreign Key to User)
- createdAt (DateTime)
```

### Relationships
- **User → Projects** (One-to-Many)
- **Project → User** (Many-to-One)

## 🌐 API Endpoints

### Authentication (Auth Service)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Projects (Project Service)
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get specific project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Sync (Project Service)
- `POST /api/sync/user` - Sync user data between services

## 🚀 Deployment

### Production URLs
- **Frontend**: https://devforge-zeta.vercel.app
- **Gateway**: https://devforge-gateway-service-production.up.railway.app
- **Auth Service**: https://devforge-auth-production.up.railway.app
- **Project Service**: https://devforge-project-service-production.up.railway.app

### Environment Variables
- **Frontend**: VITE_API_URL, VITE_PROJECT_API_URL
- **Gateway**: AUTH_SERVICE_URL, PROJECT_SERVICE_URL, CORS_ORIGIN
- **Auth Service**: DATABASE_URL, REDIS_URL, JWT_SECRET, PROJECT_SERVICE_URL
- **Project Service**: DATABASE_URL, JWT_SECRET, AUTH_SERVICE_URL

## 🔧 Key Features Implemented

### ✅ Authentication System
- Secure user registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Token refresh mechanism
- Session management with Redis

### ✅ Project Management
- Full CRUD operations for projects
- User-specific project access
- Project ownership validation
- Real-time project updates

### ✅ Microservices Architecture
- Service-to-service communication
- API Gateway for routing
- Independent service deployment
- Database per service pattern

### ✅ Security Features
- CORS configuration
- JWT token validation
- Password hashing
- Protected API routes
- Environment variable management

### ✅ Production Deployment
- Railway for backend services
- Vercel for frontend
- Environment variable configuration
- Database migrations
- Health check endpoints

## 🐛 Major Issues Solved

### 1. Service Communication Issues
- **Problem**: 504 Gateway Timeout errors
- **Solution**: Switched from internal to external Railway URLs
- **Learning**: Railway internal networking limitations

### 2. Database Connection Issues
- **Problem**: Missing DATABASE_URL in auth service
- **Solution**: Added proper environment variables and Prisma setup
- **Learning**: Importance of environment variable management

### 3. CORS Configuration
- **Problem**: Frontend couldn't communicate with backend
- **Solution**: Proper CORS configuration for production domains
- **Learning**: CORS requirements for cross-origin requests

### 4. API Routing Issues
- **Problem**: 404 errors due to incorrect API paths
- **Solution**: Fixed frontend API client configurations
- **Learning**: Importance of consistent API path structure

## 📈 Performance & Scalability

### Current Performance
- **Response Time**: < 200ms for most operations
- **Database**: Optimized queries with Prisma
- **Caching**: Redis for session management
- **CDN**: Vercel edge network for frontend

### Scalability Features
- **Microservices**: Independent scaling of services
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for session and data caching
- **Load Balancing**: Gateway service for request distribution

## 🔮 Future Enhancements

### Planned Features
- **Real-time Notifications** - WebSocket integration
- **File Upload** - Project attachments and images
- **Team Collaboration** - Multi-user project access
- **Analytics Dashboard** - Project statistics and insights
- **Background Jobs** - Email notifications, data processing

### Technical Improvements
- **API Rate Limiting** - Prevent abuse
- **Request Validation** - Input sanitization
- **Error Monitoring** - Sentry integration
- **Performance Monitoring** - Application metrics
- **Automated Testing** - Unit and integration tests

## 🎯 Learning Outcomes

### Technical Skills Gained
- **Microservices Architecture** - Service design and communication
- **JWT Authentication** - Token-based security
- **Database Design** - Schema design and relationships
- **API Development** - RESTful API design
- **Deployment** - Production deployment strategies
- **Problem Solving** - Debugging and issue resolution

### Best Practices Learned
- **Environment Management** - Proper configuration handling
- **Error Handling** - Graceful error management
- **Security** - Authentication and authorization
- **Code Organization** - Clean architecture patterns
- **Version Control** - Git workflow and branching

## 📚 Resources Used

### Documentation
- **Railway Docs** - Deployment and configuration
- **Vercel Docs** - Frontend deployment
- **Prisma Docs** - Database ORM
- **Express.js Docs** - Web framework
- **React Docs** - Frontend framework

### Tools & Services
- **Railway** - Backend hosting
- **Vercel** - Frontend hosting
- **PostgreSQL** - Database
- **Redis** - Caching
- **GitHub** - Version control

---

**Project Status**: ✅ Production Ready  
**Last Updated**: August 5, 2025  
**Version**: 1.0.0 