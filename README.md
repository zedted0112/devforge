# DevForge 🛠️

DevForge is a developer-focused project management backend system, built from scratch using modern Node.js microservices.

This project was built as a real-world backend portfolio system to demonstrate my skills in authentication, inter-service communication, and database integrity using Prisma.

---

## 🧩 Microservices

| Service         | Description                              | Tech Stack                   |
|----------------|------------------------------------------|------------------------------|
| `auth-service` | Handles signup/login, JWT, Redis, tokens | Node.js, Express, Prisma, Redis |
| `project-service` | Manages project data linked to users     | Node.js, Express, Prisma, PostgreSQL |

---

## 🔐 Auth Flow

- JWT (access + refresh) issued at login
- Redis used to store/rotate refresh tokens
- Token is verified via middleware for protected routes
- Auth service syncs users to project-service via Axios

---

## ⚙️ How to Run Locally

```bash
# 1. Start Docker containers
docker-compose up --build

# 2. Auth service runs at:
http://localhost:3001

# 3. Project service runs at:
http://localhost:3002


Features
	•	JWT + Redis secure auth system
	•	Token verification middleware with route-based bypass logic
	•	Full project creation flow after login
	•	Sync new users across services
	•	Dockerized for isolation and clean dev setup

devforge/
│
├── auth/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middlewares/
│       └── utils/
│
├── project-service/
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       └── routes/
│
├── docker/
│   └── docker-compose.yml
├── README.md

🚀 Built By

Nitin Rana
Built from the ground up to learn & demonstrate real backend service architecture.