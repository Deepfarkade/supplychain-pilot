/**
 * Centralized API client with security and error handling
 */

import { sanitizeInput } from '@/utils/security';
import { securityService } from './security';
import { apiConfig } from '@/config/api';

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

interface ApiError {
  code: string;
  message: string;
  status?: number;
  details?: unknown;
}

class ApiClient {
  private config: ApiConfig;
  
  constructor(config: Partial<ApiConfig> = {}) {
    // Use centralized configuration
    const centralizedConfig = apiConfig.getConfig();
    this.config = {
      baseUrl: centralizedConfig.baseUrl,
      timeout: centralizedConfig.timeout,
      retries: centralizedConfig.retries,
      ...config
    };
  }
  
  /**
   * Make authenticated request with timeout and retry logic
   */
  async request<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = this.config.timeout, retries = this.config.retries, ...fetchOptions } = options;
    
    // Use endpoint resolution if it's a relative path
    const url = endpoint.startsWith('http') ? endpoint : `${this.config.baseUrl}${endpoint}`;
    
    // Secure the request using security service
    const securedRequest = await securityService.secureRequest(url, fetchOptions.body);
    
    // Merge secured headers with default headers
    const headers = {
      'Content-Type': 'application/json',
      ...securedRequest.headers,
      ...fetchOptions.headers,
    };
    
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Use secured data
    fetchOptions.body = securedRequest.data ? JSON.stringify(securedRequest.data) : fetchOptions.body;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Validate response security
      await securityService.validateResponse(response);
      
      if (!response.ok) {
        throw new ApiError({
          code: 'HTTP_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        });
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as T;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new ApiError({
          code: 'TIMEOUT',
          message: 'Request timeout',
        });
      }
      
      if (retries > 0 && this.isRetryableError(error)) {
        await this.delay(1000);
        return this.request(endpoint, { ...options, retries: retries - 1 });
      }
      
      throw error;
    }
  }
  
  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  
  /**
   * POST request with input validation
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const sanitizedData = this.sanitizeRequestData(data);
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }
  
  /**
   * PUT request with input validation
   */
  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const sanitizedData = this.sanitizeRequestData(data);
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(sanitizedData),
    });
  }
  
  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
  
  /**
   * Upload file with progress tracking
   */
  async upload<T>(
    endpoint: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            resolve(xhr.responseText as T);
          }
        } else {
          reject(new ApiError({
            code: 'UPLOAD_ERROR',
            message: `Upload failed: ${xhr.statusText}`,
            status: xhr.status,
          }));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new ApiError({
          code: 'NETWORK_ERROR',
          message: 'Upload network error',
        }));
      });
      
      const url = `${this.config.baseUrl}${endpoint}`;
      xhr.open('POST', url);
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  }
  
  /**
   * Sanitize request data
   */
  private sanitizeRequestData(data: unknown): unknown {
    if (typeof data === 'string') {
      return sanitizeInput(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeRequestData(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: Record<string, unknown> = {};
      
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeRequestData(value);
      }
      
      return sanitized;
    }
    
    return data;
  }
  
  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.status ? error.status >= 500 : false;
    }
    
    return false;
  }
  
  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Custom error class
class ApiError extends Error {
  code: string;
  status?: number;
  details?: unknown;
  
  constructor({ code, message, status, details }: {
    code: string;
    message: string;
    status?: number;
    details?: unknown;
  }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export { ApiError, ApiClient };
export type { ApiConfig, RequestOptions };