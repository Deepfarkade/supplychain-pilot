/**
 * Production-grade microservice container with lazy loading and error boundaries
 */

import React, { Suspense, memo, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMicroservice } from '@/microservices/registry';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { MicroservicePageSkeleton } from '@/components/ui/skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';

/**
 * Lazy component loader with error handling
 */
const LazyMicroserviceLoader: React.FC<{ domain: string; slug: string }> = memo(({ domain, slug }) => {
  const microservice = getMicroservice(domain, slug);
  
  if (!microservice) {
    throw new Error(`Microservice ${domain}/${slug} not found in registry`);
  }

  if (!microservice.element) {
    throw new Error(`Microservice ${domain}/${slug} has no element function defined`);
  }

  // Create lazy component directly from the import function
  const LazyComponent = useMemo(() => {
    return React.lazy(() => microservice.element!());
  }, [microservice.element]);

  return <LazyComponent />;
});

LazyMicroserviceLoader.displayName = 'LazyMicroserviceLoader';

/**
 * Main microservice container with production-grade features
 */
export const MicroserviceContainer: React.FC = () => {
  const { domain, slug } = useParams<{ domain: string; slug: string }>();
  const navigate = useNavigate();

  // Redirect to app store if params are missing
  if (!domain || !slug) {
    navigate('/appstore', { replace: true });
    return null;
  }

  const microservice = getMicroservice(domain, slug);

  // Handle microservice not found
  if (!microservice) {
    return (
      <MicroserviceShell
        title="Service Not Found"
        description={`The microservice "${domain}/${slug}" is not available`}
        layout={{ header: 'compact', padding: 'md' }}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              This microservice is not available or hasn't been implemented yet.
            </p>
          </div>
        </div>
      </MicroserviceShell>
    );
  }

  const breadcrumbs = [
    { label: microservice.domain.charAt(0).toUpperCase() + microservice.domain.slice(1).replace('-', ' ') },
    { label: microservice.name }
  ];

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error(`Microservice ${domain}/${slug} error:`, error, errorInfo);
      }}
    >
      <Suspense fallback={
        <MicroserviceShell
          title={microservice.name}
          description={microservice.description}
          icon={microservice.icon}
          breadcrumbs={breadcrumbs}
          layout={microservice.layout}
          metadata={microservice.metadata}
        >
          <MicroservicePageSkeleton />
        </MicroserviceShell>
      }>
        <LazyMicroserviceLoader domain={domain} slug={slug} />
      </Suspense>
    </ErrorBoundary>
  );
};