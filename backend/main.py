from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import logging
from typing import Optional

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="Supply Chain AI Authentication API",
    description="Production-ready authentication API with MongoDB integration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME") 
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRES_IN_HOURS = int(os.getenv("JWT_EXPIRES_IN_HOURS", "24"))

# MongoDB client
client = None
db = None
users_collection = None

# Security
security = HTTPBearer()

# Pydantic models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    user: Optional[dict] = None
    token: Optional[str] = None

class User(BaseModel):
    id: str
    email: str
    name: str
    role: str

class ConnectionTestResponse(BaseModel):
    success: bool
    message: str

# Database connection
def connect_to_mongodb():
    global client, db, users_collection
    try:
        client = MongoClient(MONGODB_URL)
        # Test the connection
        client.admin.command('ping')
        db = client[DATABASE_NAME]
        users_collection = db[COLLECTION_NAME]
        logger.info(f"✅ Connected to MongoDB: {DATABASE_NAME}.{COLLECTION_NAME}")
        return True
    except ConnectionFailure as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        return False

# Initialize database connection on startup
@app.on_event("startup")
async def startup_event():
    if not connect_to_mongodb():
        logger.error("Failed to connect to MongoDB on startup")

# JWT token functions
def create_jwt_token(user_data: dict) -> str:
    """Create JWT token for authenticated user"""
    payload = {
        "user_id": str(user_data["_id"]),
        "email": user_data["email"],
        "role": user_data["role"],
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRES_IN_HOURS),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = verify_jwt_token(token)
    return payload

# Authentication endpoints
@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate user with email and password"""
    try:
        logger.info(f"🔐 Login attempt for email: {request.email}")
        
        if not users_collection:
            logger.error("Database connection not available")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection error"
            )

        # Find user in MongoDB
        user = users_collection.find_one({
            "email": request.email,
            "is_active": True
        })

        if not user:
            logger.warning(f"User not found or inactive: {request.email}")
            return LoginResponse(
                success=False,
                message="Invalid email or password"
            )

        # Verify password
        if not bcrypt.checkpw(request.password.encode('utf-8'), user["password_hash"].encode('utf-8')):
            logger.warning(f"Invalid password for user: {request.email}")
            return LoginResponse(
                success=False,
                message="Invalid email or password"
            )

        # Update last login
        users_collection.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "last_login": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )

        # Create JWT token
        token = create_jwt_token(user)

        # Prepare user response
        user_response = {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        }

        logger.info(f"✅ Login successful for user: {request.email}")
        
        return LoginResponse(
            success=True,
            message="Login successful",
            user=user_response,
            token=token
        )

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed"
        )

@app.post("/api/auth/test-connection", response_model=ConnectionTestResponse)
async def test_connection():
    """Test database connection"""
    try:
        if not client:
            return ConnectionTestResponse(
                success=False,
                message="Database client not initialized"
            )
        
        # Ping database
        client.admin.command('ping')
        
        # Test collection access
        count = users_collection.count_documents({})
        
        logger.info("✅ Database connection test successful")
        return ConnectionTestResponse(
            success=True,
            message=f"Database connection successful. Found {count} users in collection."
        )
        
    except Exception as e:
        logger.error(f"Database connection test failed: {str(e)}")
        return ConnectionTestResponse(
            success=False,
            message=f"Database connection failed: {str(e)}"
        )

@app.get("/api/auth/verify-token")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify if current token is valid"""
    return {
        "success": True,
        "message": "Token is valid",
        "user": {
            "id": current_user["user_id"],
            "email": current_user["email"],
            "role": current_user["role"]
        }
    }

@app.get("/api/auth/refresh-token")
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Refresh JWT token"""
    try:
        # Get user from database to ensure they're still active
        user = users_collection.find_one({
            "_id": current_user["user_id"],
            "is_active": True
        })
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new token
        new_token = create_jwt_token(user)
        
        return {
            "success": True,
            "message": "Token refreshed successfully",
            "token": new_token
        }
        
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database_connected": client is not None
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Supply Chain AI Authentication API",
        "version": "1.0.0",
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=int(os.getenv("PORT", "8080")),
        reload=True
    )