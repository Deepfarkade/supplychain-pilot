# ⚙️ Configuration Directory

> Centralized application configuration and environment management

## 📁 Structure

```
src/config/
├── api.ts                      # API endpoints and configurations
├── environment.ts              # Environment-specific settings
└── microservice-defaults.ts    # Default microservice configurations
```

## 📋 Configuration Files

### `api.ts` - API Configuration Hub

Central configuration for all API endpoints, security settings, and request configurations.

```typescript
// API endpoint configuration
export const API_CONFIG = {
  endpoints: {
    auth: '/api/auth',
    users: '/api/users',
    microservices: '/api/microservices'
  },
  security: {
    encryptionKey: 'your-encryption-key',
    requestSigning: true,
    rateLimiting: true
  },
  timeout: 30000,
  retries: 3
};
```

#### Key Features:
- **Centralized Endpoints**: All API URLs in one place
- **Security Configuration**: Encryption, signing, rate limiting
- **Request Settings**: Timeout, retries, headers
- **Environment Overrides**: Different configs per environment

### `environment.ts` - Environment Management

Handles environment-specific configurations and feature flags.

```typescript
// Environment configuration
export const ENV_CONFIG = {
  development: {
    apiBaseUrl: 'http://localhost:3000',
    debug: true,
    features: {
      analytics: false,
      errorReporting: false
    }
  },
  production: {
    apiBaseUrl: 'https://api.nexus-ai-hub.com',
    debug: false,
    features: {
      analytics: true,
      errorReporting: true
    }
  }
};
```

#### Environment Variables:
- `NODE_ENV`: Current environment (development/production)
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_AUTH_DOMAIN`: Authentication domain
- `VITE_MONGODB_CONNECTION`: Database connection string

### `microservice-defaults.ts` - Microservice Defaults

Production-optimized default settings for all microservices.

```typescript
// Default microservice configuration
export const DEFAULT_LAYOUT = {
  fullBleed: true,        // Maximum space utilization
  header: 'compact',      // Optimized header height
  padding: 'none',        // Minimal padding for embedded apps
  background: 'default'   // Default theme background
};

export const DEFAULT_SEO = {
  titleSuffix: ' - Nexus AI Hub',
  descriptionLength: 160,
  keywordDensity: 0.02
};
```

## 🔧 Configuration Usage

### API Configuration Usage

```typescript
import { ApiService } from '@/services/api';
import { API_CONFIG } from '@/config/api';

// Using centralized API config
const apiService = new ApiService(API_CONFIG);

// Making authenticated requests
const users = await apiService.get('/users');
```

### Environment Configuration Usage

```typescript
import { getCurrentEnvironment } from '@/config/environment';

const env = getCurrentEnvironment();

// Feature flagging
if (env.features.analytics) {
  // Enable analytics
}

// Debug logging
if (env.debug) {
  console.log('Debug information');
}
```

### Microservice Defaults Usage

```typescript
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { DEFAULT_LAYOUT } from '@/config/microservice-defaults';

// Uses defaults automatically
<MicroserviceShell title="Service Name">
  {/* Content */}
</MicroserviceShell>

// Override specific settings
<MicroserviceShell 
  title="Service Name"
  layout={{ ...DEFAULT_LAYOUT, padding: 'md' }}
>
  {/* Content */}
</MicroserviceShell>
```

## 🔐 Security Configuration

### API Security Settings

```typescript
// In api.ts
export const SECURITY_CONFIG = {
  // Request encryption
  encryption: {
    enabled: true,
    algorithm: 'AES-256-GCM',
    keyRotation: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  // Request signing
  signing: {
    enabled: true,
    algorithm: 'HMAC-SHA256',
    includeTimestamp: true
  },
  
  // Rate limiting
  rateLimiting: {
    requests: 100,
    window: 60 * 1000, // 1 minute
    blockDuration: 15 * 60 * 1000 // 15 minutes
  }
};
```

### Environment Security

```typescript
// In environment.ts
export const SECURITY_ENV = {
  development: {
    cors: ['http://localhost:5173'],
    https: false,
    sessionTimeout: 60 * 60 * 1000 // 1 hour
  },
  production: {
    cors: ['https://nexus-ai-hub.com'],
    https: true,
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
  }
};
```

## 📊 Configuration Management

### Adding New Configuration

1. **Identify Configuration Type**:
   - API-related → `api.ts`
   - Environment-specific → `environment.ts`
   - Microservice defaults → `microservice-defaults.ts`

2. **Follow Typing Pattern**:
```typescript
// Define interface first
interface NewConfigType {
  setting1: string;
  setting2: number;
  setting3: boolean;
}

// Export typed configuration
export const NEW_CONFIG: NewConfigType = {
  setting1: 'value',
  setting2: 42,
  setting3: true
};
```

3. **Add Environment Overrides**:
```typescript
// In environment.ts
export const getConfigForEnvironment = () => {
  const base = NEW_CONFIG;
  const env = getCurrentEnvironment();
  
  return {
    ...base,
    ...env.overrides?.newConfig
  };
};
```

### Configuration Validation

```typescript
import { z } from 'zod';

// Define schema
const apiConfigSchema = z.object({
  timeout: z.number().positive(),
  retries: z.number().min(0).max(5),
  endpoints: z.record(z.string().url())
});

// Validate configuration
export const validateApiConfig = (config: unknown) => {
  return apiConfigSchema.parse(config);
};
```

## 🔄 Runtime Configuration Updates

### Dynamic Configuration Loading

```typescript
// Configuration that can be updated at runtime
export class ConfigManager {
  private config: ApiConfig;
  
  constructor(initialConfig: ApiConfig) {
    this.config = initialConfig;
  }
  
  updateConfig(updates: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...updates };
  }
  
  getConfig(): ApiConfig {
    return this.config;
  }
}
```

### Configuration Persistence

```typescript
// Save configuration to localStorage
export const saveConfig = (config: Record<string, unknown>): void => {
  localStorage.setItem('app-config', JSON.stringify(config));
};

// Load configuration from localStorage
export const loadConfig = (): Record<string, unknown> | null => {
  const stored = localStorage.getItem('app-config');
  return stored ? JSON.parse(stored) : null;
};
```

## 📱 Frontend Configuration UI

Configuration can be modified through the Settings page:

- **API Settings**: `/settings` → API Settings tab
- **Database Config**: `/settings` → Database tab
- **Security Settings**: `/settings` → Security tab

### Configuration Forms

```typescript
// Example configuration form
const ConfigForm = () => {
  const [config, setConfig] = useState(API_CONFIG);
  
  const handleSave = async () => {
    await saveConfig(config);
    toast.success('Configuration saved');
  };
  
  return (
    <form onSubmit={handleSave}>
      {/* Configuration fields */}
    </form>
  );
};
```

## 🧪 Testing Configuration

### Unit Tests

```typescript
import { API_CONFIG } from './api';

describe('API Configuration', () => {
  it('has required endpoints', () => {
    expect(API_CONFIG.endpoints.auth).toBeDefined();
    expect(API_CONFIG.endpoints.users).toBeDefined();
  });
  
  it('has security settings', () => {
    expect(API_CONFIG.security.encryptionKey).toBeTruthy();
    expect(API_CONFIG.security.requestSigning).toBe(true);
  });
});
```

### Integration Tests

```typescript
import { getCurrentEnvironment } from './environment';

describe('Environment Configuration', () => {
  it('loads correct environment', () => {
    const env = getCurrentEnvironment();
    expect(env).toBeDefined();
    expect(env.apiBaseUrl).toBeTruthy();
  });
});
```

## 📚 Related Documentation

- [🔒 Security](../security/README.md) - Security implementation
- [🌐 Services](../services/README.md) - API service usage
- [🧩 Components](../components/README.md) - Component configuration
- [🔧 Utils](../utils/README.md) - Configuration utilities

---

For configuration questions or adding new settings, refer to the specific configuration files or create an issue in the repository.