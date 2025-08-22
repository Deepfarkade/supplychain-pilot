# 🔧 Utils Directory

> Utility functions and helper libraries for common operations

## 📁 Structure

```
src/utils/
└── security.ts            # Security utility functions
```

## 🛡️ Security Utilities

### `security.ts` - Security Helper Functions

Comprehensive security utilities for input sanitization, validation, and protection.

```typescript
// Key Features:
- Input sanitization and XSS protection
- HTML content cleaning
- Data validation utilities  
- Security event logging
- Encryption/decryption helpers
- Rate limiting utilities
```

#### Core Security Functions:

```typescript
// Input sanitization
export const sanitizeInput = (input: string, options?: SanitizeOptions): string => {
  // Remove potentially dangerous characters
  // Strip HTML tags if not allowed
  // Encode special characters
  // Trim whitespace
};

// HTML sanitization  
export const sanitizeHtml = (html: string, options?: HtmlSanitizeOptions): string => {
  // Allow only safe HTML tags
  // Remove dangerous attributes
  // Sanitize URLs in links
  // Prevent script injection
};

// Data validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): PasswordValidation => {
  return {
    isValid: password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password),
    strength: calculatePasswordStrength(password),
    feedback: getPasswordFeedback(password)
  };
};

// Security event logging
export const logSecurityEvent = (event: SecurityEvent): void => {
  // Log security events for monitoring
  // Send to security service if configured
  // Store locally for audit purposes
};
```

#### Advanced Security Features:

```typescript
// Rate limiting
export const checkRateLimit = (
  key: string, 
  limit: number, 
  windowMs: number
): boolean => {
  const now = Date.now();
  const requests = getRequestHistory(key, windowMs);
  
  if (requests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  recordRequest(key, now);
  return true;
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  // Validate CSRF token against session
  return token === getStoredCSRFToken(sessionToken);
};

// Content Security Policy helpers
export const generateNonce = (): string => {
  return crypto.randomBytes(16).toString('base64');
};

export const buildCSPHeader = (nonce: string): string => {
  return `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline';`;
};
```

### Usage Examples:

```typescript
import { 
  sanitizeInput, 
  sanitizeHtml, 
  validateEmail, 
  checkRateLimit,
  logSecurityEvent 
} from '@/utils/security';

// Sanitize user input in forms
const handleFormSubmit = (formData: FormData) => {
  const cleanName = sanitizeInput(formData.name);
  const cleanEmail = sanitizeInput(formData.email);
  
  if (!validateEmail(cleanEmail)) {
    throw new Error('Invalid email format');
  }
  
  // Process clean data
  submitForm({ name: cleanName, email: cleanEmail });
};

// Sanitize HTML content
const DisplayUserContent = ({ content }: { content: string }) => {
  const cleanContent = sanitizeHtml(content, {
    allowedTags: ['p', 'br', 'strong', 'em'],
    allowedAttributes: {}
  });
  
  return <div dangerouslySetInnerHTML={{ __html: cleanContent }} />;
};

// Rate limiting API calls
const makeApiCall = async (endpoint: string, data: any) => {
  if (!checkRateLimit(`api:${endpoint}`, 10, 60000)) { // 10 requests per minute
    throw new Error('Rate limit exceeded');
  }
  
  logSecurityEvent({
    type: 'api_request',
    endpoint,
    timestamp: new Date(),
    userId: getCurrentUser()?.id
  });
  
  return await apiClient.post(endpoint, data);
};
```

## 🔧 Common Utility Patterns

### String Utilities

```typescript
// String manipulation utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const camelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
};

export const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/\s+/g, '-');
};

export const truncate = (str: string, length: number, suffix = '...'): string => {
  return str.length <= length ? str : str.substring(0, length) + suffix;
};

// Usage examples
const title = capitalize('user management'); // "User management"
const className = camelCase('user-profile-card'); // "userProfileCard"
const slug = kebabCase('User Profile Card'); // "user-profile-card"
const preview = truncate(longText, 100); // "Long text content..."
```

### Date Utilities

```typescript
// Date manipulation and formatting
export const formatDate = (date: Date, format: string): string => {
  const options: Intl.DateTimeFormatOptions = {};
  
  switch (format) {
    case 'short':
      options.dateStyle = 'short';
      break;
    case 'medium':
      options.dateStyle = 'medium';
      break;
    case 'long':
      options.dateStyle = 'long';
      break;
    case 'relative':
      return formatRelativeTime(date);
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  if (diff < 60000) return rtf.format(-Math.floor(diff / 1000), 'second');
  if (diff < 3600000) return rtf.format(-Math.floor(diff / 60000), 'minute');
  if (diff < 86400000) return rtf.format(-Math.floor(diff / 3600000), 'hour');
  return rtf.format(-Math.floor(diff / 86400000), 'day');
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Usage examples
const formatted = formatDate(new Date(), 'medium'); // "Jan 15, 2024"
const relative = formatRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
const todayCheck = isToday(new Date()); // true
```

### Array Utilities

```typescript
// Array manipulation utilities
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
};

// Usage examples
const users = [{ id: 1, name: 'John' }, { id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
const unique = uniqueBy(users, 'id'); // Remove duplicates by id
const grouped = groupBy(users, 'name'); // Group by name
const sorted = sortBy(users, 'name'); // Sort by name
const chunked = chunk(users, 2); // Split into chunks of 2
```

### Object Utilities

```typescript
// Object manipulation utilities
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

export const omit = <T extends object, K extends keyof T>(
  obj: T, 
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends object, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Usage examples
const original = { a: 1, b: { c: 2 }, d: [3, 4] };
const cloned = deepClone(original); // Deep copy
const filtered = omit(original, ['d']); // { a: 1, b: { c: 2 } }
const selected = pick(original, ['a', 'b']); // { a: 1, b: { c: 2 } }
const empty = isEmpty({}); // true
```

### URL and Query Utilities

```typescript
// URL and query string utilities
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
};

export const parseQueryString = (search: string): Record<string, string | string[]> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string | string[]> = {};
  
  params.forEach((value, key) => {
    if (result[key]) {
      const existing = result[key];
      result[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      result[key] = value;
    }
  });
  
  return result;
};

export const buildApiUrl = (baseUrl: string, path: string, params?: Record<string, any>): string => {
  const url = new URL(path, baseUrl);
  
  if (params) {
    const queryString = buildQueryString(params);
    if (queryString) {
      url.search = queryString;
    }
  }
  
  return url.toString();
};

// Usage examples
const query = buildQueryString({ page: 1, limit: 10, tags: ['ai', 'ml'] }); 
// "page=1&limit=10&tags=ai&tags=ml"

const parsed = parseQueryString('?page=1&limit=10&tags=ai&tags=ml');
// { page: '1', limit: '10', tags: ['ai', 'ml'] }

const apiUrl = buildApiUrl('https://api.example.com', '/users', { active: true });
// "https://api.example.com/users?active=true"
```

### Storage Utilities

```typescript
// Local storage utilities with type safety
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  clear: (): void => {
    localStorage.clear();
  }
};

// Session storage utilities
export const sessionStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    window.sessionStorage.removeItem(key);
  }
};

// Usage examples
interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
}

const prefs = storage.get<UserPreferences>('user-preferences', { 
  theme: 'light', 
  language: 'en' 
});

storage.set('user-preferences', { theme: 'dark', language: 'en' });
```

### Async Utilities

```typescript
// Promise and async utilities
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Operation timed out')), ms)
    )
  ]);
};

export const retry = async <T>(
  fn: () => Promise<T>, 
  attempts: number = 3, 
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < attempts - 1) {
        await delay(delayMs * Math.pow(2, i)); // Exponential backoff
      }
    }
  }
  
  throw lastError!;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  }) as T;
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

// Usage examples
await delay(1000); // Wait 1 second

const result = await timeout(apiCall(), 5000); // Timeout after 5 seconds

const data = await retry(() => fetchData(), 3, 1000); // Retry 3 times with backoff

const debouncedSearch = debounce(search, 300); // Debounce search by 300ms
const throttledScroll = throttle(onScroll, 100); // Throttle scroll to 100ms
```

## 📚 Related Documentation

- [🔒 Security](../security/README.md) - Security implementation using these utilities
- [🧩 Components](../components/README.md) - Components using utility functions
- [🌐 Services](../services/README.md) - Services leveraging utilities
- [📄 Types](../types/README.md) - Type definitions for utilities

---

For utility-related questions, adding new helper functions, or optimization suggestions, refer to the specific utility files or create an issue in the repository.