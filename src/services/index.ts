/**
 * Unified Service Layer - All API Services Consolidated
 * Single point of access for all backend communications
 */

import { apiClient, ApiError } from './api';
import { notificationAPI } from './notificationApi';
import { authService } from '@/security/auth';
import { mongoService } from './database/mongodb';
import { securityService } from './security';
import { apiConfig } from '@/config/api';
import type { ApiConfig, ApiEndpoints } from '@/config/api';
import type { User, AuthCredentials, AuthResponse } from '@/security/types';
import type { NotificationRequest } from './notificationApi';
import type { DatabaseConfig, UserDocument } from './database/config';

/**
 * Unified Service Manager - Central hub for all API operations
 */
class ServiceManager {
  // Authentication Services
  public auth = {
    login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
      return authService.authenticate(credentials);
    },
    
    logout: (): void => {
      authService.logout();
    },
    
    restoreSession: async (): Promise<{ user: User | null; isValid: boolean }> => {
      return authService.restoreSession();
    },
    
    extendSession: (): boolean => {
      return authService.extendSession();
    },
    
    isSessionValid: (): boolean => {
      return authService.isSessionValid();
    },
    
    refreshToken: async (): Promise<boolean> => {
      return authService.refreshCurrentToken();
    }
  };

  // User Management Services
  public users = {
    getProfile: async (): Promise<User> => {
      const endpoint = apiConfig.getEndpoint('users', 'profile');
      return apiClient.get<User>(endpoint);
    },
    
    updateProfile: async (userData: Partial<User>): Promise<User> => {
      const endpoint = apiConfig.getEndpoint('users', 'profile');
      return apiClient.put<User>(endpoint, userData);
    },
    
    listUsers: async (): Promise<User[]> => {
      const endpoint = apiConfig.getEndpoint('users', 'list');
      return apiClient.get<User[]>(endpoint);
    },
    
    deleteUser: async (userId: string): Promise<void> => {
      const endpoint = apiConfig.getEndpoint('users', 'delete', { id: userId });
      return apiClient.delete<void>(endpoint);
    }
  };

  // Notification Services
  public notifications = {
    list: async (): Promise<NotificationRequest[]> => {
      const endpoint = apiConfig.getEndpoint('notifications', 'list');
      return apiClient.get<NotificationRequest[]>(endpoint);
    },
    
    create: async (notification: NotificationRequest): Promise<void> => {
      const endpoint = apiConfig.getEndpoint('notifications', 'create');
      return apiClient.post<void>(endpoint, notification);
    },
    
    markAsRead: async (notificationId: string): Promise<void> => {
      const endpoint = apiConfig.getEndpoint('notifications', 'markRead', { id: notificationId });
      return apiClient.put<void>(endpoint, {});
    },
    
    delete: async (notificationId: string): Promise<void> => {
      const endpoint = apiConfig.getEndpoint('notifications', 'delete', { id: notificationId });
      return apiClient.delete<void>(endpoint);
    },
    
    // Local notification methods
    add: (message: string, type?: NotificationRequest['type']) => {
      notificationAPI.addNotification(message, type);
    },
    
    success: (message: string) => notificationAPI.success(message),
    error: (message: string) => notificationAPI.error(message),
    warning: (message: string) => notificationAPI.warning(message),
    info: (message: string) => notificationAPI.info(message)
  };

  // Database Services
  public database = {
    configure: (databaseName: string, collectionName: string): void => {
      mongoService.setConfig(databaseName, collectionName);
    },
    
    testConnection: async (): Promise<{ success: boolean; message: string }> => {
      return mongoService.testConnection();
    },
    
    isConfigured: (): boolean => {
      return mongoService.isConfigured();
    },
    
    getConfig: (): DatabaseConfig | null => {
      return mongoService.loadConfig();
    },
    
    authenticateUser: async (email: string, password: string): Promise<UserDocument | null> => {
      return mongoService.authenticateUser(email, password);
    },
    
    createUser: async (userData: Omit<UserDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<UserDocument | null> => {
      return mongoService.createUser(userData);
    }
  };

  // File Upload Services
  public files = {
    upload: async (file: File, onProgress?: (progress: number) => void): Promise<{ url: string; id: string }> => {
      const endpoint = '/api/files/upload';
      return apiClient.upload<{ url: string; id: string }>(endpoint, file, onProgress);
    },
    
    delete: async (fileId: string): Promise<void> => {
      const endpoint = `/api/files/${fileId}`;
      return apiClient.delete<void>(endpoint);
    }
  };

  // Microservice Management
  public microservices = {
    list: async (): Promise<Array<{ id: string; name: string; status: string }>> => {
      const endpoint = apiConfig.getEndpoint('microservices', 'list');
      return apiClient.get<Array<{ id: string; name: string; status: string }>>(endpoint);
    },
    
    getStatus: async (serviceId: string): Promise<{ status: string; health: string }> => {
      const endpoint = apiConfig.getEndpoint('microservices', 'status', { id: serviceId });
      return apiClient.get<{ status: string; health: string }>(endpoint);
    },
    
    deploy: async (serviceId: string): Promise<{ success: boolean; deploymentId: string }> => {
      const endpoint = apiConfig.getEndpoint('microservices', 'deploy', { id: serviceId });
      return apiClient.post<{ success: boolean; deploymentId: string }>(endpoint, {});
    }
  };

  // Configuration Management
  public config = {
    // API Configuration
    getApiConfig: (): ApiConfig => {
      return apiConfig.getConfig();
    },
    
    updateApiConfig: (config: Partial<ApiConfig>): void => {
      apiConfig.updateConfig(config);
    },
    
    getEndpoints: (): ApiEndpoints => {
      return apiConfig.getEndpoints();
    },
    
    updateEndpoints: (endpoints: Partial<ApiEndpoints>): void => {
      apiConfig.updateEndpoints(endpoints);
    },
    
    setEnvironment: (env: 'development' | 'staging' | 'production'): void => {
      apiConfig.setEnvironment(env);
    },
    
    resetToDefaults: (): void => {
      apiConfig.resetToDefaults();
    },
    
    getConfigSummary: () => {
      return apiConfig.getConfigSummary();
    }
  };

  // Health Check & Monitoring
  public health = {
    checkApiHealth: async (): Promise<{ status: string; services: Record<string, boolean> }> => {
      try {
        const config = apiConfig.getConfig();
        const endpoint = `${config.baseUrl}/api/health`;
        
        const response = await apiClient.get<{ status: string; services: Record<string, boolean> }>(endpoint);
        return response;
      } catch (error) {
        return {
          status: 'degraded',
          services: {
            api: false,
            database: mongoService.isConfigured(),
            auth: authService.isSessionValid()
          }
        };
      }
    },
    
    getServiceStatus: () => {
      return {
        api: true, // Assume API is available if we can make requests
        database: mongoService.isConfigured(),
        auth: authService.isSessionValid(),
        security: securityService.getSecurityStatus()
      };
    }
  };

  // Utility Methods
  public utils = {
    // Test all services
    testAllServices: async (): Promise<Record<string, boolean>> => {
      const results: Record<string, boolean> = {};
      
      try {
        // Test database
        const dbTest = await this.database.testConnection();
        results.database = dbTest.success;
      } catch {
        results.database = false;
      }
      
      try {
        // Test API health
        const healthCheck = await this.health.checkApiHealth();
        results.api = healthCheck.status === 'healthy';
      } catch {
        results.api = false;
      }
      
      results.auth = authService.isSessionValid();
      
      return results;
    },
    
    // Clear all stored data
    clearAllData: (): void => {
      authService.logout();
      mongoService.loadConfig(); // This will clear if needed
      apiConfig.resetToDefaults();
      localStorage.removeItem('notifications');
    },
    
    // Export configuration for backup
    exportConfiguration: () => {
      return {
        api: apiConfig.getConfig(),
        endpoints: apiConfig.getEndpoints(),
        database: mongoService.getConfigInfo(),
        timestamp: new Date().toISOString()
      };
    },
    
    // Import configuration from backup
    importConfiguration: (configData: any): void => {
      try {
        if (configData.api) {
          apiConfig.updateConfig(configData.api);
        }
        if (configData.endpoints) {
          apiConfig.updateEndpoints(configData.endpoints);
        }
        if (configData.database?.database && configData.database?.collection) {
          mongoService.setConfig(configData.database.database, configData.database.collection);
        }
        this.notifications.success('Configuration imported successfully');
      } catch (error) {
        this.notifications.error('Failed to import configuration');
        throw error;
      }
    }
  };
}

// Export singleton instance
export const services = new ServiceManager();

// Export individual services for backward compatibility
export { apiClient, notificationAPI, authService, mongoService, securityService, apiConfig };

// Export types
export type { ApiConfig, ApiEndpoints, User, AuthCredentials, AuthResponse, NotificationRequest, DatabaseConfig, UserDocument };

// Default export
export default services;