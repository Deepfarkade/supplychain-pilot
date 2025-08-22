/**
 * Centralized API Configuration System
 * All backend API endpoints and configurations in one place
 */

export interface ApiEndpoints {
  // Authentication endpoints
  auth: {
    login: string;
    logout: string;
    register: string;
    refresh: string;
    validateToken: string;
  };
  
  // User management
  users: {
    profile: string;
    update: string;
    list: string;
    delete: string;
  };
  
  // Notifications
  notifications: {
    list: string;
    create: string;
    markRead: string;
    delete: string;
  };
  
  // Database operations
  database: {
    test: string;
    connect: string;
    authenticate: string;
  };
  
  // Microservices
  microservices: {
    list: string;
    status: string;
    deploy: string;
  };
}

export interface ApiConfig {
  // Base configuration
  baseUrl: string;
  timeout: number;
  retries: number;
  
  // Security settings
  apiKey?: string;
  enableEncryption: boolean;
  enableRequestSigning: boolean;
  
  // Environment settings
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
  
  // Rate limiting
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
  };
}

class ApiConfigurationManager {
  private config: ApiConfig;
  private endpoints: ApiEndpoints;
  private readonly CONFIG_STORAGE_KEY = 'api_configuration';
  
  constructor() {
    // Default configuration
    this.config = {
      baseUrl: this.getDefaultBaseUrl(),
      timeout: 10000,
      retries: 3,
      enableEncryption: true,
      enableRequestSigning: true,
      environment: 'development',
      debug: true,
      rateLimiting: {
        enabled: true,
        requestsPerMinute: 100
      }
    };
    
    // Default endpoints - MODIFY THESE FOR YOUR BACKEND
    this.endpoints = {
      auth: {
        login: '/api/auth/login',
        logout: '/api/auth/logout', 
        register: '/api/auth/register',
        refresh: '/api/auth/refresh',
        validateToken: '/api/auth/validate'
      },
      users: {
        profile: '/api/users/profile',
        update: '/api/users/profile',
        list: '/api/users',
        delete: '/api/users/:id'
      },
      notifications: {
        list: '/api/notifications',
        create: '/api/notifications',
        markRead: '/api/notifications/:id/read',
        delete: '/api/notifications/:id'
      },
      database: {
        test: '/api/database/test',
        connect: '/api/database/connect',
        authenticate: '/api/database/auth'
      },
      microservices: {
        list: '/api/microservices',
        status: '/api/microservices/:id/status',
        deploy: '/api/microservices/:id/deploy'
      }
    };
    
    // Load saved configuration
    this.loadConfiguration();
  }
  
  /**
   * Get default base URL based on environment
   */
  private getDefaultBaseUrl(): string {
    if (typeof window !== 'undefined') {
      // Browser environment
      const { protocol, hostname, port } = window.location;
      
      // If running on localhost, use local backend
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `${protocol}//${hostname}:3001`; // Your backend port
      }
      
      // Production or deployed environment
      return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    }
    
    // Default fallback
    return 'http://localhost:3001';
  }
  
  /**
   * Update API configuration
   */
  updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfiguration();
    console.log('✅ API configuration updated:', this.config);
  }
  
  /**
   * Update API endpoints
   */
  updateEndpoints(newEndpoints: Partial<ApiEndpoints>): void {
    this.endpoints = { ...this.endpoints, ...newEndpoints };
    this.saveConfiguration();
    console.log('✅ API endpoints updated');
  }
  
  /**
   * Get current configuration
   */
  getConfig(): ApiConfig {
    return { ...this.config };
  }
  
  /**
   * Get all endpoints
   */
  getEndpoints(): ApiEndpoints {
    return { ...this.endpoints };
  }
  
  /**
   * Get specific endpoint with parameter substitution
   */
  getEndpoint(category: keyof ApiEndpoints, endpoint: string, params?: Record<string, string>): string {
    const endpoints = this.endpoints[category] as Record<string, string>;
    let url = endpoints[endpoint];
    
    if (!url) {
      throw new Error(`Endpoint not found: ${category}.${endpoint}`);
    }
    
    // Substitute parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, encodeURIComponent(value));
      });
    }
    
    return `${this.config.baseUrl}${url}`;
  }
  
  /**
   * Set environment-specific configuration
   */
  setEnvironment(env: 'development' | 'staging' | 'production'): void {
    const envConfigs = {
      development: {
        debug: true,
        enableEncryption: false,
        rateLimiting: { enabled: false, requestsPerMinute: 1000 }
      },
      staging: {
        debug: true,
        enableEncryption: true,
        rateLimiting: { enabled: true, requestsPerMinute: 200 }
      },
      production: {
        debug: false,
        enableEncryption: true,
        rateLimiting: { enabled: true, requestsPerMinute: 100 }
      }
    };
    
    this.updateConfig({
      environment: env,
      ...envConfigs[env]
    });
  }
  
  /**
   * Save configuration to localStorage
   */
  private saveConfiguration(): void {
    try {
      const configData = {
        config: this.config,
        endpoints: this.endpoints
      };
      localStorage.setItem(this.CONFIG_STORAGE_KEY, JSON.stringify(configData));
    } catch (error) {
      console.warn('Failed to save API configuration:', error);
    }
  }
  
  /**
   * Load configuration from localStorage
   */
  private loadConfiguration(): void {
    try {
      const stored = localStorage.getItem(this.CONFIG_STORAGE_KEY);
      if (stored) {
        const { config, endpoints } = JSON.parse(stored);
        if (config) this.config = { ...this.config, ...config };
        if (endpoints) this.endpoints = { ...this.endpoints, ...endpoints };
      }
    } catch (error) {
      console.warn('Failed to load API configuration:', error);
    }
  }
  
  /**
   * Reset to default configuration
   */
  resetToDefaults(): void {
    localStorage.removeItem(this.CONFIG_STORAGE_KEY);
    this.config = {
      baseUrl: this.getDefaultBaseUrl(),
      timeout: 10000,
      retries: 3,
      enableEncryption: true,
      enableRequestSigning: true,
      environment: 'development',
      debug: true,
      rateLimiting: {
        enabled: true,
        requestsPerMinute: 100
      }
    };
    console.log('🔄 API configuration reset to defaults');
  }
  
  /**
   * Get configuration summary for debugging
   */
  getConfigSummary() {
    return {
      baseUrl: this.config.baseUrl,
      environment: this.config.environment,
      security: {
        encryption: this.config.enableEncryption,
        signing: this.config.enableRequestSigning
      },
      rateLimiting: this.config.rateLimiting
    };
  }
}

// Export singleton instance
export const apiConfig = new ApiConfigurationManager();

// Export types (already defined at top)
export { ApiConfigurationManager };