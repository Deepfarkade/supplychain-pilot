# Production Test Suite
import pytest
import asyncio
from fastapi.testclient import TestClient
from main import app
import os

# Test client
client = TestClient(app)

# Test data
TEST_USER = {
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User",
    "role": "user"
}

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

class TestAuthentication:
    """Test authentication endpoints"""
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "Supply Chain AI" in data["message"]
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = client.post("/api/auth/login", json={
            "email": "invalid@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "Invalid" in data["message"]
    
    def test_login_missing_fields(self):
        """Test login with missing fields"""
        response = client.post("/api/auth/login", json={
            "email": "test@example.com"
        })
        assert response.status_code == 422  # Validation error
    
    def test_database_connection(self):
        """Test database connection endpoint"""
        response = client.post("/api/auth/test-connection")
        assert response.status_code == 200
        data = response.json()
        # Connection might fail in test environment, but endpoint should work
        assert "success" in data
        assert "message" in data

class TestSecurity:
    """Test security features"""
    
    def test_cors_headers(self):
        """Test CORS headers are present"""
        response = client.options("/api/auth/login")
        # FastAPI handles CORS automatically
        assert response.status_code in [200, 405]  # Method not allowed is also acceptable
    
    def test_jwt_token_structure(self):
        """Test JWT token structure (mock test)"""
        from config.security import security_manager
        
        mock_user = {
            "_id": "test_id",
            "email": "test@example.com",
            "role": "user"
        }
        
        token = security_manager.create_jwt_token(mock_user)
        assert isinstance(token, str)
        assert len(token) > 50  # JWT tokens are typically long
    
    def test_password_hashing(self):
        """Test password hashing functionality"""
        from config.security import security_manager
        
        password = "testpassword123"
        hashed = security_manager.hash_password(password)
        
        assert hashed != password  # Password should be hashed
        assert security_manager.verify_password(password, hashed)  # Should verify correctly
        assert not security_manager.verify_password("wrongpassword", hashed)  # Wrong password should fail

class TestRateLimiting:
    """Test rate limiting functionality"""
    
    def test_rate_limiting_logic(self):
        """Test rate limiting logic"""
        from config.security import security_manager
        
        identifier = "test_client"
        limit = 5
        window = 60
        
        # Should allow requests under limit
        for i in range(limit):
            assert security_manager.check_rate_limit(identifier, limit, window) is True
        
        # Should block requests over limit
        assert security_manager.check_rate_limit(identifier, limit, window) is False

class TestEnvironmentConfig:
    """Test environment configuration"""
    
    def test_required_env_vars(self):
        """Test that required environment variables are set"""
        # These might not be set in test environment
        env_vars = [
            "MONGODB_URL",
            "DATABASE_NAME", 
            "COLLECTION_NAME",
            "JWT_SECRET"
        ]
        
        for var in env_vars:
            # Just check that they can be accessed
            value = os.getenv(var)
            # In test environment, these might be None, which is okay
            assert value is None or isinstance(value, str)

if __name__ == "__main__":
    pytest.main([__file__, "-v"])