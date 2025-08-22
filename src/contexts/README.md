# 🌐 Contexts Directory

> React Context providers for global state management and shared functionality

## 📁 Structure

```
src/contexts/
├── AuthContext.tsx         # Authentication state management
└── NotificationContext.tsx # Global notification system
```

## 🔐 AuthContext

Manages authentication state, user sessions, and security across the application.

### Features

- **JWT Token Management**: Automatic token refresh and validation
- **User Session**: Persistent user state and profile information
- **Route Protection**: Integration with protected routes
- **Session Timeout**: Automatic logout on inactivity
- **Security Events**: Login, logout, and security event handling

### Usage

```tsx
import { useAuth } from '@/contexts/AuthContext';

const Component = () => {
  const { user, login, logout, isAuthenticated, loading } = useAuth();
  
  if (loading) return <Loading />;
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login(credentials)}>Login</button>
      )}
    </div>
  );
};
```

### AuthContext API

```typescript
interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  
  // Security
  checkSession: () => boolean;
  extendSession: () => void;
}
```

### Implementation Details

#### Token Management

```typescript
// Automatic token refresh
useEffect(() => {
  const refreshInterval = setInterval(async () => {
    if (isAuthenticated && shouldRefreshToken()) {
      await refreshToken();
    }
  }, REFRESH_INTERVAL);
  
  return () => clearInterval(refreshInterval);
}, [isAuthenticated]);
```

#### Session Timeout

```typescript
// Session timeout handling
const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

const resetSessionTimeout = useCallback(() => {
  if (sessionTimeout) clearTimeout(sessionTimeout);
  
  const timeout = setTimeout(() => {
    logout();
    showSessionTimeoutModal();
  }, SESSION_TIMEOUT_DURATION);
  
  setSessionTimeout(timeout);
}, [sessionTimeout, logout]);
```

#### Persistent State

```typescript
// Save authentication state to localStorage
const saveAuthState = (user: User, token: string) => {
  localStorage.setItem('auth-token', token);
  localStorage.setItem('user-profile', JSON.stringify(user));
};

// Load authentication state from localStorage
const loadAuthState = () => {
  const token = localStorage.getItem('auth-token');
  const userJson = localStorage.getItem('user-profile');
  
  if (token && userJson) {
    return { token, user: JSON.parse(userJson) };
  }
  return null;
};
```

## 🔔 NotificationContext

Manages global notifications, toasts, and alert messages throughout the application.

### Features

- **Toast Notifications**: Success, error, info, and warning toasts
- **Alert Messages**: Modal alerts for important messages
- **Notification Queue**: Manages multiple notifications
- **Persistence**: Optional notification persistence
- **Auto-dismiss**: Configurable auto-dismiss timing

### Usage

```tsx
import { useNotification } from '@/contexts/NotificationContext';

const Component = () => {
  const { showNotification, showAlert, clearAll } = useNotification();
  
  const handleSuccess = () => {
    showNotification({
      type: 'success',
      title: 'Operation Successful',
      message: 'Your changes have been saved.',
      duration: 5000
    });
  };
  
  const handleError = () => {
    showAlert({
      type: 'error',
      title: 'Error Occurred',
      message: 'Please try again later.',
      actions: [
        { label: 'Retry', onClick: () => retry() },
        { label: 'Cancel', onClick: () => close() }
      ]
    });
  };
  
  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={clearAll}>Clear All</button>
    </div>
  );
};
```

### NotificationContext API

```typescript
interface NotificationContextType {
  // State
  notifications: Notification[];
  alerts: Alert[];
  
  // Actions
  showNotification: (notification: NotificationConfig) => string;
  showAlert: (alert: AlertConfig) => string;
  hideNotification: (id: string) => void;
  hideAlert: (id: string) => void;
  clearAll: () => void;
  
  // Configuration
  setDefaultDuration: (duration: number) => void;
  setMaxNotifications: (max: number) => void;
}
```

### Notification Types

```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationConfig {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // Auto-dismiss duration (0 = no auto-dismiss)
  persistent?: boolean; // Survive page reloads
  actions?: NotificationAction[];
}

interface AlertConfig {
  type: NotificationType;
  title: string;
  message: string;
  actions?: AlertAction[];
  persistent?: boolean;
}
```

### Implementation Details

#### Notification Queue Management

```typescript
const addNotification = useCallback((config: NotificationConfig) => {
  const id = generateId();
  const notification: Notification = {
    id,
    ...config,
    timestamp: Date.now()
  };
  
  setNotifications(prev => {
    const updated = [...prev, notification];
    // Limit queue size
    return updated.slice(-maxNotifications);
  });
  
  // Auto-dismiss
  if (config.duration && config.duration > 0) {
    setTimeout(() => {
      hideNotification(id);
    }, config.duration);
  }
  
  return id;
}, [maxNotifications, hideNotification]);
```

#### Persistent Notifications

```typescript
// Save persistent notifications
useEffect(() => {
  const persistent = notifications.filter(n => n.persistent);
  if (persistent.length > 0) {
    localStorage.setItem('persistent-notifications', JSON.stringify(persistent));
  }
}, [notifications]);

// Load persistent notifications on mount
useEffect(() => {
  const stored = localStorage.getItem('persistent-notifications');
  if (stored) {
    const persistent: Notification[] = JSON.parse(stored);
    setNotifications(persistent);
  }
}, []);
```

## 🔧 Context Provider Setup

### App-Level Provider Wrapping

```tsx
// In App.tsx or main.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          {/* App content */}
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};
```

### Provider Configuration

```tsx
// Custom provider configuration
<AuthProvider
  config={{
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    refreshThreshold: 5 * 60 * 1000, // 5 minutes
    autoRefresh: true
  }}
>
  <App />
</AuthProvider>

<NotificationProvider
  config={{
    maxNotifications: 5,
    defaultDuration: 5000,
    position: 'top-right'
  }}
>
  <App />
</NotificationProvider>
```

## 🧪 Testing Contexts

### AuthContext Testing

```tsx
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
  
  it('handles login correctly', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'password' });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
```

### NotificationContext Testing

```tsx
import { renderHook, act } from '@testing-library/react';
import { NotificationProvider, useNotification } from './NotificationContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NotificationProvider>{children}</NotificationProvider>
);

describe('NotificationContext', () => {
  it('shows and hides notifications', () => {
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      const id = result.current.showNotification({
        type: 'success',
        title: 'Test'
      });
      
      expect(result.current.notifications).toHaveLength(1);
      
      result.current.hideNotification(id);
      expect(result.current.notifications).toHaveLength(0);
    });
  });
});
```

## 🔄 Context Integration Patterns

### Context Composition

```tsx
// Combine multiple contexts
const useAppContext = () => {
  const auth = useAuth();
  const notifications = useNotification();
  
  return { auth, notifications };
};

// Usage in components
const { auth, notifications } = useAppContext();
```

### Context-Aware Components

```tsx
// HOC for context injection
export const withAuth = <P extends object>(
  Component: React.ComponentType<P & { auth: AuthContextType }>
) => {
  return (props: P) => {
    const auth = useAuth();
    return <Component {...props} auth={auth} />;
  };
};

// Usage
const SecureComponent = withAuth(({ auth, ...props }) => {
  if (!auth.isAuthenticated) {
    return <LoginPrompt />;
  }
  return <SecureContent {...props} />;
});
```

## 📚 Related Documentation

- [🔒 Security](../security/README.md) - Authentication implementation
- [🧩 Components](../components/README.md) - Context-aware components
- [🪝 Hooks](../hooks/README.md) - Context-related custom hooks
- [📄 Types](../types/README.md) - Context TypeScript definitions

---

For context-related questions or adding new global state, refer to the specific context files or create an issue in the repository.