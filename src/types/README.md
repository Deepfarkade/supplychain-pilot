# 📄 Types Directory

> TypeScript definitions and interfaces for type safety

## 📁 Structure

```
src/types/
└── microservice.ts        # Microservice-related type definitions
```

## 🏗️ Type System Overview

### Type Safety Benefits

- **Compile-time Error Detection**: Catch errors before runtime
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Self-documenting Code**: Types serve as inline documentation
- **Refactoring Safety**: TypeScript ensures consistency across changes
- **Team Collaboration**: Clear contracts between components

### Naming Conventions

```typescript
// Interfaces use PascalCase
interface UserProfile {
  id: string;
  name: string;
}

// Types use PascalCase  
type Status = 'active' | 'inactive' | 'pending';

// Enums use PascalCase
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

// Generic types use T, U, V pattern
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
```

## 🚀 Microservice Types

### `microservice.ts` - Core Microservice Definitions

Comprehensive type definitions for the microservice architecture.

```typescript
// Domain definitions
export type MicroserviceDomain = 'general' | 'supply-chain' | 'pharma';

// Service status types
export type ServiceStatus = 'active' | 'development' | 'maintenance' | 'deprecated';

// Core microservice interface
export interface Microservice {
  id: string;
  domain: MicroserviceDomain;
  slug: string;
  name: string;
  path: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  element: () => Promise<{ default: React.ComponentType }>;
  status: ServiceStatus;
  tags: string[];
  version?: string;
  lastUpdated?: Date;
  dependencies?: string[];
}

// Registry configuration
export interface MicroserviceRegistry {
  services: Microservice[];
  domains: MicroserviceDomain[];
  getByDomain(domain: MicroserviceDomain): Microservice[];
  getByStatus(status: ServiceStatus): Microservice[];
  findById(id: string): Microservice | undefined;
  findBySlug(domain: MicroserviceDomain, slug: string): Microservice | undefined;
}
```

### Layout and Configuration Types

```typescript
// Layout configuration
export interface MicroserviceLayout {
  fullBleed?: boolean;
  header?: 'compact' | 'normal' | 'expanded';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'default' | 'muted' | 'accent';
  sidebar?: boolean;
  footer?: boolean;
}

// SEO configuration
export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  titleSuffix?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

// Breadcrumb navigation
export interface Breadcrumb {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Shell component props
export interface MicroserviceShellProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  breadcrumbs?: Breadcrumb[];
  layout?: Partial<MicroserviceLayout>;
  metadata?: Partial<SEOConfig>;
  children: React.ReactNode;
}
```

## 🔐 Authentication Types

### User and Auth Types

```typescript
// User profile interface
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  settings: UserSettings;
}

// User roles enum
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager', 
  USER = 'user',
  GUEST = 'guest'
}

// Permission system
export interface Permission {
  resource: string;
  actions: PermissionAction[];
  conditions?: Record<string, any>;
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'execute';

// Authentication context
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  checkPermission: (resource: string, action: PermissionAction) => boolean;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// User settings
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}
```

## 🔔 Notification Types

### Notification System Types

```typescript
// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Toast notification
export interface ToastNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  timestamp: Date;
  actions?: NotificationAction[];
}

// Alert modal
export interface AlertNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  persistent?: boolean;
  actions?: NotificationAction[];
}

// Notification actions
export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'default' | 'primary' | 'destructive';
}

// Notification settings
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  categories: {
    security: boolean;
    system: boolean;
    updates: boolean;
    marketing: boolean;
  };
}

// Notification context
export interface NotificationContextType {
  notifications: ToastNotification[];
  alerts: AlertNotification[];
  showNotification: (config: NotificationConfig) => string;
  showAlert: (config: AlertConfig) => string;
  hideNotification: (id: string) => void;
  hideAlert: (id: string) => void;
  clearAll: () => void;
}
```

## 🌐 API Types

### API Client and Response Types

```typescript
// API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  pagination?: PaginationInfo;
  meta?: Record<string, any>;
}

// API error response
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Pagination information
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Request configuration
export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

// API client interface
export interface ApiClient {
  get<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
}
```

## 🗄️ Database Types

### Database Configuration and Operations

```typescript
// Database configuration
export interface DatabaseConfig {
  connectionString?: string;
  databaseName: string;
  collectionName: string;
  timeout: number;
  retryAttempts: number;
  ssl: boolean;
  poolSize?: number;
}

// Query options
export interface QueryOptions {
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
  projection?: Record<string, 0 | 1>;
}

// Database operations
export interface DatabaseOperations {
  findOne<T>(filter: Record<string, any>, options?: QueryOptions): Promise<T | null>;
  findMany<T>(filter: Record<string, any>, options?: QueryOptions): Promise<T[]>;
  insertOne<T>(document: Partial<T>): Promise<T>;
  insertMany<T>(documents: Partial<T>[]): Promise<T[]>;
  updateOne<T>(filter: Record<string, any>, update: Partial<T>): Promise<T | null>;
  updateMany(filter: Record<string, any>, update: Record<string, any>): Promise<number>;
  deleteOne(filter: Record<string, any>): Promise<boolean>;
  deleteMany(filter: Record<string, any>): Promise<number>;
}

// Document base interface
export interface BaseDocument {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## 🎨 UI Component Types

### Component Props and Variants

```typescript
// Button component types
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Card component types
export interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

// Modal/Dialog types
export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Form field types
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  spacing: Record<string, string>;
  typography: {
    fonts: Record<string, string>;
    sizes: Record<string, string>;
  };
  breakpoints: Record<string, string>;
}
```

## 🔄 State Management Types

### Context and State Types

```typescript
// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Async operation state
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

// Form state
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

// Route state
export interface RouteState {
  currentPath: string;
  previousPath?: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

// Application state
export interface AppState {
  user: AsyncState<User>;
  notifications: ToastNotification[];
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  route: RouteState;
}
```

## 🧪 Testing Types

### Test Utilities and Mocks

```typescript
// Test component props
export interface TestComponentProps {
  [key: string]: any;
}

// Mock service interfaces
export interface MockApiService extends Partial<ApiClient> {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
}

export interface MockAuthService extends Partial<AuthContextType> {
  login: jest.Mock;
  logout: jest.Mock;
  refreshToken: jest.Mock;
}

// Test wrapper props
export interface TestWrapperProps {
  children: React.ReactNode;
  initialState?: Partial<AppState>;
  mockServices?: {
    api?: MockApiService;
    auth?: MockAuthService;
  };
}

// Test utilities
export interface TestUtils {
  renderWithProviders: (
    component: React.ReactElement,
    options?: TestWrapperProps
  ) => RenderResult;
  createMockUser: (overrides?: Partial<User>) => User;
  createMockService: (overrides?: Partial<Microservice>) => Microservice;
}
```

## 🔧 Utility Types

### Common Utility Types

```typescript
// Make all properties optional
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make specific properties required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Exclude specific properties
export type OmitFields<T, K extends keyof T> = Omit<T, K>;

// Pick specific properties
export type PickFields<T, K extends keyof T> = Pick<T, K>;

// Create union types from object keys
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Deep partial type
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Function component with props
export type FC<P = {}> = React.FunctionComponent<P>;

// Component with children
export type ComponentWithChildren<P = {}> = FC<P & { children: React.ReactNode }>;

// Event handlers
export type EventHandler<T = Event> = (event: T) => void;
export type ChangeHandler<T = HTMLInputElement> = EventHandler<React.ChangeEvent<T>>;
export type ClickHandler = EventHandler<React.MouseEvent>;
```

## 📚 Type Organization Best Practices

### File Organization

```typescript
// Group related types together
export namespace Auth {
  export interface User { /* ... */ }
  export interface Credentials { /* ... */ }
  export type Role = 'admin' | 'user';
}

export namespace API {
  export interface Response<T> { /* ... */ }
  export interface Error { /* ... */ }
  export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
}

// Re-export for convenience
export type { Auth, API };
```

### Type Guards

```typescript
// Type guard functions
export const isUser = (obj: any): obj is User => {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string';
};

export const isApiError = (obj: any): obj is ApiError => {
  return obj && typeof obj.status === 'number' && typeof obj.message === 'string';
};

// Usage in components
const handleApiResponse = (response: unknown) => {
  if (isApiError(response)) {
    // TypeScript knows response is ApiError
    console.error(`API Error ${response.status}: ${response.message}`);
  }
};
```

### Generic Constraints

```typescript
// Constrained generics
interface Repository<T extends BaseDocument> {
  findById(id: string): Promise<T | null>;
  create(entity: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// Usage with specific types
interface UserDocument extends BaseDocument {
  email: string;
  name: string;
}

const userRepository: Repository<UserDocument> = new MongoRepository<UserDocument>();
```

## 📚 Related Documentation

- [🧩 Components](../components/README.md) - Component prop types
- [🌐 Services](../services/README.md) - Service interface types
- [🔒 Security](../security/README.md) - Security-related types
- [🚀 Microservices](../microservices/README.md) - Microservice type usage

---

For type-related questions, adding new types, or TypeScript configuration, refer to the specific type files or create an issue in the repository.