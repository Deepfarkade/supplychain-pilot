# Backend Setup Guide - Production Ready

## Overview
This application is designed to work with your own backend API that handles authentication and MongoDB operations. The frontend will make HTTP requests to your backend endpoints.

## Required Backend Configuration

### Environment Variables Your Backend Needs:
```bash
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017  # Your MongoDB connection string
DATABASE_NAME=supplychain_ai           # Your database name  
COLLECTION_NAME=users                  # Your users collection name

# JWT Configuration (optional - can use your own auth system)
JWT_SECRET=your-super-secure-secret-key
JWT_EXPIRES_IN=24h

# API Configuration
PORT=8080                              # Your backend port
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

### MongoDB User Document Structure
Your users collection should have documents with this structure:
```javascript
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "password": "hashed_password",  // Should be hashed with bcrypt
  "name": "User Name",
  "role": "user",                 // or "admin"
  "isActive": true,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("..."),
  "lastLogin": ISODate("...")
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

## Backend Implementation Examples

### Node.js + Express + MongoDB Example:
```javascript
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db(process.env.DATABASE_NAME);
const users = db.collection(process.env.COLLECTION_NAME);

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user in MongoDB
    const user = await users.findOne({ email, isActive: true });
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Update last login
    await users.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );
    
    // Return success response
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, message: 'Authentication failed' });
  }
});

// Test connection endpoint
app.post('/api/auth/test-connection', async (req, res) => {
  try {
    await client.db().admin().ping();
    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    res.json({ success: false, message: 'Database connection failed' });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Backend server running on port ${process.env.PORT || 8080}`);
});
```

### Python + Flask + MongoDB Example:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import check_password_hash
import jwt
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.environ.get('MONGODB_URL'))
db = client[os.environ.get('DATABASE_NAME')]
users_collection = db[os.environ.get('COLLECTION_NAME')]

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Find user in MongoDB
        user = users_collection.find_one({'email': email, 'isActive': True})
        if not user:
            return jsonify({'success': False, 'message': 'Invalid credentials'})
        
        # Verify password
        if not check_password_hash(user['password'], password):
            return jsonify({'success': False, 'message': 'Invalid credentials'})
        
        # Generate JWT token
        token = jwt.encode({
            'id': str(user['_id']),
            'email': user['email'],
            'role': user.get('role', 'user'),
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, os.environ.get('JWT_SECRET'), algorithm='HS256')
        
        # Update last login
        users_collection.update_one(
            {'_id': user['_id']},
            {'$set': {'lastLogin': datetime.utcnow()}}
        )
        
        return jsonify({
            'success': True,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'role': user.get('role', 'user')
            },
            'token': token
        })
    except Exception as e:
        print(f'Login error: {e}')
        return jsonify({'success': False, 'message': 'Authentication failed'})

@app.route('/api/auth/test-connection', methods=['POST'])
def test_connection():
    try:
        client.admin.command('ping')
        return jsonify({'success': True, 'message': 'Database connection successful'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Database connection failed'})

if __name__ == '__main__':
    app.run(port=int(os.environ.get('PORT', 8080)))
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