# 🔒 Security Directory

> Enterprise-grade security implementation and authentication

## 📁 Structure

```
src/security/
├── auth.ts        # Authentication logic and JWT handling
├── jwt.ts         # JWT token management utilities
├── session.ts     # Session management and timeout handling
└── types.ts       # Security-related TypeScript interfaces
```

## 🔐 Authentication System

### `auth.ts` - Core Authentication

Handles user authentication, login/logout flows, and security validation.

```typescript
// Key Features:
- JWT-based authentication
- Secure credential validation
- Login/logout management
- Token refresh mechanisms
- Security event logging
```

#### Authentication API:

```typescript
interface AuthService {
  // Authentication
  login(credentials: LoginCredentials): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
  
  // User management
  getCurrentUser(): Promise<User>;
  updateUserProfile(updates: Partial<User>): Promise<User>;
  
  // Security
  validateSession(): boolean;
  checkPermissions(resource: string, action: string): boolean;
  logSecurityEvent(event: SecurityEvent): void;
}
```

#### Usage Example:

```typescript
import { AuthService } from '@/security/auth';

const authService = new AuthService();

// Login flow
try {
  const result = await authService.login({
    email: 'user@example.com',
    password: 'securePassword'
  });
  
  if (result.success) {
    // Handle successful login
    localStorage.setItem('auth-token', result.token);
    navigate('/dashboard');
  }
} catch (error) {
  // Handle login error
  console.error('Authentication failed:', error);
}
```

#### Security Features:

- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Account Lockout**: Temporary lockout after failed attempts
- **Security Logging**: All auth events logged for audit
- **CSRF Protection**: Token-based request validation

### `jwt.ts` - Token Management

Comprehensive JWT token handling with security best practices.

```typescript
// Key Features:
- JWT creation and validation
- Token expiration handling
- Refresh token management
- Secure token storage
- Token revocation
```

#### JWT API:

```typescript
interface JWTService {
  // Token operations
  generateToken(payload: TokenPayload, expiresIn?: string): string;
  validateToken(token: string): Promise<TokenValidationResult>;
  refreshToken(refreshToken: string): Promise<string>;
  revokeToken(token: string): Promise<void>;
  
  // Token utilities
  decodeToken(token: string): DecodedToken | null;
  isTokenExpired(token: string): boolean;
  getTokenExpiration(token: string): Date | null;
}
```

#### Implementation:

```typescript
import { JWTService } from '@/security/jwt';

const jwtService = new JWTService({
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',
  refreshExpiresIn: '7d'
});

// Generate access token
const accessToken = jwtService.generateToken({
  userId: user.id,
  email: user.email,
  roles: user.roles
});

// Validate token
const validation = await jwtService.validateToken(token);
if (validation.valid) {
  // Token is valid, proceed
  const user = validation.payload;
} else {
  // Token invalid, require re-authentication
  redirectToLogin();
}
```

#### Security Considerations:

- **Short-lived Tokens**: Access tokens expire in 1 hour
- **Refresh Strategy**: Automatic refresh before expiration
- **Secure Storage**: HttpOnly cookies for refresh tokens
- **Token Revocation**: Blacklist for compromised tokens
- **Signature Verification**: RS256 algorithm for production

### `session.ts` - Session Management

Manages user sessions with timeout handling and security monitoring.

```typescript
// Key Features:
- Session lifecycle management
- Automatic timeout handling
- Activity tracking
- Multi-tab synchronization
- Security monitoring
```

#### Session API:

```typescript
interface SessionService {
  // Session management
  createSession(user: User): Promise<Session>;
  validateSession(sessionId: string): Promise<boolean>;
  extendSession(sessionId: string): Promise<void>;
  endSession(sessionId: string): Promise<void>;
  
  // Activity tracking
  updateLastActivity(sessionId: string): void;
  getSessionActivity(sessionId: string): ActivityLog[];
  
  // Security monitoring
  detectAnomalousActivity(sessionId: string): SecurityAlert[];
  logSecurityEvent(event: SecurityEvent): void;
}
```

#### Session Configuration:

```typescript
const SESSION_CONFIG = {
  // Timeout settings
  timeout: 30 * 60 * 1000,        // 30 minutes
  warningTime: 5 * 60 * 1000,     // 5 minutes warning
  maxIdleTime: 60 * 60 * 1000,    // 1 hour max idle
  
  // Security settings
  maxConcurrentSessions: 3,        // Max sessions per user
  sessionRotation: true,           // Rotate session IDs
  secureTransport: true,           // HTTPS only
  
  // Monitoring
  logActivity: true,               // Log user activity
  detectAnomalies: true,           // Monitor for suspicious behavior
  alertThresholds: {
    failedLogins: 5,
    rapidRequests: 100
  }
};
```

#### Usage with React Context:

```typescript
import { useSession } from '@/hooks/useSessionState';

const App = () => {
  const {
    sessionActive,
    sessionTimeLeft,
    isSessionExpiring,
    extendSession,
    endSession
  } = useSession();
  
  return (
    <>
      {isSessionExpiring && (
        <SessionTimeoutModal
          timeLeft={sessionTimeLeft}
          onExtend={extendSession}
          onLogout={endSession}
        />
      )}
      {/* App content */}
    </>
  );
};
```

## 🛡️ Security Utilities

### Input Sanitization

```typescript
import { sanitizeInput, sanitizeHtml } from '@/utils/security';

// Sanitize user input
const cleanInput = sanitizeInput(userInput, {
  allowedTags: [],
  allowedAttributes: {},
  stripTags: true
});

// Sanitize HTML content
const cleanHtml = sanitizeHtml(htmlContent, {
  allowedTags: ['p', 'br', 'strong', 'em'],
  allowedAttributes: {
    'a': ['href']
  }
});
```

### Request Security

```typescript
// Secure API request wrapper
const secureRequest = async (url: string, options: RequestOptions) => {
  // Add CSRF token
  const csrfToken = await getCSRFToken();
  
  // Add authentication
  const token = getAuthToken();
  
  // Rate limiting check
  if (!checkRateLimit(url)) {
    throw new Error('Rate limit exceeded');
  }
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    }
  });
};
```

### Data Encryption

```typescript
// Client-side encryption for sensitive data
import { encrypt, decrypt } from '@/security/encryption';

// Encrypt sensitive data before storage
const encryptedData = encrypt(sensitiveData, encryptionKey);
localStorage.setItem('encrypted-data', encryptedData);

// Decrypt when retrieving
const retrievedData = localStorage.getItem('encrypted-data');
const decryptedData = decrypt(retrievedData, encryptionKey);
```

## 🔒 Security Types

### `types.ts` - Security Interfaces

Comprehensive TypeScript interfaces for security-related data structures.

```typescript
// Authentication types
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: User;
  error?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: Permission[];
  lastLogin: Date;
  sessionId?: string;
}

// JWT types
interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

interface DecodedToken {
  payload: TokenPayload;
  header: JWTHeader;
  signature: string;
}

// Session types
interface Session {
  id: string;
  userId: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  active: boolean;
}

// Security events
interface SecurityEvent {
  type: 'login' | 'logout' | 'token_refresh' | 'failed_login' | 'suspicious_activity';
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
}

// Permissions
interface Permission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}
```

## 🚨 Security Monitoring

### Security Event Logging

```typescript
// Security event tracking
class SecurityMonitor {
  logEvent(event: SecurityEvent): void {
    // Log to secure storage
    this.writeToSecurityLog(event);
    
    // Check for suspicious patterns
    this.analyzeSecurityPattern(event);
    
    // Alert if necessary
    if (this.isSuspiciousEvent(event)) {
      this.triggerSecurityAlert(event);
    }
  }
  
  analyzeSecurityPattern(event: SecurityEvent): void {
    // Pattern analysis for anomaly detection
    const recentEvents = this.getRecentEvents(event.userId, '1h');
    
    // Multiple failed logins
    const failedLogins = recentEvents.filter(e => e.type === 'failed_login');
    if (failedLogins.length > 5) {
      this.lockAccount(event.userId);
    }
    
    // Unusual access patterns
    const locations = new Set(recentEvents.map(e => e.ipAddress));
    if (locations.size > 3) {
      this.flagSuspiciousActivity(event.userId);
    }
  }
}
```

### Real-time Security Alerts

```typescript
// Security alert system
interface SecurityAlert {
  id: string;
  type: 'account_lockout' | 'suspicious_login' | 'token_theft' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

const securityAlerts = new EventEmitter();

// Listen for security alerts
securityAlerts.on('alert', (alert: SecurityAlert) => {
  // Notify administrators
  notifySecurityTeam(alert);
  
  // Take automatic action if critical
  if (alert.severity === 'critical') {
    takeEmergencyAction(alert);
  }
  
  // Log alert
  logSecurityAlert(alert);
});
```

## 🔧 Security Configuration

### Environment-based Security

```typescript
// Security configuration per environment
const SECURITY_CONFIG = {
  development: {
    jwtSecret: 'dev-secret-key',
    sessionTimeout: 60 * 60 * 1000,    // 1 hour
    httpsOnly: false,
    corsEnabled: true,
    debugMode: true
  },
  production: {
    jwtSecret: process.env.JWT_SECRET,
    sessionTimeout: 30 * 60 * 1000,    // 30 minutes
    httpsOnly: true,
    corsEnabled: false,
    debugMode: false,
    rateLimiting: {
      windowMs: 15 * 60 * 1000,        // 15 minutes
      max: 100                         // requests per window
    }
  }
};
```

### Security Headers

```typescript
// Security headers configuration
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

## 🧪 Security Testing

### Authentication Testing

```typescript
import { AuthService } from '@/security/auth';

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    authService = new AuthService();
  });
  
  it('authenticates valid credentials', async () => {
    const result = await authService.login({
      email: 'test@example.com',
      password: 'validPassword'
    });
    
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });
  
  it('rejects invalid credentials', async () => {
    const result = await authService.login({
      email: 'test@example.com',
      password: 'wrongPassword'
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
  
  it('handles token refresh', async () => {
    const newToken = await authService.refreshToken();
    expect(newToken).toBeDefined();
  });
});
```

### Security Integration Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { SecurityProvider } from '@/contexts/SecurityContext';
import LoginForm from '@/components/LoginForm';

describe('Security Integration', () => {
  it('prevents XSS attacks', async () => {
    const maliciousInput = '<script>alert("xss")</script>';
    
    render(
      <SecurityProvider>
        <LoginForm />
      </SecurityProvider>
    );
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: maliciousInput } });
    
    // Verify input is sanitized
    expect(emailInput.value).not.toContain('<script>');
  });
  
  it('enforces rate limiting', async () => {
    // Test rate limiting implementation
  });
});
```

## 📚 Related Documentation

- [🌐 Contexts](../contexts/README.md) - AuthContext implementation
- [🪝 Hooks](../hooks/README.md) - Security-related hooks
- [🔧 Config](../config/README.md) - Security configuration
- [🌐 Services](../services/README.md) - Secure API integration

---

For security questions, vulnerability reports, or security feature requests, please follow responsible disclosure practices and contact the security team.