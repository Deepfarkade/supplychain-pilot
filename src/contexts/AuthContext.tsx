import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/security/auth';
import type { User } from '@/security/types';
import SessionTimeoutModal from '@/components/SessionTimeoutModal';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  extendSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeoutSeconds, setTimeoutSeconds] = useState(120);

  useEffect(() => {
    // Restore session on app load
    const restoreSession = async () => {
      try {
        const { user: restoredUser, isValid } = await authService.restoreSession();
        
        if (isValid && restoredUser) {
          setUser(restoredUser);
          
          // Start session management
          authService.startUserSession(
            restoredUser,
            handleSessionTimeout,
            handleSessionWarning
          );
          
          console.log('✅ Session restored for:', restoredUser.name);
        } else {
          console.log('❌ No valid session found');
        }
      } catch (error) {
        console.error('Session restoration error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleSessionTimeout = () => {
    console.log('🔐 Session timed out, logging out user');
    setUser(null);
    setShowTimeoutModal(false);
  };

  const handleSessionWarning = (remainingSeconds: number) => {
    console.log('⚠️ Session warning:', remainingSeconds, 'seconds remaining');
    setTimeoutSeconds(remainingSeconds);
    setShowTimeoutModal(true);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await authService.authenticate({ email, password });
      
      if (response.success && response.user) {
        setUser(response.user);
        
        // Start session management with timeout callbacks
        authService.startUserSession(
          response.user,
          handleSessionTimeout,
          handleSessionWarning
        );
        
        console.log('✅ Login successful for:', response.user.name);
        return true;
      }
      
      console.log('❌ Login failed:', response.message);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setShowTimeoutModal(false);
    console.log('👋 User logged out');
  };

  const extendSession = (): boolean => {
    const extended = authService.extendSession();
    if (extended) {
      setShowTimeoutModal(false);
      setTimeoutSeconds(120); // Reset to initial value
      console.log('🔄 Session extended successfully');
    }
    return extended;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    extendSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionTimeoutModal
        isOpen={showTimeoutModal}
        remainingSeconds={timeoutSeconds}
        onExtendSession={extendSession}
        onLogout={logout}
      />
    </AuthContext.Provider>
  );
};