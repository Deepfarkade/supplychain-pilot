# 🌐 Services Directory

> API clients, data services, and external integrations

## 📁 Structure

```
src/services/
├── api.ts                    # Centralized API client
├── index.ts                  # Service registry and exports
├── notificationApi.ts        # Notification service API
├── security.ts              # Security service utilities
├── database/
│   ├── config.ts            # Database configuration
│   └── mongodb.ts           # MongoDB service client
└── ...                      # Additional service modules
```

## 🔧 Core Services

### `api.ts` - Centralized API Client

Main API client with security, error handling, and request management.

```typescript
// Key Features:
- Centralized endpoint management
- Request/response interceptors
- Authentication integration
- Error handling and retry logic
- Request signing and encryption
- Rate limiting and caching
```

#### API Client Usage:

```typescript
import { ApiService } from '@/services/api';

const apiService = new ApiService({
  baseURL: 'https://api.nexus-ai-hub.com',
  timeout: 30000,
  retries: 3,
  security: {
    encryption: true,
    signing: true,
    rateLimiting: true
  }
});

// Making requests
const users = await apiService.get('/users');
const newUser = await apiService.post('/users', userData);
const updatedUser = await apiService.put('/users/123', updates);
await apiService.delete('/users/123');
```

#### API Configuration:

```typescript
interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  security: {
    encryption: boolean;
    signing: boolean;
    rateLimiting: boolean;
    encryptionKey?: string;
  };
  interceptors: {
    request: RequestInterceptor[];
    response: ResponseInterceptor[];
  };
}
```

#### Request Interceptors:

```typescript
// Authentication interceptor
const authInterceptor = (config: RequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Request signing interceptor
const signingInterceptor = (config: RequestConfig) => {
  const signature = signRequest(config.data, config.url);
  config.headers['X-Request-Signature'] = signature;
  return config;
};

// Rate limiting interceptor
const rateLimitInterceptor = (config: RequestConfig) => {
  if (!checkRateLimit(config.url)) {
    throw new Error('Rate limit exceeded');
  }
  return config;
};
```

#### Response Interceptors:

```typescript
// Error handling interceptor
const errorInterceptor = (error: ApiError) => {
  if (error.status === 401) {
    // Handle authentication error
    redirectToLogin();
  } else if (error.status >= 500) {
    // Handle server errors
    showErrorNotification('Server error occurred');
  }
  throw error;
};

// Data transformation interceptor
const transformInterceptor = (response: ApiResponse) => {
  // Transform response data
  return {
    ...response,
    data: transformApiResponse(response.data)
  };
};
```

### `index.ts` - Service Registry

Central registry for all application services.

```typescript
// Service exports and initialization
export { ApiService } from './api';
export { NotificationService } from './notificationApi';
export { SecurityService } from './security';
export { DatabaseService } from './database/mongodb';

// Service registry for dependency injection
export const serviceRegistry = {
  api: new ApiService(API_CONFIG),
  notifications: new NotificationService(),
  security: new SecurityService(),
  database: new DatabaseService()
};

// Hook for accessing services
export const useServices = () => serviceRegistry;
```

### `security.ts` - Security Service

Enhanced security utilities and service implementations.

```typescript
// Key Features:
- Request encryption and decryption
- Digital signature generation and verification
- Rate limiting implementation  
- Security event logging
- Input sanitization utilities
```

#### Security API:

```typescript
interface SecurityService {
  // Encryption
  encrypt(data: string, key?: string): string;
  decrypt(encryptedData: string, key?: string): string;
  
  // Digital signatures
  signRequest(data: any, url: string): string;
  verifySignature(data: any, signature: string, url: string): boolean;
  
  // Rate limiting
  checkRateLimit(endpoint: string, userId?: string): boolean;
  resetRateLimit(endpoint: string, userId?: string): void;
  
  // Input sanitization
  sanitizeInput(input: string, options?: SanitizeOptions): string;
  sanitizeHtml(html: string, options?: HtmlSanitizeOptions): string;
  
  // Security logging
  logSecurityEvent(event: SecurityEvent): void;
  getSecurityLogs(filters?: LogFilters): SecurityEvent[];
}
```

#### Usage Example:

```typescript
import { SecurityService } from '@/services/security';

const securityService = new SecurityService();

// Encrypt sensitive data
const encryptedData = securityService.encrypt(JSON.stringify(sensitiveData));
localStorage.setItem('secure-data', encryptedData);

// Sign API requests
const signature = securityService.signRequest(requestData, '/api/users');

// Check rate limits
if (!securityService.checkRateLimit('/api/search', userId)) {
  throw new Error('Rate limit exceeded');
}

// Sanitize user input
const cleanInput = securityService.sanitizeInput(userInput);
```

## 💾 Database Services

### `database/config.ts` - Database Configuration

Simplified configuration management for database connections.

```typescript
// Configuration interface
interface DatabaseConfig {
  connectionString?: string;
  databaseName: string;
  collectionName: string;
  timeout: number;
  retryAttempts: number;
  ssl: boolean;
}

// Default configuration
export const DEFAULT_DB_CONFIG: DatabaseConfig = {
  databaseName: '',
  collectionName: 'users',
  timeout: 10000,
  retryAttempts: 3,
  ssl: true
};

// Configuration management
export const getDatabaseConfig = (): DatabaseConfig => {
  const saved = localStorage.getItem('database-config');
  return saved ? JSON.parse(saved) : DEFAULT_DB_CONFIG;
};

export const saveDatabaseConfig = (config: DatabaseConfig): void => {
  localStorage.setItem('database-config', JSON.stringify(config));
};
```

### `database/mongodb.ts` - MongoDB Service

Production-ready MongoDB service client.

```typescript
// Key Features:
- Connection management and pooling
- Query builder and ORM-like interface
- Transaction support
- Automatic retry logic
- Connection health monitoring
```

#### MongoDB API:

```typescript
interface MongoDBService {
  // Connection management
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  
  // CRUD operations
  findOne<T>(filter: Record<string, any>): Promise<T | null>;
  findMany<T>(filter: Record<string, any>, options?: QueryOptions): Promise<T[]>;
  insertOne<T>(document: Partial<T>): Promise<T>;
  insertMany<T>(documents: Partial<T>[]): Promise<T[]>;
  updateOne<T>(filter: Record<string, any>, update: Partial<T>): Promise<T | null>;
  updateMany(filter: Record<string, any>, update: Record<string, any>): Promise<number>;
  deleteOne(filter: Record<string, any>): Promise<boolean>;
  deleteMany(filter: Record<string, any>): Promise<number>;
  
  // Advanced operations
  aggregate<T>(pipeline: any[]): Promise<T[]>;
  createIndex(fields: Record<string, 1 | -1>): Promise<void>;
  transaction<T>(operations: TransactionOperation[]): Promise<T>;
}
```

#### Usage Example:

```typescript
import { MongoDBService } from '@/services/database/mongodb';

const mongoService = new MongoDBService();

// Connect to database
await mongoService.connect();

// User operations
const user = await mongoService.findOne<User>({ email: 'user@example.com' });
const users = await mongoService.findMany<User>({ active: true });

// Create new user
const newUser = await mongoService.insertOne<User>({
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date()
});

// Update user
await mongoService.updateOne(
  { _id: user._id },
  { lastLogin: new Date() }
);
```

## 🔔 Notification Services

### `notificationApi.ts` - Notification Service

Manages system notifications, alerts, and messaging.

```typescript
// Key Features:
- Toast notifications management
- Real-time alert system
- Email notification integration
- Push notification support
- Notification persistence and history
```

#### Notification API:

```typescript
interface NotificationService {
  // Toast notifications
  showToast(notification: ToastConfig): string;
  hideToast(id: string): void;
  clearAllToasts(): void;
  
  // System alerts
  showAlert(alert: AlertConfig): string;
  hideAlert(id: string): void;
  
  // Email notifications
  sendEmail(config: EmailConfig): Promise<void>;
  
  // Push notifications
  requestPermission(): Promise<boolean>;
  sendPushNotification(config: PushConfig): Promise<void>;
  
  // Notification history
  getNotificationHistory(userId: string): Promise<NotificationHistory[]>;
  markAsRead(notificationId: string): Promise<void>;
}
```

#### Usage Example:

```typescript
import { NotificationService } from '@/services/notificationApi';

const notificationService = new NotificationService();

// Show success toast
notificationService.showToast({
  type: 'success',
  title: 'Operation Successful',
  message: 'Your changes have been saved.',
  duration: 5000
});

// Show critical alert
notificationService.showAlert({
  type: 'error',
  title: 'System Error',
  message: 'A critical error occurred. Please contact support.',
  persistent: true,
  actions: [
    { label: 'Contact Support', action: () => openSupportChat() },
    { label: 'Dismiss', action: () => {} }
  ]
});

// Send email notification
await notificationService.sendEmail({
  to: 'user@example.com',
  subject: 'Account Activity Alert',
  template: 'security-alert',
  data: { loginTime: new Date(), ipAddress: '192.168.1.1' }
});
```

## 🔄 Service Integration Patterns

### Service Dependency Injection

```typescript
// Service container for dependency injection
class ServiceContainer {
  private services = new Map<string, any>();
  
  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }
  
  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }
}

// Usage in React components
const useService = <T>(serviceName: string): T => {
  return serviceContainer.get<T>(serviceName);
};

// Component usage
const UserComponent = () => {
  const apiService = useService<ApiService>('api');
  const notificationService = useService<NotificationService>('notifications');
  
  const handleUserAction = async () => {
    try {
      await apiService.post('/users/action', actionData);
      notificationService.showToast({
        type: 'success',
        title: 'Action completed successfully'
      });
    } catch (error) {
      notificationService.showToast({
        type: 'error',
        title: 'Action failed',
        message: error.message
      });
    }
  };
};
```

### Service Composition

```typescript
// Composite service combining multiple services
class UserManagementService {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private securityService: SecurityService
  ) {}
  
  async createUser(userData: Partial<User>): Promise<User> {
    // Sanitize input
    const sanitizedData = this.securityService.sanitizeInput(userData);
    
    // Create user via API
    const user = await this.apiService.post('/users', sanitizedData);
    
    // Send welcome notification
    await this.notificationService.sendEmail({
      to: user.email,
      template: 'welcome',
      data: { userName: user.name }
    });
    
    // Log security event
    this.securityService.logSecurityEvent({
      type: 'user_created',
      userId: user.id,
      timestamp: new Date()
    });
    
    return user;
  }
}
```

## 🧪 Service Testing

### Service Testing Patterns

```typescript
import { ApiService } from '@/services/api';

describe('ApiService', () => {
  let apiService: ApiService;
  let mockFetch: jest.Mock;
  
  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    apiService = new ApiService({ baseURL: 'http://test.com' });
  });
  
  it('makes GET requests correctly', async () => {
    const mockResponse = { data: [{ id: 1, name: 'Test' }] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });
    
    const result = await apiService.get('/users');
    
    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com/users',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
    expect(result).toEqual(mockResponse);
  });
  
  it('handles errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    
    await expect(apiService.get('/users')).rejects.toThrow('Network error');
  });
  
  it('retries failed requests', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      });
    
    const result = await apiService.get('/users');
    
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ data: [] });
  });
});
```

### Integration Testing

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { ServiceProvider } from '@/contexts/ServiceContext';
import UserList from '@/components/UserList';

const mockServices = {
  api: {
    get: jest.fn().mockResolvedValue({ data: mockUsers }),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  },
  notifications: {
    showToast: jest.fn()
  }
};

describe('Service Integration', () => {
  it('integrates services correctly', async () => {
    render(
      <ServiceProvider services={mockServices}>
        <UserList />
      </ServiceProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    expect(mockServices.api.get).toHaveBeenCalledWith('/users');
  });
});
```

## ⚡ Performance Optimization

### Service Caching

```typescript
// Request caching implementation
class CachedApiService extends ApiService {
  private cache = new Map<string, { data: any; expiry: number }>();
  
  async get(url: string, options?: RequestOptions): Promise<any> {
    const cacheKey = `${url}${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    
    const data = await super.get(url, options);
    
    this.cache.set(cacheKey, {
      data,
      expiry: Date.now() + (options?.cacheTimeout || 5 * 60 * 1000) // 5 minutes
    });
    
    return data;
  }
}
```

### Connection Pooling

```typescript
// Database connection pooling
class PooledMongoDBService extends MongoDBService {
  private pool: Connection[] = [];
  private maxConnections = 10;
  
  async getConnection(): Promise<Connection> {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    
    if (this.activeConnections < this.maxConnections) {
      return await this.createConnection();
    }
    
    // Wait for available connection
    return await this.waitForConnection();
  }
  
  releaseConnection(connection: Connection): void {
    if (this.pool.length < this.maxConnections) {
      this.pool.push(connection);
    } else {
      connection.close();
    }
  }
}
```

## 📚 Related Documentation

- [🔒 Security](../security/README.md) - Security service integration
- [🔧 Config](../config/README.md) - Service configuration
- [🌐 Contexts](../contexts/README.md) - Service context providers
- [🧩 Components](../components/README.md) - Service-consuming components

---

For service-related questions, API integration help, or adding new services, refer to the specific service files or create an issue in the repository.