// JWT Token Management for Production Security

import type { User, JWTPayload } from './types';

class JWTManager {
  private readonly SECRET_KEY = 'supply-chain-ai-studio-secret-key'; // In production: use environment variable
  private readonly TOKEN_PREFIX = 'Bearer ';
  private readonly STORAGE_KEY = 'auth_token';
  private readonly USER_STORAGE_KEY = 'user_data';

  // Generate JWT token (mock implementation - replace with backend in production)
  generateToken(user: User): string {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (20 * 60), // 20 minutes
      sessionId: this.generateSessionId()
    };

    // In production: use proper JWT library (jsonwebtoken)
    const tokenData = btoa(JSON.stringify(payload));
    return `${this.SECRET_KEY}.${tokenData}.${this.generateSignature(tokenData)}`;
  }

  // Validate JWT token
  validateToken(token: string): { valid: boolean; payload?: JWTPayload; expired?: boolean } {
    try {
      if (!token.startsWith(this.SECRET_KEY)) {
        return { valid: false };
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false };
      }

      const [, tokenData, signature] = parts;
      
      // Verify signature
      if (signature !== this.generateSignature(tokenData)) {
        return { valid: false };
      }

      const payload: JWTPayload = JSON.parse(atob(tokenData));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp < now) {
        return { valid: false, expired: true, payload };
      }

      return { valid: true, payload };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }

  // Check if token needs refresh (5 minutes before expiry)
  needsRefresh(token: string): boolean {
    const validation = this.validateToken(token);
    if (!validation.valid || !validation.payload) return false;

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = validation.payload.exp - now;
    const refreshThreshold = 5 * 60; // 5 minutes

    return timeUntilExpiry < refreshThreshold;
  }

  // Refresh token (mock implementation)
  refreshToken(currentToken: string): string | null {
    const validation = this.validateToken(currentToken);
    if (!validation.valid || !validation.payload) return null;

    const user: User = {
      id: validation.payload.sub,
      email: validation.payload.email,
      name: validation.payload.name,
      role: validation.payload.role
    };

    return this.generateToken(user);
  }

  // Store token securely
  storeToken(token: string, user: User): void {
    localStorage.setItem(this.STORAGE_KEY, token);
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
  }

  // Retrieve stored token
  getStoredToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  // Retrieve stored user
  getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_STORAGE_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  // Clear stored authentication data
  clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_STORAGE_KEY);
    localStorage.removeItem('session_state');
  }

  // Generate session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate signature (mock implementation)
  private generateSignature(data: string): string {
    // In production: use proper HMAC signing
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Decode token payload (for debugging)
  decodeToken(token: string): JWTPayload | null {
    const validation = this.validateToken(token);
    return validation.payload || null;
  }
}

export const jwtManager = new JWTManager();