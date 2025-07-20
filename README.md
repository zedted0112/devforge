# Branch: feat/gateway

This branch is dedicated to the development of the API Gateway for DevForge. The gateway will serve as a single entry point for all frontend and external requests, handling routing, authentication, and service discovery for the modular microservices (auth, project-service, and future services).

---

# DevForge

DevForge is a backend project management system built with Node.js microservices.  
It was developed as a real-world portfolio project to practice scalable architecture, JWT auth, inter-service sync, and DB integrity using Prisma and Docker.

---

## Microservices

| Service           | Description                                    | Tech Stack                             |
|------------------|------------------------------------------------|----------------------------------------|
| `auth-service`    | Handles signup/login, JWT, Redis, tokens       | Node.js, Express, Prisma, Redis        |
| `project-service` | Manages project data linked to users           | Node.js, Express, Prisma, PostgreSQL   |

---

## Authentication Flow

- JWT (access + refresh) issued on login
- Redis used to store/rotate refresh tokens
- Token is verified using middleware before accessing protected routes
- Auth service syncs new users to project-service using Axios and JWT
- Project-service validates and stores synced users

---

## Architecture Notes

- Dockerized services with internal communication
- Environment switching via `.env` scripts
- Prisma used for schema management and DB migrations
- Log-driven debugging to trace every step from login to sync

---

## Status: Phase 1 Complete

- ✅ Auth system working end-to-end
- ✅ User sync between services working
- ✅ Scoped project creation working via protected routes

---

## Scripts Included

- `scripts/dev-restart.sh` — Restart all services
- `scripts/auth-service-restart.sh` — Restart only auth
- `scripts/switch-env.sh` — Environment toggler

---

Built and maintained by **@HimalayanCoder (Nitin Rana)**  
Feel free to fork, star, or suggest improvements.