// Security Types for Authentication System

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt?: string;
}

export interface JWTPayload {
  sub: string; // User ID
  email: string;
  name: string;
  role?: string;
  iat: number; // Issued at
  exp: number; // Expires at
  sessionId: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface SessionState {
  isActive: boolean;
  lastActivity: number;
  warningShown: boolean;
  timeoutId?: NodeJS.Timeout;
  warningTimeoutId?: NodeJS.Timeout;
}

export interface SecurityConfig {
  sessionTimeoutMinutes: number;
  warningTimeoutSeconds: number;
  tokenRefreshThresholdMinutes: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  sessionTimeoutMinutes: 20,
  warningTimeoutSeconds: 120,
  tokenRefreshThresholdMinutes: 5,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15
};