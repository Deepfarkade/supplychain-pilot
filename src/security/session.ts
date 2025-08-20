// Session Management with Timeout and Activity Tracking

import type { SessionState, SecurityConfig } from './types';
import { DEFAULT_SECURITY_CONFIG } from './types';
import { jwtManager } from './jwt';

export type SessionTimeoutCallback = () => void;
export type SessionWarningCallback = (remainingSeconds: number) => void;

class SessionManager {
  private sessionState: SessionState = {
    isActive: false,
    lastActivity: Date.now(),
    warningShown: false
  };
  
  private config: SecurityConfig = DEFAULT_SECURITY_CONFIG;
  private onTimeoutCallback?: SessionTimeoutCallback;
  private onWarningCallback?: SessionWarningCallback;
  private activityListeners: (() => void)[] = [];
  private warningCountdownInterval?: NodeJS.Timeout;

  constructor() {
    this.setupActivityListeners();
    this.loadSessionState();
  }

  // Initialize session
  startSession(onTimeout?: SessionTimeoutCallback, onWarning?: SessionWarningCallback): void {
    this.onTimeoutCallback = onTimeout;
    this.onWarningCallback = onWarning;
    
    this.sessionState = {
      isActive: true,
      lastActivity: Date.now(),
      warningShown: false
    };
    
    this.saveSessionState();
    this.resetTimers();
    console.log('🔐 Session started with', this.config.sessionTimeoutMinutes, 'minute timeout');
  }

  // End session
  endSession(): void {
    this.clearTimers();
    this.sessionState.isActive = false;
    this.clearSessionState();
    jwtManager.clearStorage();
    console.log('🔐 Session ended');
  }

  // Update activity timestamp
  updateActivity(): void {
    if (!this.sessionState.isActive) return;

    const now = Date.now();
    this.sessionState.lastActivity = now;
    this.sessionState.warningShown = false;
    this.saveSessionState();
    this.resetTimers();
  }

  // Check if session is still valid
  isSessionValid(): boolean {
    if (!this.sessionState.isActive) return false;

    const now = Date.now();
    const sessionTimeout = this.config.sessionTimeoutMinutes * 60 * 1000;
    const timeSinceLastActivity = now - this.sessionState.lastActivity;

    return timeSinceLastActivity < sessionTimeout;
  }

  // Get remaining session time in milliseconds
  getRemainingTime(): number {
    if (!this.sessionState.isActive) return 0;

    const now = Date.now();
    const sessionTimeout = this.config.sessionTimeoutMinutes * 60 * 1000;
    const timeSinceLastActivity = now - this.sessionState.lastActivity;
    const remainingTime = sessionTimeout - timeSinceLastActivity;

    return Math.max(0, remainingTime);
  }

  // Extend session (refresh token if needed)
  extendSession(): boolean {
    const token = jwtManager.getStoredToken();
    if (!token) return false;

    if (jwtManager.needsRefresh(token)) {
      const newToken = jwtManager.refreshToken(token);
      if (!newToken) return false;

      const user = jwtManager.getStoredUser();
      if (user) {
        jwtManager.storeToken(newToken, user);
      }
    }

    this.updateActivity();
    console.log('🔐 Session extended');
    return true;
  }

  // Setup activity listeners
  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => this.updateActivity();
    
    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActivity();
      }
    });
  }

  // Reset timeout timers
  private resetTimers(): void {
    this.clearTimers();

    if (!this.sessionState.isActive) return;

    // Set warning timer (20 minutes - 2 minutes = 18 minutes)
    const warningTime = (this.config.sessionTimeoutMinutes - 2) * 60 * 1000;
    this.sessionState.warningTimeoutId = setTimeout(() => {
      this.showSessionWarning();
    }, warningTime);

    // Set session timeout timer (20 minutes)
    const sessionTimeout = this.config.sessionTimeoutMinutes * 60 * 1000;
    this.sessionState.timeoutId = setTimeout(() => {
      this.handleSessionTimeout();
    }, sessionTimeout);
  }

  // Clear all timers
  private clearTimers(): void {
    if (this.sessionState.timeoutId) {
      clearTimeout(this.sessionState.timeoutId);
      this.sessionState.timeoutId = undefined;
    }
    
    if (this.sessionState.warningTimeoutId) {
      clearTimeout(this.sessionState.warningTimeoutId);
      this.sessionState.warningTimeoutId = undefined;
    }

    // Clear warning countdown interval
    if (this.warningCountdownInterval) {
      clearInterval(this.warningCountdownInterval);
      this.warningCountdownInterval = undefined;
    }
  }

  // Show session warning
  private showSessionWarning(): void {
    if (!this.sessionState.isActive || this.sessionState.warningShown) return;

    this.sessionState.warningShown = true;
    this.saveSessionState();

    // Start countdown timer for warning
    let remainingSeconds = this.config.warningTimeoutSeconds;
    
    this.warningCountdownInterval = setInterval(() => {
      remainingSeconds--;
      
      if (this.onWarningCallback) {
        this.onWarningCallback(remainingSeconds);
      }

      if (remainingSeconds <= 0) {
        clearInterval(this.warningCountdownInterval!);
        this.warningCountdownInterval = undefined;
        this.handleSessionTimeout();
      }
    }, 1000);

    // Initial warning callback
    if (this.onWarningCallback) {
      this.onWarningCallback(remainingSeconds);
    }

    console.log('⚠️ Session warning shown:', remainingSeconds, 'seconds remaining');
  }

  // Handle session timeout
  private handleSessionTimeout(): void {
    console.log('🔐 Session timed out');
    this.endSession();
    
    if (this.onTimeoutCallback) {
      this.onTimeoutCallback();
    }
  }

  // Save session state to localStorage
  private saveSessionState(): void {
    const stateToSave = {
      isActive: this.sessionState.isActive,
      lastActivity: this.sessionState.lastActivity,
      warningShown: this.sessionState.warningShown
    };
    localStorage.setItem('session_state', JSON.stringify(stateToSave));
  }

  // Load session state from localStorage
  private loadSessionState(): void {
    const savedState = localStorage.getItem('session_state');
    if (!savedState) return;

    try {
      const state = JSON.parse(savedState);
      this.sessionState = {
        ...this.sessionState,
        ...state
      };
    } catch (error) {
      console.error('Failed to load session state:', error);
    }
  }

  // Clear session state from localStorage
  private clearSessionState(): void {
    localStorage.removeItem('session_state');
  }

  // Get session info for debugging
  getSessionInfo() {
    return {
      ...this.sessionState,
      remainingTime: this.getRemainingTime(),
      isValid: this.isSessionValid(),
      config: this.config
    };
  }
}

export const sessionManager = new SessionManager();