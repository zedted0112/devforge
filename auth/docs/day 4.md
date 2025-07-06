# 🔐 DevForge - Day 4: JWT Middleware & Protected Route

## 🎯 Objective

Secure the Auth Microservice by verifying JWT access tokens and protecting internal API routes from unauthorized access.

---

## ✅ Features Implemented

1. **JWT Verification Middleware**
   - Validates access tokens using `jsonwebtoken`.
   - Attached decoded user payload to `req.user`.

2. **Protected Route (`/api/protected/secret`)**
   - Accessible only with a valid JWT.
   - Returns welcome message and user payload.

3. **Postman Tested:**
   - ✅ No token → `401 Unauthorized`
   - ✅ Invalid/Expired token → `403 Forbidden`
   - ✅ Valid token → `200 OK + user payload`

---

## 🗂️ File Structure

```txt
auth/
├── src/
│   ├── middlewares/
│   │   └── verifyToken.js     <-- NEW
│   ├── routes/
│   │   └── protected.js       <-- NEW
│   └── app.js                 <-- Route integrated