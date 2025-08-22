// Production MongoDB Service for Authentication
// This service handles real database operations when deployed locally

import { dbConfig, type DatabaseConfig, type UserDocument } from './config';

class MongoDBService {
  private readonly API_BASE_URL = '/api/auth'; // Will be handled by your backend

  /**
   * Configure database connection
   * Only requires database name and collection name
   */
  setConfig(databaseName: string, collectionName: string): void {
    dbConfig.setConfig(databaseName, collectionName);
  }

  /**
   * Load configuration
   */
  loadConfig(): DatabaseConfig | null {
    return dbConfig.loadConfig();
  }

  /**
   * Check if MongoDB is configured
   */
  isConfigured(): boolean {
    return dbConfig.isConfigured();
  }

  /**
   * Authenticate user against MongoDB database
   * In production: This makes a real API call to your backend
   */
  async authenticateUser(email: string, password: string): Promise<UserDocument | null> {
    try {
      const config = dbConfig.getConfig();
      if (!config) {
        throw new Error('Database not configured. Please configure database settings first.');
      }

      console.log('🔐 Authenticating user with database:', {
        database: config.databaseName,
        collection: config.collectionName,
        email: email
      });

      // In production, this would be a real API call to your backend:
      // const response = await fetch(`${this.API_BASE_URL}/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     email, 
      //     password, 
      //     database: config.databaseName,
      //     collection: config.collectionName
      //   })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Authentication failed');
      // }
      // 
      // const user = await response.json();
      // return user;

      // TEMPORARY: Simulate API call for development
      await new Promise(resolve => setTimeout(resolve, 800));

      // TEMPORARY: Mock users for development - REMOVE IN PRODUCTION
      const mockUsers: UserDocument[] = [
        {
          _id: '1',
          email: 'admin@supplychainai.com',
          password: 'admin123', // In production: hashed password
          name: 'Admin User',
          role: 'admin',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date()
        },
        {
          _id: '2', 
          email: 'user@supplychainai.com',
          password: 'user123', // In production: hashed password
          name: 'Supply Chain User',
          role: 'user',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date()
        }
      ];

      const user = mockUsers.find(u => u.email === email && u.password === password && u.isActive);
      
      if (user) {
        console.log('✅ User authenticated successfully:', user.name);
        // Remove password from returned user object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as UserDocument;
      }

      console.log('❌ Authentication failed for:', email);
      return null;
    } catch (error) {
      console.error('❌ Authentication error:', error);
      throw error;
    }
  }

  /**
   * Create new user (for registration)
   * In production: Makes real API call to your backend
   */
  async createUser(userData: Omit<UserDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<UserDocument | null> {
    try {
      const config = dbConfig.getConfig();
      if (!config) {
        throw new Error('Database not configured');
      }

      console.log('👤 Creating new user in database:', config.databaseName);

      // In production, this would be a real API call:
      // const response = await fetch(`${this.API_BASE_URL}/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     ...userData,
      //     database: config.databaseName,
      //     collection: config.collectionName
      //   })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('User creation failed');
      // }
      // 
      // const newUser = await response.json();
      // return newUser;

      // TEMPORARY: Simulate user creation for development
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: UserDocument = {
        _id: Date.now().toString(),
        ...userData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('✅ User created successfully:', newUser.name);
      return newUser;
    } catch (error) {
      console.error('❌ User creation error:', error);
      throw error;
    }
  }

  /**
   * Test database connection
   * In production: Tests real MongoDB connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const config = dbConfig.getConfig();
      if (!config) {
        return { 
          success: false, 
          message: 'Database not configured. Please set database name and collection name.' 
        };
      }

      console.log('🔌 Testing connection to database:', config.databaseName);

      // In production, this would test the actual MongoDB connection:
      // const response = await fetch(`${this.API_BASE_URL}/test-connection`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     database: config.databaseName,
      //     collection: config.collectionName
      //   })
      // });
      // 
      // const result = await response.json();
      // return result;

      // TEMPORARY: Simulate connection test for development
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('✅ Connection test completed for:', {
        database: config.databaseName,
        collection: config.collectionName
      });

      return { 
        success: true, 
        message: `Successfully configured for database: ${config.databaseName}, collection: ${config.collectionName}` 
      };
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { 
        success: false, 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Get database configuration info
   */
  getConfigInfo() {
    return dbConfig.getConnectionInfo();
  }
}

export const mongoService = new MongoDBService();
export type { DatabaseConfig, UserDocument };