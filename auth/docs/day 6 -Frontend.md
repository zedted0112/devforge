# 🚀 DevForge Frontend – Auth Module MVP (React + Vite)

Welcome to the **DevForge Frontend** system. This README documents the initial setup and development progress for the authentication flow using **React**, **Vite**, **Tailwind CSS**, and **Zustand**.

---

## ✅ MVP Goals Achieved (Day 1 Report – Auth Module)

### 🔐 Auth Pages Implemented

- **Login Page** (`/login`)
  - Clean UI with form validation
  - Connected to backend `/api/auth/login`
  - Zustand state updated with `accessToken`, `refreshToken`, `userId`, `email`

- **Dashboard Page** (`/dashboard`)
  - Protected UI (redirect if not logged in)
  - Displays logged-in user's email
  - Logout button clears Zustand store and redirects to login

- **State Management**
  - Zustand store created with:
    - `accessToken`
    - `refreshToken`
    - `userId`
    - `email`
  - `setAuthData()` and `clearAuth()` methods

- **API Integration**
  - Axios-based client with base URL: `http://localhost:3001/api`
  - Login response mapped to state
  - TypeScript-safe `LoginResponse` type defined

---

## 📦 Tech Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev) | Fast React tooling |
| [React](https://reactjs.org) | UI Library |
| [Tailwind CSS v3](https://tailwindcss.com) | Utility-first styling |
| [Zustand](https://github.com/pmndrs/zustand) | Lightweight global state |
| [Axios](https://axios-http.com/) | HTTP client |
| TypeScript | Type safety & DX |

---

## 🌐 Backend Sync

Backend Repo: [DevForge Monorepo](https://github.com/zedted0112/devforge)

- ✅ Integrated with `/api/auth/login` endpoint
- ✅ Zustand synced with backend response
- ✅ `accessToken` and `refreshToken` stored in memory
- 🛠️ `/api/auth/signup` planned next

---

## 📁 Folder Structure (Simplified)
Frontend/
├── public/
├── src/
│   ├── api/            # Axios auth calls
│   ├── components/     # (reserved for shared UI)
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   ├── stores/
│   │   └── authStore.ts
│   └── App.tsx
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts


---

## 🧠 Notes

- `userId` is converted to string in Zustand for consistency
- Email is pulled from backend response as `data.user.email`
- Logout is handled entirely via frontend state (no backend logout yet)
- PR successfully merged to `master` from feature branch

---

## 🚧 Next Steps

- [ ] Signup Page UI + Integration
- [ ] Setup `ProtectedRoute` component
- [ ] Add loading and error fallback states
- [ ] Introduce role-based UI (future)
- [ ] Optional: landing page + hero section

---

## 👨‍💻 Maintainers

- **Frontend Engineer:** Zyra-UI-Alpha (AI Dev Strategist)
- **Commander & Architect:** [@NitinRana](https://github.com/zedted0112)

---

Built with ❤️ as part of the DevForge Fleet.  
*Frontend meets fire.* ⚔️