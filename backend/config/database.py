# Production Database Configuration with Connection Pooling
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Production-ready MongoDB connection manager with pooling"""
    
    def __init__(self):
        self.client: Optional[MongoClient] = None
        self.db = None
        self.users_collection = None
        
    def connect(self) -> bool:
        """Establish MongoDB connection with production settings"""
        try:
            # Production MongoDB connection with pooling
            self.client = MongoClient(
                os.getenv("MONGODB_URL"),
                maxPoolSize=50,  # Maximum connections in pool
                minPoolSize=10,  # Minimum connections in pool
                maxIdleTimeMS=30000,  # Close connections after 30 seconds of inactivity
                waitQueueTimeoutMS=5000,  # Wait 5 seconds for connection from pool
                serverSelectionTimeoutMS=5000,  # Server selection timeout
                connectTimeoutMS=10000,  # Connection timeout
                socketTimeoutMS=20000,  # Socket timeout
                heartbeatFrequencyMS=10000,  # Heartbeat frequency
                retryWrites=True,  # Enable retryable writes
                readPreference='primary',  # Read from primary for consistency
                readConcern={'level': 'majority'},  # Read concern for consistency
                writeConcern={'w': 'majority', 'j': True}  # Write concern for durability
            )
            
            # Test connection
            self.client.admin.command('ping')
            
            # Set up database and collection
            self.db = self.client[os.getenv("DATABASE_NAME")]
            self.users_collection = self.db[os.getenv("COLLECTION_NAME")]
            
            # Create indexes for performance
            self._create_indexes()
            
            logger.info("✅ Connected to MongoDB with production settings")
            return True
            
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"❌ MongoDB connection failed: {e}")
            return False
        except Exception as e:
            logger.error(f"❌ Unexpected database error: {e}")
            return False
    
    def _create_indexes(self):
        """Create database indexes for performance"""
        try:
            # Index on email for fast user lookup
            self.users_collection.create_index([("email", 1)], unique=True)
            
            # Compound index on email and is_active for login queries
            self.users_collection.create_index([("email", 1), ("is_active", 1)])
            
            # Index on last_login for analytics
            self.users_collection.create_index([("last_login", -1)])
            
            # Index on created_at for user management
            self.users_collection.create_index([("created_at", -1)])
            
            logger.info("✅ Database indexes created successfully")
            
        except Exception as e:
            logger.warning(f"⚠️ Failed to create indexes: {e}")
    
    def get_connection_info(self) -> dict:
        """Get connection status and statistics"""
        if not self.client:
            return {"connected": False}
        
        try:
            server_info = self.client.server_info()
            db_stats = self.db.command("dbStats")
            
            return {
                "connected": True,
                "server_version": server_info.get("version"),
                "database_name": self.db.name,
                "collection_name": self.users_collection.name,
                "user_count": self.users_collection.count_documents({}),
                "database_size_mb": round(db_stats.get("dataSize", 0) / 1024 / 1024, 2),
                "pool_size": {
                    "max": 50,
                    "min": 10,
                    "current": len(self.client._topology._pool._sockets) if hasattr(self.client, '_topology') else "N/A"
                }
            }
        except Exception as e:
            logger.error(f"Error getting connection info: {e}")
            return {"connected": True, "error": str(e)}
    
    def close_connection(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

# Singleton instance
db_manager = DatabaseManager()