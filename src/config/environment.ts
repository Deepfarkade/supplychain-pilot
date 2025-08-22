/**
 * Environment Configuration System
 * Manages different deployment environments and their specific settings
 */

export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  name: Environment;
  apiBaseUrl: string;
  databaseUrl?: string;
  debug: boolean;
  enableLogging: boolean;
  features: {
    authentication: boolean;
    notifications: boolean;
    fileUploads: boolean;
    analytics: boolean;
  };
  security: {
    enableEncryption: boolean;
    enableRequestSigning: boolean;
    rateLimiting: boolean;
    corsEnabled: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    compressionEnabled: boolean;
    lazyLoadingEnabled: boolean;
  };
}

class EnvironmentManager {
  private currentEnvironment: Environment = 'development';
  private readonly STORAGE_KEY = 'app_environment';
  
  private readonly environments: Record<Environment, EnvironmentConfig> = {
    development: {
      name: 'development',
      apiBaseUrl: 'http://localhost:3001',
      debug: true,
      enableLogging: true,
      features: {
        authentication: true,
        notifications: true,
        fileUploads: true,
        analytics: false
      },
      security: {
        enableEncryption: false,
        enableRequestSigning: false,
        rateLimiting: false,
        corsEnabled: true
      },
      performance: {
        cacheEnabled: false,
        compressionEnabled: false,
        lazyLoadingEnabled: true
      }
    },
    
    staging: {
      name: 'staging',
      apiBaseUrl: 'https://staging-api.yourapp.com',
      debug: true,
      enableLogging: true,
      features: {
        authentication: true,
        notifications: true,
        fileUploads: true,
        analytics: true
      },
      security: {
        enableEncryption: true,
        enableRequestSigning: true,
        rateLimiting: true,
        corsEnabled: true
      },
      performance: {
        cacheEnabled: true,
        compressionEnabled: true,
        lazyLoadingEnabled: true
      }
    },
    
    production: {
      name: 'production',
      apiBaseUrl: 'https://api.yourapp.com',
      debug: false,
      enableLogging: false,
      features: {
        authentication: true,
        notifications: true,
        fileUploads: true,
        analytics: true
      },
      security: {
        enableEncryption: true,
        enableRequestSigning: true,
        rateLimiting: true,
        corsEnabled: false
      },
      performance: {
        cacheEnabled: true,
        compressionEnabled: true,
        lazyLoadingEnabled: true
      }
    }
  };
  
  constructor() {
    this.loadEnvironment();
  }
  
  /**
   * Set current environment
   */
  setEnvironment(env: Environment): void {
    this.currentEnvironment = env;
    this.saveEnvironment();
    console.log(`🌍 Environment set to: ${env}`);
  }
  
  /**
   * Get current environment configuration
   */
  getCurrentConfig(): EnvironmentConfig {
    return { ...this.environments[this.currentEnvironment] };
  }
  
  /**
   * Get current environment name
   */
  getCurrentEnvironment(): Environment {
    return this.currentEnvironment;
  }
  
  /**
   * Check if feature is enabled in current environment
   */
  isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
    return this.environments[this.currentEnvironment].features[feature];
  }
  
  /**
   * Check if security feature is enabled
   */
  isSecurityEnabled(feature: keyof EnvironmentConfig['security']): boolean {
    return this.environments[this.currentEnvironment].security[feature];
  }
  
  /**
   * Check if performance feature is enabled
   */
  isPerformanceEnabled(feature: keyof EnvironmentConfig['performance']): boolean {
    return this.environments[this.currentEnvironment].performance[feature];
  }
  
  /**
   * Update environment configuration
   */
  updateEnvironmentConfig(env: Environment, config: Partial<EnvironmentConfig>): void {
    this.environments[env] = { ...this.environments[env], ...config };
    if (env === this.currentEnvironment) {
      this.saveEnvironment();
    }
  }
  
  /**
   * Get API base URL for current environment
   */
  getApiBaseUrl(): string {
    return this.environments[this.currentEnvironment].apiBaseUrl;
  }
  
  /**
   * Auto-detect environment based on URL
   */
  autoDetectEnvironment(): Environment {
    if (typeof window === 'undefined') {
      return 'development';
    }
    
    const { hostname } = window.location;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
    
    if (hostname.includes('staging')) {
      return 'staging';
    }
    
    if (hostname.includes('yourapp.com')) {
      return 'production';
    }
    
    // Default to development for unknown domains
    return 'development';
  }
  
  /**
   * Initialize environment with auto-detection
   */
  initializeEnvironment(): void {
    const detected = this.autoDetectEnvironment();
    
    // Only auto-set if no environment was previously set
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.setEnvironment(detected);
    }
  }
  
  /**
   * Get environment-specific database configuration
   */
  getDatabaseConfig(): { url?: string; options: Record<string, unknown> } {
    const config = this.getCurrentConfig();
    
    return {
      url: config.databaseUrl,
      options: {
        timeout: config.name === 'production' ? 30000 : 10000,
        retryAttempts: config.name === 'production' ? 5 : 3,
        ssl: config.name === 'production'
      }
    };
  }
  
  /**
   * Get logging configuration
   */
  getLoggingConfig(): { enabled: boolean; level: string } {
    const config = this.getCurrentConfig();
    
    return {
      enabled: config.enableLogging,
      level: config.debug ? 'debug' : 'error'
    };
  }
  
  /**
   * Save environment to localStorage
   */
  private saveEnvironment(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, this.currentEnvironment);
    } catch (error) {
      console.warn('Failed to save environment setting:', error);
    }
  }
  
  /**
   * Load environment from localStorage
   */
  private loadEnvironment(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as Environment;
      if (saved && this.environments[saved]) {
        this.currentEnvironment = saved;
      } else {
        // Initialize with auto-detection
        this.initializeEnvironment();
      }
    } catch (error) {
      console.warn('Failed to load environment setting:', error);
      this.initializeEnvironment();
    }
  }
  
  /**
   * Get all available environments
   */
  getAvailableEnvironments(): Environment[] {
    return Object.keys(this.environments) as Environment[];
  }
  
  /**
   * Get environment comparison for debugging
   */
  getEnvironmentComparison(): Record<Environment, Partial<EnvironmentConfig>> {
    return Object.entries(this.environments).reduce((acc, [key, config]) => {
      acc[key as Environment] = {
        apiBaseUrl: config.apiBaseUrl,
        debug: config.debug,
        security: config.security,
        features: config.features
      };
      return acc;
    }, {} as Record<Environment, Partial<EnvironmentConfig>>);
  }
  
  /**
   * Reset to auto-detected environment
   */
  resetToAutoDetect(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeEnvironment();
  }
  
  /**
   * Get environment status for debugging
   */
  getEnvironmentStatus() {
    const config = this.getCurrentConfig();
    
    return {
      current: this.currentEnvironment,
      apiUrl: config.apiBaseUrl,
      debug: config.debug,
      features: Object.entries(config.features).filter(([, enabled]) => enabled).map(([name]) => name),
      security: Object.entries(config.security).filter(([, enabled]) => enabled).map(([name]) => name)
    };
  }
}

// Export singleton instance
export const environmentManager = new EnvironmentManager();

// Export environment manager class
export { EnvironmentManager };
export default environmentManager;