# 🛰️ Project Service – Auth Integration Complete

## ✅ Overview

This service enables **authenticated users** to create and manage projects.  
Today, we successfully integrated `project-service` with `auth-service`, connected PostgreSQL using Prisma ORM, and ensured inter-service communication via frontend-driven auth tokens.

---

## 🔧 Key Features Implemented

- ✅ JWT-based authentication handled via frontend
- ✅ User ID extracted from token → attached as `ownerId` in project
- ✅ Prisma schema updated with foreign key relationship
- ✅ Migrations created and deployed
- ✅ Docker volumes ensured persistence
- ✅ Postman + curl tested with access tokens
- ✅ Internal PrismaClient logging for error tracebacks
- ✅ Project creation now verifies user exists in DB

---

## 🗃️ Database Models

### User
Managed by: `auth-service`  
Table: `User`

### Project
Managed by: `project-service`

```prisma
model Project {
  id          String   @id @default(uuid())
  title       String
  description String?
  ownerId     Int      @relation(fields: [ownerId], references: [id])
  createdAt   DateTime @default(now())
}