# Production Security Configuration
from fastapi import HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import bcrypt
import hashlib
import secrets
import time
from datetime import datetime, timedelta
from typing import Dict, Optional
import logging
import redis
import os

logger = logging.getLogger(__name__)

class SecurityManager:
    """Production security manager with rate limiting and token management"""
    
    def __init__(self):
        # Redis connection for rate limiting and token blacklist
        self.redis_client = None
        try:
            self.redis_client = redis.Redis(
                host=os.getenv("REDIS_HOST", "redis"),
                port=int(os.getenv("REDIS_PORT", "6379")),
                db=0,
                decode_responses=True
            )
            self.redis_client.ping()
            logger.info("✅ Connected to Redis for security features")
        except Exception as e:
            logger.warning(f"⚠️ Redis not available, using in-memory fallback: {e}")
            self.redis_client = None
        
        # In-memory fallback for rate limiting
        self.rate_limit_cache: Dict[str, list] = {}
        self.token_blacklist: set = set()
    
    def hash_password(self, password: str) -> str:
        """Hash password with bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def generate_secure_token(self) -> str:
        """Generate cryptographically secure token"""
        return secrets.token_urlsafe(32)
    
    def create_jwt_token(self, user_data: dict, expires_hours: int = 24) -> str:
        """Create JWT token with enhanced security"""
        now = datetime.utcnow()
        payload = {
            "user_id": str(user_data["_id"]),
            "email": user_data["email"],
            "role": user_data["role"],
            "iat": now,
            "exp": now + timedelta(hours=expires_hours),
            "jti": self.generate_secure_token(),  # JWT ID for token blacklisting
            "iss": "supply-chain-ai",  # Issuer
            "aud": "supply-chain-ai-frontend"  # Audience
        }
        
        return jwt.encode(
            payload,
            os.getenv("JWT_SECRET"),
            algorithm=os.getenv("JWT_ALGORITHM", "HS256")
        )
    
    def verify_jwt_token(self, token: str) -> dict:
        """Verify JWT token with blacklist check"""
        try:
            # Check if token is blacklisted
            if self.is_token_blacklisted(token):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has been revoked"
                )
            
            payload = jwt.decode(
                token,
                os.getenv("JWT_SECRET"),
                algorithms=[os.getenv("JWT_ALGORITHM", "HS256")],
                audience="supply-chain-ai-frontend",
                issuer="supply-chain-ai"
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.JWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token: {str(e)}"
            )
    
    def blacklist_token(self, token: str):
        """Add token to blacklist"""
        try:
            # Get token expiry to set TTL
            payload = jwt.decode(
                token,
                os.getenv("JWT_SECRET"),
                algorithms=[os.getenv("JWT_ALGORITHM", "HS256")],
                options={"verify_exp": False}
            )
            
            exp_timestamp = payload.get("exp", 0)
            current_timestamp = int(time.time())
            ttl = max(0, exp_timestamp - current_timestamp)
            
            if self.redis_client:
                self.redis_client.setex(f"blacklist:{token}", ttl, "1")
            else:
                self.token_blacklist.add(token)
                
            logger.info("Token blacklisted successfully")
            
        except Exception as e:
            logger.error(f"Failed to blacklist token: {e}")
    
    def is_token_blacklisted(self, token: str) -> bool:
        """Check if token is blacklisted"""
        try:
            if self.redis_client:
                return bool(self.redis_client.get(f"blacklist:{token}"))
            else:
                return token in self.token_blacklist
        except Exception:
            return False
    
    def check_rate_limit(self, identifier: str, limit: int, window_seconds: int) -> bool:
        """Check rate limiting with sliding window"""
        current_time = time.time()
        
        if self.redis_client:
            return self._check_rate_limit_redis(identifier, limit, window_seconds, current_time)
        else:
            return self._check_rate_limit_memory(identifier, limit, window_seconds, current_time)
    
    def _check_rate_limit_redis(self, identifier: str, limit: int, window_seconds: int, current_time: float) -> bool:
        """Redis-based rate limiting"""
        try:
            key = f"rate_limit:{identifier}"
            
            # Remove old entries
            self.redis_client.zremrangebyscore(key, 0, current_time - window_seconds)
            
            # Count current requests
            current_requests = self.redis_client.zcard(key)
            
            if current_requests >= limit:
                return False
            
            # Add current request
            self.redis_client.zadd(key, {str(current_time): current_time})
            self.redis_client.expire(key, window_seconds)
            
            return True
            
        except Exception as e:
            logger.error(f"Redis rate limiting error: {e}")
            return True  # Allow request on Redis error
    
    def _check_rate_limit_memory(self, identifier: str, limit: int, window_seconds: int, current_time: float) -> bool:
        """Memory-based rate limiting fallback"""
        if identifier not in self.rate_limit_cache:
            self.rate_limit_cache[identifier] = []
        
        # Remove old entries
        self.rate_limit_cache[identifier] = [
            timestamp for timestamp in self.rate_limit_cache[identifier]
            if current_time - timestamp < window_seconds
        ]
        
        # Check limit
        if len(self.rate_limit_cache[identifier]) >= limit:
            return False
        
        # Add current request
        self.rate_limit_cache[identifier].append(current_time)
        return True
    
    def get_client_ip(self, request: Request) -> str:
        """Get client IP address with proxy support"""
        # Check for forwarded headers (from load balancer/proxy)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"
    
    def log_security_event(self, event_type: str, details: dict):
        """Log security events for monitoring"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "details": details
        }
        
        # In production, send to security monitoring system
        logger.warning(f"SECURITY EVENT: {log_entry}")

# Singleton instance
security_manager = SecurityManager()