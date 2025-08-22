/**
 * Production-grade microservice container - Simplified version for debugging
 */

import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMicroservice } from '@/microservices/registry';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { MicroservicePageSkeleton } from '@/components/ui/skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';

// Direct imports for now to debug the issue
import ConversationalAgents from '@/microservices/general/conversational-agents/index';
import DirectGPT from '@/microservices/general/direct-gpt/index';
import DocumentComparer from '@/microservices/general/document-comparer/index';
import RFQToAward from '@/microservices/supply-chain/rfq-to-award/index';
import DemandForecast from '@/microservices/supply-chain/demand-forecast/index';
import SupplierRisk from '@/microservices/supply-chain/supplier-risk/index';
import InventoryRebalancer from '@/microservices/supply-chain/inventory-rebalancer/index';
import OrderManagement from '@/microservices/supply-chain/order-management/index';
import BatchRelease from '@/microservices/pharma/batch-release/index';
import DeviationCAPA from '@/microservices/pharma/deviation-capa/index';
import RegulatoryDossier from '@/microservices/pharma/regulatory-dossier/index';

// Component mapping
const componentMap: Record<string, React.ComponentType> = {
  'general/conversational-agents': ConversationalAgents,
  'general/direct-gpt': DirectGPT,
  'general/document-comparer': DocumentComparer,
  'supply-chain/rfq-to-award': RFQToAward,
  'supply-chain/demand-forecast': DemandForecast,
  'supply-chain/supplier-risk': SupplierRisk,
  'supply-chain/inventory-rebalancer': InventoryRebalancer,
  'supply-chain/order-management': OrderManagement,
  'pharma/batch-release': BatchRelease,
  'pharma/deviation-capa': DeviationCAPA,
  'pharma/regulatory-dossier': RegulatoryDossier,
};

/**
 * Main microservice container with direct imports
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
  const componentKey = `${domain}/${slug}`;
  const Component = componentMap[componentKey];

  // Handle microservice not found with enhanced error modal
  if (!microservice || !Component) {
    // Import RouteErrorModal dynamically to avoid circular dependencies
    const RouteErrorModal = React.lazy(() => import('@/components/RouteErrorModal'));
    
    return (
      <Suspense fallback={<MicroserviceShell title="Loading..." description="Loading error handler..." layout={{ header: 'compact', padding: 'md' }}><div className="p-8">Loading...</div></MicroserviceShell>}>
        <RouteErrorModal
          isOpen={true}
          title="Service Unavailable"
          message={`The microservice "${domain}/${slug}" is currently not available or has not been deployed yet.`}
          suggestion="This service may be under development, disabled, or requires additional configuration."
          requestedPath={`/app/${domain}/${slug}`}
          onClose={() => navigate('/appstore', { replace: true })}
        />
      </Suspense>
    );
  }

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
          layout={microservice.layout}
          metadata={microservice.metadata}
        >
          <MicroservicePageSkeleton />
        </MicroserviceShell>
      }>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};