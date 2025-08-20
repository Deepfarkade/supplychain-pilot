// MongoDB Service for Authentication
// Note: This is a frontend implementation - in production, use backend services

interface MongoConfig {
  connectionString: string;
  databaseName: string;
  collectionName: string;
}

interface User {
  _id?: string;
  email: string;
  password: string; // In production, this should be hashed
  name: string;
  role?: string;
  createdAt?: Date;
}

class MongoDBService {
  private config: MongoConfig | null = null;

  // Initialize MongoDB configuration
  setConfig(config: MongoConfig) {
    this.config = config;
    localStorage.setItem('mongo_config', JSON.stringify(config));
  }

  // Load configuration from localStorage
  loadConfig(): MongoConfig | null {
    const stored = localStorage.getItem('mongo_config');
    if (stored) {
      this.config = JSON.parse(stored);
      return this.config;
    }
    return null;
  }

  // Authenticate user (simulated - replace with actual MongoDB API calls)
  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      if (!this.config) {
        this.loadConfig();
        if (!this.config) {
          throw new Error('MongoDB configuration not found');
        }
      }

      // TODO: Replace with actual MongoDB API call
      // Example: const response = await fetch('/api/auth/login', { ... });
      
      // For now, simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation against dummy data
      // In production, this would be a secure API call to your MongoDB backend
      const mockUsers: User[] = [
        {
          _id: '1',
          email: 'admin@supplychainai.com',
          password: 'admin123', // In production: hashed password
          name: 'Admin User',
          role: 'admin'
        },
        {
          _id: '2', 
          email: 'user@supplychainai.com',
          password: 'user123', // In production: hashed password
          name: 'Supply Chain User',
          role: 'user'
        }
      ];

      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Remove password from returned user object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      }

      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // Create new user (for registration)
  async createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<User | null> {
    try {
      if (!this.config) {
        throw new Error('MongoDB configuration not found');
      }

      // TODO: Replace with actual MongoDB API call
      // Example: const response = await fetch('/api/auth/register', { ... });
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user creation
      const newUser: User = {
        _id: Date.now().toString(),
        ...userData,
        createdAt: new Date()
      };

      console.log('User would be created in MongoDB:', {
        database: this.config.databaseName,
        collection: this.config.collectionName,
        user: newUser
      });

      return newUser;
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      if (!this.config) {
        return false;
      }

      // TODO: Replace with actual MongoDB connection test
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Testing connection to:', {
        database: this.config.databaseName,
        collection: this.config.collectionName
      });

      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const mongoService = new MongoDBService();
export type { MongoConfig, User };