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

  // Handle microservice not found
  if (!microservice || !Component) {
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
            <p className="text-sm text-muted-foreground">
              Component key: {componentKey}
            </p>
          </div>
        </div>
      </MicroserviceShell>
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