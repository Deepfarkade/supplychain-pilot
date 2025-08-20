// Main Authentication Service with MongoDB Integration

import type { User, AuthCredentials, AuthResponse } from './types';
import { jwtManager } from './jwt';
import { sessionManager } from './session';

class AuthService {
  private readonly DUMMY_CREDENTIALS = [
    { email: 'admin@supplychainai.com', password: 'admin123', name: 'Admin User', role: 'admin' },
    { email: 'user@supplychainai.com', password: 'user123', name: 'Supply Chain User', role: 'user' }
  ];

  // Authenticate user with multiple fallback strategies
  async authenticate(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting authentication process...');
      
      // Strategy 1: Try MongoDB if configured
      try {
        const mongoResult = await this.authenticateWithMongoDB(credentials);
        if (mongoResult.success) {
          console.log('✅ MongoDB authentication successful');
          return mongoResult;
        }
      } catch (mongoError) {
        console.log('⚠️ MongoDB authentication failed, trying fallback...');
      }

      // Strategy 2: Try environment variables (when deployed to PC)
      try {
        const envResult = await this.authenticateWithEnv(credentials);
        if (envResult.success) {
          console.log('✅ Environment authentication successful');
          return envResult;
        }
      } catch (envError) {
        console.log('⚠️ Environment authentication failed, using dummy credentials...');
      }

      // Strategy 3: Fallback to dummy credentials
      const dummyResult = await this.authenticateWithDummy(credentials);
      if (dummyResult.success) {
        console.log('✅ Dummy authentication successful');
        return dummyResult;
      }

      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, message: 'Authentication failed' };
    }
  }

  // MongoDB authentication strategy
  private async authenticateWithMongoDB(credentials: AuthCredentials): Promise<AuthResponse> {
    // Import MongoDB service dynamically
    const { mongoService } = await import('@/services/database/mongodb');
    
    // Check if MongoDB is configured
    const config = mongoService.loadConfig();
    if (!config) {
      throw new Error('MongoDB not configured');
    }

    // Simulate API delay for production feel
    await new Promise(resolve => setTimeout(resolve, 800));

    const authenticatedUser = await mongoService.authenticateUser(credentials.email, credentials.password);
    
    if (authenticatedUser) {
      const user: User = {
        id: authenticatedUser._id || Date.now().toString(),
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        role: authenticatedUser.role || 'user',
        createdAt: new Date().toISOString()
      };

      const token = jwtManager.generateToken(user);
      jwtManager.storeToken(token, user);

      return { success: true, user, token };
    }

    return { success: false, message: 'Invalid MongoDB credentials' };
  }

  // Environment variables authentication (for PC deployment)
  private async authenticateWithEnv(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulate checking environment variables
    // In production: const adminEmail = process.env.ADMIN_EMAIL;
    // For now, simulate as if env vars don't exist in Lovable
    throw new Error('Environment variables not available in Lovable');
  }

  // Dummy credentials fallback
  private async authenticateWithDummy(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const validUser = this.DUMMY_CREDENTIALS.find(
      cred => cred.email === credentials.email && cred.password === credentials.password
    );

    if (validUser) {
      const user: User = {
        id: validUser.email === 'admin@supplychainai.com' ? '1' : '2',
        email: validUser.email,
        name: validUser.name,
        role: validUser.role,
        createdAt: new Date().toISOString()
      };

      const token = jwtManager.generateToken(user);
      jwtManager.storeToken(token, user);

      return { success: true, user, token };
    }

    return { success: false, message: 'Invalid dummy credentials' };
  }

  // Restore session from stored token
  async restoreSession(): Promise<{ user: User | null; isValid: boolean }> {
    const token = jwtManager.getStoredToken();
    const storedUser = jwtManager.getStoredUser();

    if (!token || !storedUser) {
      return { user: null, isValid: false };
    }

    const validation = jwtManager.validateToken(token);
    
    if (!validation.valid) {
      if (validation.expired) {
        // Try to refresh token
        const newToken = jwtManager.refreshToken(token);
        if (newToken) {
          jwtManager.storeToken(newToken, storedUser);
          console.log('🔄 Token refreshed successfully');
          return { user: storedUser, isValid: true };
        }
      }
      
      // Token invalid, clear storage
      jwtManager.clearStorage();
      return { user: null, isValid: false };
    }

    console.log('✅ Session restored successfully');
    return { user: storedUser, isValid: true };
  }

  // Logout user
  logout(): void {
    sessionManager.endSession();
    console.log('👋 User logged out');
  }

  // Start user session with timeout management
  startUserSession(user: User, onTimeout?: () => void, onWarning?: (seconds: number) => void): void {
    sessionManager.startSession(
      () => {
        this.logout();
        onTimeout?.();
      },
      onWarning
    );
  }

  // Extend current session
  extendSession(): boolean {
    return sessionManager.extendSession();
  }

  // Check if current session is valid
  isSessionValid(): boolean {
    return sessionManager.isSessionValid();
  }

  // Get session information
  getSessionInfo() {
    return sessionManager.getSessionInfo();
  }

  // Force refresh token
  async refreshCurrentToken(): Promise<boolean> {
    const token = jwtManager.getStoredToken();
    const user = jwtManager.getStoredUser();
    
    if (!token || !user) return false;

    const newToken = jwtManager.refreshToken(token);
    if (!newToken) return false;

    jwtManager.storeToken(newToken, user);
    console.log('🔄 Token force refreshed');
    return true;
  }
}

export const authService = new AuthService();