// Production Database Configuration
// Simplified configuration for easy deployment

export interface DatabaseConfig {
  databaseName: string;
  collectionName: string;
  connectionString?: string; // Optional - can be set via environment
}

export interface UserDocument {
  _id?: string;
  email: string;
  password?: string; // Should be hashed in production
  name: string;
  role?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

class DatabaseConfigManager {
  private config: DatabaseConfig | null = null;
  private readonly STORAGE_KEY = 'database_config';

  /**
   * Set database configuration
   * Only requires database name and collection name for simplicity
   */
  setConfig(databaseName: string, collectionName: string, connectionString?: string): void {
    this.config = {
      databaseName: databaseName.trim(),
      collectionName: collectionName.trim(),
      connectionString: connectionString?.trim()
    };

    // Persist configuration
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      console.log('✅ Database configuration saved:', {
        database: this.config.databaseName,
        collection: this.config.collectionName
      });
    } catch (error) {
      console.error('Failed to save database configuration:', error);
      throw new Error('Failed to save database configuration');
    }
  }

  /**
   * Load configuration from storage
   */
  loadConfig(): DatabaseConfig | null {
    if (this.config) {
      return this.config;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.config = JSON.parse(stored);
        return this.config;
      }
    } catch (error) {
      console.error('Failed to load database configuration:', error);
    }

    return null;
  }

  /**
   * Get current configuration
   */
  getConfig(): DatabaseConfig | null {
    return this.config || this.loadConfig();
  }

  /**
   * Check if database is configured
   */
  isConfigured(): boolean {
    const config = this.getConfig();
    return !!(config?.databaseName && config?.collectionName);
  }

  /**
   * Clear configuration
   */
  clearConfig(): void {
    this.config = null;
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🗑️ Database configuration cleared');
  }

  /**
   * Validate configuration
   */
  validateConfig(databaseName: string, collectionName: string): { valid: boolean; error?: string } {
    if (!databaseName?.trim()) {
      return { valid: false, error: 'Database name is required' };
    }

    if (!collectionName?.trim()) {
      return { valid: false, error: 'Collection name is required' };
    }

    // Check for valid database name (MongoDB naming rules)
    const dbNameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!dbNameRegex.test(databaseName.trim())) {
      return { valid: false, error: 'Database name can only contain letters, numbers, underscores, and hyphens' };
    }

    // Check for valid collection name
    const collectionNameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!collectionNameRegex.test(collectionName.trim())) {
      return { valid: false, error: 'Collection name can only contain letters, numbers, underscores, and hyphens' };
    }

    return { valid: true };
  }

  /**
   * Get connection info for debugging
   */
  getConnectionInfo(): { configured: boolean; database?: string; collection?: string } {
    const config = this.getConfig();
    return {
      configured: this.isConfigured(),
      database: config?.databaseName,
      collection: config?.collectionName
    };
  }
}

// Export singleton instance
export const dbConfig = new DatabaseConfigManager();