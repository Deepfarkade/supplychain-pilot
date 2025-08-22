import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRouteError } from "@/hooks/useRouteError";
import RouteErrorModal from "@/components/RouteErrorModal";

const NotFound = () => {
  const location = useLocation();
  const { error, showPageNotFound, clearError, isOpen } = useRouteError();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Show error modal instead of basic 404 page
    showPageNotFound();
  }, [location.pathname, showPageNotFound]);

  return (
    <>
      {/* Fallback content - should not be visible due to modal */}
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">Loading error details...</p>
        </div>
      </div>

      {/* Error Modal */}
      {error && (
        <RouteErrorModal
          isOpen={isOpen}
          title={error.title}
          message={error.message}
          suggestion={error.suggestion}
          requestedPath={error.requestedPath}
          onClose={clearError}
        />
      )}
    </>
  );
};

export default NotFound;
