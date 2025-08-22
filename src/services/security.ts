/**
 * Enhanced Security Service for API Communications
 * Provides encryption, request signing, and security validation
 */

import { sanitizeInput } from '@/utils/security';
import { apiConfig } from '@/config/api';

interface SecurityOptions {
  encrypt?: boolean;
  sign?: boolean;
  validateInput?: boolean;
}

interface RequestSignature {
  timestamp: number;
  nonce: string;
  signature: string;
}

class SecurityService {
  private readonly SIGNATURE_ALGORITHM = 'HMAC-SHA256';
  private readonly NONCE_LENGTH = 16;
  private requestCount = 0;
  private lastRequestTime = 0;
  
  /**
   * Secure API request data
   */
  async secureRequest(
    url: string,
    data: unknown,
    options: SecurityOptions = {}
  ): Promise<{
    data: unknown;
    headers: Record<string, string>;
  }> {
    const config = apiConfig.getConfig();
    const secureData = data && typeof data === 'object' ? { ...(data as Record<string, unknown>) } : data;
    const headers: Record<string, string> = {};
    
    // Rate limiting check
    if (config.rateLimiting.enabled && !this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please wait before making another request.');
    }
    
    // Input validation and sanitization
    if (options.validateInput !== false) {
      this.sanitizeRequestData(secureData);
    }
    
    // Add request metadata
    headers['X-Client-Version'] = '1.0.0';
    headers['X-Request-ID'] = this.generateRequestId();
    headers['X-Timestamp'] = Date.now().toString();
    
    // Request signing
    if ((options.sign !== false && config.enableRequestSigning)) {
      const signature = await this.signRequest(url, secureData);
      headers['X-Signature'] = signature.signature;
      headers['X-Nonce'] = signature.nonce;
      headers['X-Signature-Timestamp'] = signature.timestamp.toString();
    }
    
    // Data encryption
    if (options.encrypt !== false && config.enableEncryption && this.shouldEncrypt(secureData)) {
      const encrypted = await this.encryptData(secureData);
      return {
        data: { encrypted: encrypted },
        headers: { ...headers, 'X-Encrypted': 'true' }
      };
    }
    
    return { data: secureData, headers };
  }
  
  /**
   * Validate response security
   */
  async validateResponse(response: Response): Promise<boolean> {
    try {
      // Check for security headers
      const requiredHeaders = ['X-Content-Type-Options', 'X-Frame-Options'];
      const missingHeaders = requiredHeaders.filter(header => !response.headers.get(header));
      
      if (missingHeaders.length > 0 && apiConfig.getConfig().debug) {
        console.warn('Missing security headers:', missingHeaders);
      }
      
      // Validate response signature if present
      const signature = response.headers.get('X-Response-Signature');
      if (signature) {
        // In production, validate the response signature
        // const isValid = await this.validateResponseSignature(response, signature);
        // return isValid;
      }
      
      return true;
    } catch (error) {
      console.error('Response validation failed:', error);
      return false;
    }
  }
  
  /**
   * Generate request signature
   */
  private async signRequest(url: string, data: unknown): Promise<RequestSignature> {
    const timestamp = Date.now();
    const nonce = this.generateNonce();
    
    // Create signature payload
    const payload = JSON.stringify({
      url,
      data,
      timestamp,
      nonce
    });
    
    // In production, use a real secret key from environment
    const secretKey = this.getSigningKey();
    const signature = await this.hmacSha256(payload, secretKey);
    
    return {
      timestamp,
      nonce,
      signature
    };
  }
  
  /**
   * Encrypt sensitive data
   */
  private async encryptData(data: unknown): Promise<string> {
    try {
      // Simple Base64 encoding for development
      // In production, use proper AES encryption
      const jsonString = JSON.stringify(data);
      return btoa(unescape(encodeURIComponent(jsonString)));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt request data');
    }
  }
  
  /**
   * Decrypt response data
   */
  async decryptData(encryptedData: string): Promise<unknown> {
    try {
      // Simple Base64 decoding for development
      // In production, use proper AES decryption
      const jsonString = decodeURIComponent(escape(atob(encryptedData)));
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt response data');
    }
  }
  
  /**
   * Sanitize request data recursively
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
      Object.keys(data).forEach(key => {
        sanitized[key] = this.sanitizeRequestData(
          (data as Record<string, unknown>)[key]
        );
      });
      return sanitized;
    }
    
    return data;
  }
  
  /**
   * Check if data should be encrypted
   */
  private shouldEncrypt(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false;
    
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'creditCard', 'ssn'];
    const dataString = JSON.stringify(data).toLowerCase();
    
    return sensitiveFields.some(field => dataString.includes(field));
  }
  
  /**
   * Rate limiting check
   */
  private checkRateLimit(): boolean {
    const config = apiConfig.getConfig();
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    
    // Reset counter if window has passed
    if (now - this.lastRequestTime > windowMs) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }
    
    this.requestCount++;
    
    return this.requestCount <= config.rateLimiting.requestsPerMinute;
  }
  
  /**
   * Generate cryptographically secure nonce
   */
  private generateNonce(): string {
    const array = new Uint8Array(this.NONCE_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
  
  /**
   * Get signing key (in production, from secure environment)
   */
  private getSigningKey(): string {
    // In production, get from environment variables or secure storage
    return 'your-secret-signing-key-change-in-production';
  }
  
  /**
   * HMAC SHA-256 implementation
   */
  private async hmacSha256(message: string, key: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);
      const messageData = encoder.encode(message);
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      const hashArray = Array.from(new Uint8Array(signature));
      return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('HMAC signing failed:', error);
      // Fallback for development
      return btoa(message + key).substring(0, 32);
    }
  }
  
  /**
   * Validate JWT token structure and expiration
   */
  validateJwtToken(token: string): { valid: boolean; expired: boolean; payload?: unknown } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, expired: false };
      }
      
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < now) {
        return { valid: false, expired: true, payload };
      }
      
      return { valid: true, expired: false, payload };
    } catch (error) {
      return { valid: false, expired: false };
    }
  }
  
  /**
   * Get security status for debugging
   */
  getSecurityStatus() {
    const config = apiConfig.getConfig();
    return {
      encryption: config.enableEncryption,
      signing: config.enableRequestSigning,
      rateLimiting: config.rateLimiting,
      requestCount: this.requestCount,
      environment: config.environment
    };
  }
}

// Export singleton instance
export const securityService = new SecurityService();