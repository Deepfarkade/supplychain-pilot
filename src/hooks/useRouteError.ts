import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteError {
  title: string;
  message: string;
  suggestion?: string;
  requestedPath: string;
}

export const useRouteError = () => {
  const [error, setError] = useState<RouteError | null>(null);
  const location = useLocation();

  const showError = useCallback((title: string, message: string, suggestion?: string) => {
    setError({
      title,
      message,
      suggestion,
      requestedPath: location.pathname
    });
  }, [location.pathname]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const showPageNotFound = useCallback(() => {
    showError(
      'Page Not Found',
      'The page you are looking for does not exist or has been moved.',
      'Please check the URL or navigate back to the main application.'
    );
  }, [showError]);

  const showServiceUnavailable = useCallback((serviceName?: string) => {
    showError(
      'Service Unavailable',
      `The ${serviceName || 'requested'} service is currently not available.`,
      'This service may not be deployed yet or is temporarily disabled.'
    );
  }, [showError]);

  const showAccessDenied = useCallback(() => {
    showError(
      'Access Denied',
      'You do not have permission to access this resource.',
      'Please contact your administrator or navigate to an allowed page.'
    );
  }, [showError]);

  return {
    error,
    showError,
    clearError,
    showPageNotFound,
    showServiceUnavailable,
    showAccessDenied,
    isOpen: !!error
  };
};