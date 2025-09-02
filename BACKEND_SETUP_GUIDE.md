# Backend Setup Guide - Production Ready FastAPI

## Overview
This application includes a complete FastAPI backend with MongoDB authentication integration. The backend is designed to be production-ready and scalable.

## Quick Setup

### Step 1: Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure Environment
Edit `backend/.env` with your MongoDB credentials:
```bash
# MongoDB Configuration  
MONGODB_URL=mongodb://your-mongodb-url
DATABASE_NAME=n8n_Test
COLLECTION_NAME=n8n_Users

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
JWT_EXPIRES_IN_HOURS=24

# Server Configuration
PORT=8080
```

### Required Backend Endpoints:

#### 1. Authentication Endpoint
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "userpassword"
}

Success Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com", 
    "name": "User Name",
    "role": "user"
  },
  "token": "jwt_token_here"
}

Error Response:
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### 2. Connection Test Endpoint (Optional)
```
POST /api/auth/test-connection
Content-Type: application/json

Success Response:
{
  "success": true,
  "message": "Database connection successful"
}
```

### Step 3: Run Backend Server
```bash
cd backend
python main.py
```

### MongoDB User Document Structure
Your users collection must have documents with this EXACT structure:
```json
{
  "_id": {
    "$oid": "68b06d75163d62bd3c511f13"
  },
  "email": "test@in.ey.com",
  "password_hash": "$2b$12$Savk7wnEY1XWvdI3Uuh1juwnbyiavk/hXjmqCEeNn6exr5KySoH5i",
  "name": "Deep Farkade",
  "role": "admin",
  "is_active": true,
  "created_at": {
    "$date": "2025-08-28T14:53:41.860Z"
  },
  "updated_at": {
    "$date": "2025-08-28T14:53:41.860Z"
  },
  "last_login": {
    "$date": "2025-08-28T17:13:50.091Z"
  }
}
```

## Frontend Configuration

### Step 1: Configure API Settings
1. Run your backend on `http://localhost:8080` (or your preferred port)
2. Open the frontend application
3. Go to **Settings → API Settings**
4. Set **Backend API Base URL** to: `http://localhost:8080`
5. Click **Save Configuration**
6. Click **Test Connection** to verify

### Step 2: Configure Database Settings (Optional)
If you want to display database configuration in the UI:
1. Go to **Settings → Database Configuration** 
2. Enter your **Database Name** (e.g., `supplychain_ai`)
3. Enter your **Collection Name** (e.g., `users`)
4. Click **Save Configuration**

## FastAPI Backend Features

### Production-Ready Features:
- **FastAPI Framework**: High-performance async API
- **MongoDB Integration**: Direct connection to your MongoDB instance
- **JWT Authentication**: Secure token-based authentication
- **CORS Support**: Configured for frontend integration
- **Environment Configuration**: Secure .env file management
- **Error Handling**: Comprehensive error handling and logging
- **Health Checks**: Built-in health monitoring endpoints
- **Token Refresh**: Automatic token refresh capability
- **Production Ready**: Configured for deployment

### API Endpoints Available:

#### Authentication
- `POST /api/auth/login` - User login with email/password
- `POST /api/auth/test-connection` - Test MongoDB connection
- `GET /api/auth/verify-token` - Verify JWT token validity
- `GET /api/auth/refresh-token` - Refresh expired tokens

#### System
- `GET /health` - Health check endpoint
- `GET /` - API information endpoint

### Password Hashing
The backend expects passwords to be hashed with bcrypt. Example Python script to hash passwords:

```python
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# Example usage
password_hash = hash_password("your_password")
print(password_hash)  # Use this in MongoDB
```

## Security Best Practices

1. **Always hash passwords** using bcrypt or similar
2. **Use HTTPS** in production
3. **Validate all inputs** on the backend
4. **Implement rate limiting** for login attempts
5. **Use strong JWT secrets** (at least 256 bits)
6. **Set proper CORS policies**
7. **Implement proper error handling**

## Testing Your Setup

1. Start your backend server
2. Configure the frontend API settings
3. Try logging in with your MongoDB user credentials
4. Check the browser network tab to see API calls
5. Check your backend logs for debugging

## Troubleshooting

- **CORS errors**: Ensure your backend has proper CORS configuration
- **Connection refused**: Check if your backend is running on the correct port
- **MongoDB connection**: Verify your MongoDB_URL and that MongoDB is running
- **Authentication fails**: Check password hashing and user collection structure
- **Token issues**: Verify JWT secret and token expiration settings

The frontend is now fully configured to work with your production backend!