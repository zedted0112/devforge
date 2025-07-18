Branch: frontend-ui/dashboard

Summary of Changes:
	1.	Landing Page (Landing.tsx)
	•	Updated the “Launch” button logic.
	•	Now intelligently checks:
	•	If the user is logged in, redirect to Dashboard.
	•	If not logged in, redirect to Login.
	•	If login fails due to invalid user, offer Signup (future patch planned to make this optional).
	2.	Login Page (Login.tsx)
	•	Improved login handling with better error messages.
	•	Synced Zustand store correctly after successful login.
	•	Ensures proper redirection to Dashboard post-login.
	3.	Axios Client (axiosClient.ts)
	•	Updated the API base URL setup using .env (supports Docker or localhost).
	•	Cleaner configuration for future scalability.
	4.	.gitignore
	•	Added common entries:
	•	node_modules/, *.log, .DS_Store, IDE config folders like .vscode/ and .idea/
	5.	Project Tree File (devforge_tree.txt)
	•	Regenerated to reflect the latest folder structure across frontend and backend.
himalayancoder@Nitins-MacBook-Air devforge % tre
e -L 4 -I "node_modules|.git|dist|build"
.
├── analytics
│   ├── Dockerfile
│   ├── README.md
│   └── src
├── auth
│   ├── Dockerfile
│   ├── docs
│   │   ├── day 10.nd
│   │   ├── day 3.md
│   │   ├── day 4.md
│   │   ├── day 5.md
│   │   ├── day 6 -Frontend.md
│   │   └── day 6.md
│   ├── package-lock.json
│   ├── package.json
│   ├── prisma
│   │   ├── client.js
│   │   └── schema.prisma
│   ├── README.md
│   └── src
│       ├── app.js
│       ├── config
│       │   └── db.js
│       ├── controllers
│       │   ├── authControllers.js
│       │   └── userControllers.js
│       ├── generated
│       │   └── prisma
│       ├── middlewares
│       │   ├── validateAuthInput.js
│       │   └── verifyToken.js
│       ├── routes
│       │   ├── authRoutes.js
│       │   ├── protected.js
│       │   └── userRoutes.js
│       └── utils
│           └── tokenUtils.js
├── devforge_tree.txt
├── docker
│   └── init
│       └── init.sql
├── docker-compose.yml
├── Frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   └── vite.svg
│   ├── README.md
│   ├── src
│   │   ├── api
│   │   │   ├── auth.ts
│   │   │   └── axiosClient.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   └── PrivateRoute.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── stores
│   │   │   └── authStore.ts
│   │   └── vite-env.d.ts
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── gateway
│   ├── Dockerfile
│   ├── README.md
│   └── src
├── jobs-worker
│   ├── Dockerfile
│   ├── README.md
│   └── src
├── notifications
│   ├── Dockerfile
│   ├── README.md
│   └── src
├── package-lock.json
├── package.json
├── project-service
│   ├── app.js
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   ├── prisma
│   │   ├── client.js
│   │   ├── migrations
│   │   │   ├── 20250707142155_init
│   │   │   ├── 20250707153930_add_user_and_project_relation
│   │   │   └── migration_lock.toml
│   │   └── schema.prisma
│   └── src
│       ├── controllers
│       │   ├── projectController.js
│       │   └── userController.js
│       ├── middlewares
│       │   └── authMiddleware.js
│       └── routes
│           ├── projectRoutes.js
│           ├── syncRoutes.js
│           └── userRoutes.js
├── README.md
└── scripts
    ├── auth-service-restart.sh
    ├── dev-restart.sh
    ├── project-service-restart.sh
    └── switch-env.sh

⸻

This patch improves the overall auth flow, prepares for real backend testing, and cleans up the environment setup.
Ready for pull request or more feature patches.

⸻
