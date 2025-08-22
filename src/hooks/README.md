# 🪝 Hooks Directory

> Custom React hooks for shared logic and functionality

## 📁 Structure

```
src/hooks/
├── use-mobile.tsx        # Mobile device detection
├── use-toast.ts          # Toast notification management
├── useDebounce.ts        # Input debouncing utility
├── useRouteError.ts      # Route error handling
└── useSessionState.ts    # Session state management
```

## 📱 Device & UI Hooks

### `use-mobile.tsx` - Mobile Detection

Detects mobile devices and screen sizes for responsive behavior.

```tsx
import { useMobile } from '@/hooks/use-mobile';

const Component = () => {
  const isMobile = useMobile();
  
  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      {isMobile ? <MobileMenu /> : <DesktopMenu />}
    </div>
  );
};
```

#### Features:
- **Screen Size Detection**: Responsive breakpoint monitoring
- **Touch Device Detection**: Identifies touch-capable devices
- **Orientation Changes**: Handles device rotation
- **SSR Safe**: Works with server-side rendering

#### Implementation:
```typescript
export const useMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, [breakpoint]);
  
  return isMobile;
};
```

## 🔔 Notification Hooks

### `use-toast.ts` - Toast Management

Provides easy toast notification functionality with type safety.

```tsx
import { useToast } from '@/hooks/use-toast';

const Component = () => {
  const { toast } = useToast();
  
  const handleSuccess = () => {
    toast({
      title: "Success!",
      description: "Your changes have been saved.",
      variant: "success"
    });
  };
  
  const handleError = () => {
    toast({
      title: "Error",
      description: "Something went wrong.",
      variant: "destructive"
    });
  };
  
  return (
    <div>
      <button onClick={handleSuccess}>Save Changes</button>
      <button onClick={handleError}>Trigger Error</button>
    </div>
  );
};
```

#### Toast API:
```typescript
interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
  action?: ToastAction;
}

const { toast, dismiss, toasts } = useToast();
```

## ⚡ Performance Hooks

### `useDebounce.ts` - Input Debouncing

Debounces values to prevent excessive API calls or computations.

```tsx
import { useDebounce } from '@/hooks/useDebounce';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search API call
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

#### Implementation:
```typescript
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

#### Use Cases:
- **Search Input**: Debounce search queries
- **Form Validation**: Delay validation until user stops typing
- **API Calls**: Prevent excessive requests
- **Resize Events**: Debounce expensive resize calculations

## 🛣️ Navigation Hooks

### `useRouteError.ts` - Route Error Handling

Manages route errors and provides consistent error modal functionality.

```tsx
import { useRouteError } from '@/hooks/useRouteError';

const MicroserviceContainer = () => {
  const { showRouteError, hideRouteError } = useRouteError();
  
  const handleServiceUnavailable = () => {
    showRouteError({
      title: 'Service Unavailable',
      message: 'This microservice is currently being deployed. Please try again in a few minutes.',
      type: 'service-unavailable',
      retryAction: () => window.location.reload()
    });
  };
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

#### Route Error API:
```typescript
interface RouteErrorConfig {
  title: string;
  message: string;
  type: 'not-found' | 'service-unavailable' | 'access-denied' | 'server-error';
  retryAction?: () => void;
  homeAction?: () => void;
}

const {
  showRouteError,
  hideRouteError,
  errorState,
  isErrorVisible
} = useRouteError();
```

## 🔐 Session Hooks

### `useSessionState.ts` - Session Management

Manages user session state with persistence and timeout handling.

```tsx
import { useSessionState } from '@/hooks/useSessionState';

const App = () => {
  const {
    sessionActive,
    sessionTimeLeft,
    extendSession,
    endSession,
    isSessionExpiring
  } = useSessionState();
  
  return (
    <div>
      {isSessionExpiring && (
        <SessionWarning
          timeLeft={sessionTimeLeft}
          onExtend={extendSession}
          onLogout={endSession}
        />
      )}
    </div>
  );
};
```

#### Session State API:
```typescript
interface SessionState {
  sessionActive: boolean;
  sessionTimeLeft: number;
  lastActivity: Date;
  isSessionExpiring: boolean;
  
  extendSession: () => void;
  endSession: () => void;
  updateActivity: () => void;
}
```

#### Features:
- **Automatic Timeout**: Configurable session timeout
- **Activity Tracking**: Updates on user interaction
- **Warning System**: Alerts before session expires
- **Persistence**: Survives page reloads
- **Multiple Tab Support**: Syncs across browser tabs

## 🔧 Creating Custom Hooks

### Hook Development Pattern

```typescript
// Custom hook template
export const useCustomHook = (config?: HookConfig) => {
  // State
  const [state, setState] = useState(initialState);
  
  // Side effects
  useEffect(() => {
    // Setup logic
    return () => {
      // Cleanup logic
    };
  }, []);
  
  // Memoized values
  const memoizedValue = useMemo(() => {
    return computeExpensiveValue(state);
  }, [state]);
  
  // Callback functions
  const handleAction = useCallback((param: string) => {
    setState(prev => updateState(prev, param));
  }, []);
  
  // Return hook interface
  return {
    state,
    memoizedValue,
    handleAction
  };
};
```

### Hook Testing Pattern

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('initializes with correct state', () => {
    const { result } = renderHook(() => useCustomHook());
    
    expect(result.current.state).toEqual(expectedInitialState);
  });
  
  it('handles actions correctly', () => {
    const { result } = renderHook(() => useCustomHook());
    
    act(() => {
      result.current.handleAction('test');
    });
    
    expect(result.current.state).toEqual(expectedUpdatedState);
  });
  
  it('cleans up on unmount', () => {
    const cleanup = jest.fn();
    const { unmount } = renderHook(() => useCustomHook());
    
    unmount();
    
    expect(cleanup).toHaveBeenCalled();
  });
});
```

## 🧪 Hook Testing Utilities

### Test Helpers

```typescript
// Custom render hook with providers
export const renderHookWithProviders = <T>(
  hook: () => T,
  providers: React.ComponentType<{ children: React.ReactNode }>[] = []
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return providers.reduce(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
  };
  
  return renderHook(hook, { wrapper: Wrapper });
};

// Mock timer utilities
export const mockTimers = () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
};
```

## 📊 Performance Optimization

### Hook Performance Best Practices

#### ✅ DO: Use Dependencies Correctly
```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]); // Include all dependencies
```

#### ❌ DON'T: Missing Dependencies
```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, []); // Missing 'data' dependency
```

#### ✅ DO: Stable Function References
```typescript
const handleClick = useCallback((id: string) => {
  onClick(id);
}, [onClick]); // Stable reference
```

#### ❌ DON'T: New Functions on Every Render
```typescript
const handleClick = (id: string) => {
  onClick(id);
}; // New function on every render
```

### Memory Management

```typescript
// Cleanup subscriptions and timers
useEffect(() => {
  const subscription = subscribe();
  const timer = setInterval(callback, 1000);
  
  return () => {
    subscription.unsubscribe();
    clearInterval(timer);
  };
}, []);
```

## 📚 Related Documentation

- [🌐 Contexts](../contexts/README.md) - Context providers used by hooks
- [🧩 Components](../components/README.md) - Components using these hooks
- [🔒 Security](../security/README.md) - Security-related hooks
- [📄 Types](../types/README.md) - Hook TypeScript interfaces

---

For hook-related questions or creating new custom hooks, refer to the specific hook files or create an issue in the repository.