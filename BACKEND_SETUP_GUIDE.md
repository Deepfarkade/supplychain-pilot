# 🚀 Backend API Setup Guide

## Quick Setup: Where to Put Your Backend API URLs

### 1. **For Local Development (when your app runs on localhost:5679)**

**Option 1: Direct Configuration (Recommended)**
- Go to Settings → API Settings in your app
- Update "Backend API Base URL" to: `http://localhost:8080` (or whatever port your backend uses)

**Option 2: Code Configuration**
Edit `src/config/api.ts` line 141:
```typescript
return 'http://localhost:8080'; // Change to your backend port
```

### 2. **For Production**
Update the same field to your production API URL:
```
https://api.yourdomain.com
```

## 🔑 How Login Button Connects to Your Backend

When you click the Login button, this happens:

1. **Login Form** (`src/pages/Login.tsx`) calls `useAuth().login()`
2. **AuthContext** (`src/contexts/AuthContext.tsx`) calls `authService.authenticate()`  
3. **Auth Service** (`src/security/auth.ts`) makes HTTP POST to your backend:
   ```
   POST {baseUrl}/api/auth/login
   {
     "email": "user@example.com", 
     "password": "password123"
   }
   ```

## 📍 Your Backend API Endpoints Expected

Your backend should handle these endpoints:

```bash
POST /api/auth/login          # User authentication
POST /api/auth/logout         # User logout  
POST /api/auth/register       # User registration
GET  /api/users/profile       # Get user profile
PUT  /api/users/profile       # Update profile
GET  /api/notifications       # Get notifications
```

## 🔧 Expected Response Format

Your login endpoint should return:
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "email": "user@example.com", 
    "name": "John Doe",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

## 🛠️ Testing Your Setup

1. **Start your backend** on port 8080 (or any port)
2. **Update the API URL** in Settings → API Settings
3. **Try logging in** - check browser console for API calls
4. **Check Network tab** in DevTools to see actual HTTP requests

## ⚠️ Current Fallback System

The app has 3 authentication strategies (in order):
1. **Your Backend API** ← This is what you want  
2. **MongoDB** (if configured)
3. **Dummy credentials** (for testing): admin@supplychainai.com / admin123

## 🔐 Security Features Included

- ✅ Request encryption
- ✅ JWT token management  
- ✅ Session timeout handling
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ Request signing

## 🌍 Environment Auto-Detection

The app automatically detects:
- **localhost** → Uses local backend URL
- **yoursite.lovable.app** → Uses staging URL  
- **yourdomain.com** → Uses production URL

## 📝 Quick Start Checklist

- [ ] Start your backend API server
- [ ] Note the port (e.g., 8080, 5000, 3001)
- [ ] Go to Settings → API Settings in the app
- [ ] Update "Backend API Base URL" to `http://localhost:{YOUR_PORT}`
- [ ] Test login with your backend credentials
- [ ] Check browser console for successful API calls

## 🚨 Common Issues

**"API call failed"** → Check if your backend is running and the port is correct
**"CORS errors"** → Add CORS headers to your backend
**"404 Not Found"** → Verify your backend has the `/api/auth/login` endpoint

---
*Need help? Check the browser console (F12) for detailed API call logs.*