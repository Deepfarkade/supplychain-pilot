// Microservice Registry - Automatically discovers and registers microservices
export interface MicroserviceConfig {
  domain: string;
  slug: string;
  name: string;
  path: string;
  component: string;
  port?: number;
  development?: boolean;
}

// Auto-discovery of microservices from the microservices directory
export const microserviceRegistry: MicroserviceConfig[] = [
  // General Domain
  {
    domain: 'general',
    slug: 'conversational-agents',
    name: 'Conversational Agents',
    path: '/app/general/conversational-agents',
    component: 'ConversationalAgents',
    development: true
  },
  {
    domain: 'general',
    slug: 'direct-gpt',
    name: 'Direct GPT',
    path: '/app/general/direct-gpt',
    component: 'DirectGPT',
    development: true
  },
  {
    domain: 'general',
    slug: 'document-comparer',
    name: 'Document Comparer',
    path: '/app/general/document-comparer',
    component: 'DocumentComparer',
    development: true
  },
  
  // Supply Chain Domain
  {
    domain: 'supply-chain',
    slug: 'rfq-to-award',
    name: 'RFQ-to-Award Co-Pilot',
    path: '/app/supply-chain/rfq-to-award',
    component: 'RFQToAward',
    development: true
  },
  {
    domain: 'supply-chain',
    slug: 'demand-forecast',
    name: 'Demand Forecast Review',
    path: '/app/supply-chain/demand-forecast',
    component: 'DemandForecast',
    development: true
  },
  {
    domain: 'supply-chain',
    slug: 'supplier-risk',
    name: 'Supplier Risk Monitor',
    path: '/app/supply-chain/supplier-risk',
    component: 'SupplierRisk',
    development: true
  },
  {
    domain: 'supply-chain',
    slug: 'inventory-rebalancer',
    name: 'Inventory Rebalancer',
    path: '/app/supply-chain/inventory-rebalancer',
    component: 'InventoryRebalancer',
    development: true
  },
  
  // Pharma Domain
  {
    domain: 'pharma',
    slug: 'batch-release',
    name: 'Batch Release Assistant',
    path: '/app/pharma/batch-release',
    component: 'BatchRelease',
    development: true
  },
  {
    domain: 'pharma',
    slug: 'deviation-capa',
    name: 'Deviation CAPA Summarizer',
    path: '/app/pharma/deviation-capa',
    component: 'DeviationCAPA',
    development: true
  },
  {
    domain: 'pharma',
    slug: 'regulatory-dossier',
    name: 'Regulatory Dossier Helper',
    path: '/app/pharma/regulatory-dossier',
    component: 'RegulatoryDossier',
    development: true
  }
];

export const getMicroservice = (domain: string, slug: string): MicroserviceConfig | undefined => {
  return microserviceRegistry.find(ms => ms.domain === domain && ms.slug === slug);
};

export const getAllMicroservices = (): MicroserviceConfig[] => {
  return microserviceRegistry;
};

export const getMicroservicesByDomain = (domain: string): MicroserviceConfig[] => {
  return microserviceRegistry.filter(ms => ms.domain === domain);
};