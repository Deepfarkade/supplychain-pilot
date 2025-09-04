/**
 * Production Microservice Registry
 * Single source of truth for dashboard tiles, routes, and lazy loading
 * 
 * HOW TO ADD A NEW MICROSERVICE:
 * 1. Create your component in /src/microservices/{domain}/{slug}/index.tsx
 * 2. Add one entry to this registry array
 * 3. The tile appears in AppStore and route works automatically
 */

import { lazy } from 'react';
import { MessageSquare, Bot, FileSearch, ShoppingCart, TrendingUp, Shield, Package, ClipboardList, Truck, FlaskConical, AlertTriangle, FileText } from 'lucide-react';
import { MicroserviceConfig } from '@/types/microservice';

// Image imports
import conversationalAgentsImg from '@/assets/conversational-agents.jpg';
import supplyChainNetworkImg from '@/assets/supply-chain-network.jpg';
import pharmaLabImg from '@/assets/pharma-lab.jpg';
import documentAnalysisImg from '@/assets/document-analysis.jpg';
import directGptImg from '@/assets/direct-gpt.jpg';
import inventoryDashboardImg from '@/assets/inventory-dashboard.jpg';

/**
 * Production Microservice Registry
 * Each entry automatically creates dashboard tiles and lazy-loaded routes
 */
export const microserviceRegistry: MicroserviceConfig[] = [
  // GENERAL DOMAIN
  {
    id: 'conversational-agents',
    domain: 'general',
    slug: 'conversational-agents',
    name: 'Conversational Agents',
    path: '/app/general/conversational-agents',
    description: 'Test deployed models with customizable chatbot interface, translation and personalized prompts.',
    icon: MessageSquare,
    category: 'AI Chat',
    order: 1,
    enabled: true,
    development: true,
    tags: ['chat', 'ai', 'nlp'],
    imageUrl: conversationalAgentsImg,
    element: () => import('@/microservices/general/conversational-agents/index'),
    metadata: {
      title: 'Conversational Agents - AI Chat Interface',
      description: 'Interactive AI chatbot with customizable prompts and translation capabilities',
      keywords: ['conversational ai', 'chatbot', 'nlp', 'translation']
    }
  },
  {
    id: 'direct-gpt',
    domain: 'general',
    slug: 'direct-gpt',
    name: 'Direct GPT',
    path: '/app/general/direct-gpt',
    description: 'Azure ChatGPT playground to explore different model capabilities and configurations.',
    icon: Bot,
    category: 'AI Models',
    order: 2,
    enabled: true,
    development: true,
    tags: ['gpt', 'azure', 'playground'],
    imageUrl: directGptImg,
    element: () => import('@/microservices/general/direct-gpt/index'),
    metadata: {
      title: 'Direct GPT - Azure OpenAI Playground',
      description: 'Explore Azure OpenAI models with interactive playground interface',
      keywords: ['azure openai', 'gpt', 'ai playground', 'language models']
    }
  },
  {
    id: 'document-comparer',
    domain: 'general',
    slug: 'document-comparer',
    name: 'Document Comparer',
    path: '/app/general/document-comparer',
    description: 'Demonstrate GenAI power for knowledge base Q&A and document analysis.',
    icon: FileSearch,
    category: 'Document AI',
    order: 3,
    enabled: true,
    development: true,
    tags: ['documents', 'analysis', 'comparison'],
    imageUrl: documentAnalysisImg,
    element: () => import('@/microservices/general/document-comparer/index'),
    metadata: {
      title: 'Document Comparer - AI Document Analysis',
      description: 'AI-powered document comparison and knowledge base Q&A system',
      keywords: ['document analysis', 'ai comparison', 'knowledge base', 'document qa']
    }
  },

  // SUPPLY CHAIN DOMAIN
  {
    id: 'rfq-to-award',
    domain: 'supply-chain',
    slug: 'rfq-to-award',
    name: 'RFQ-to-Award Co-Pilot',
    path: '/app/supply-chain/rfq-to-award',
    description: 'Streamline procurement with AI-powered RFQ analysis and automated supplier selection.',
    icon: ShoppingCart,
    category: 'Procurement',
    order: 1,
    enabled: true,
    development: true,
    tags: ['rfq', 'procurement', 'supplier', 'award'],
    imageUrl: supplyChainNetworkImg,
    element: () => import('@/microservices/supply-chain/rfq-to-award/index'),
    metadata: {
      title: 'RFQ-to-Award Co-Pilot - Procurement Automation',
      description: 'AI-powered RFQ analysis, supplier evaluation, and automated award recommendations',
      keywords: ['rfq automation', 'procurement ai', 'supplier selection', 'award process']
    }
  },
  {
    id: 'demand-forecast',
    domain: 'supply-chain',
    slug: 'demand-forecast',
    name: 'Demand Forecast Review',
    path: '/app/supply-chain/demand-forecast',
    description: 'Advanced demand forecasting with ML models and supply chain optimization.',
    icon: TrendingUp,
    category: 'Analytics',
    order: 2,
    enabled: true,
    development: true,
    tags: ['forecast', 'demand', 'ml', 'analytics'],
    imageUrl: inventoryDashboardImg,
    element: () => import('@/microservices/supply-chain/demand-forecast/index'),
    metadata: {
      title: 'Demand Forecast Review - Supply Chain Analytics',
      description: 'Machine learning powered demand forecasting and supply chain optimization',
      keywords: ['demand forecasting', 'supply chain analytics', 'ml prediction', 'inventory planning']
    }
  },
  {
    id: 'supplier-risk',
    domain: 'supply-chain',
    slug: 'supplier-risk',
    name: 'Supplier Risk Monitor',
    path: '/app/supply-chain/supplier-risk',
    description: 'Real-time supplier risk assessment and monitoring with predictive analytics.',
    icon: Shield,
    category: 'Risk Management',
    order: 3,
    enabled: true,
    development: true,
    tags: ['risk', 'supplier', 'monitoring', 'analytics'],
    imageUrl: supplyChainNetworkImg,
    element: () => import('@/microservices/supply-chain/supplier-risk/index'),
    metadata: {
      title: 'Supplier Risk Monitor - Risk Management',
      description: 'Real-time supplier risk assessment with predictive analytics and monitoring',
      keywords: ['supplier risk', 'risk management', 'predictive analytics', 'supplier monitoring']
    }
  },
  {
    id: 'inventory-rebalancer',
    domain: 'supply-chain',
    slug: 'inventory-rebalancer',
    name: 'Inventory Rebalancer',
    path: '/app/supply-chain/inventory-rebalancer',
    description: 'Intelligent inventory optimization and automated rebalancing across distribution networks.',
    icon: Package,
    category: 'Inventory',
    order: 4,
    enabled: true,
    development: true,
    tags: ['inventory', 'optimization', 'rebalancing', 'distribution'],
    imageUrl: inventoryDashboardImg,
    element: () => import('@/microservices/supply-chain/inventory-rebalancer/index'),
    metadata: {
      title: 'Inventory Rebalancer - Inventory Optimization',
      description: 'AI-powered inventory optimization and automated rebalancing across networks',
      keywords: ['inventory optimization', 'rebalancing', 'distribution network', 'inventory ai']
    }
  },
  {
    id: 'order-management',
    domain: 'supply-chain',
    slug: 'order-management',
    name: 'Order Management Agent',
    path: '/app/supply-chain/order-management',
    description: 'Intelligent order processing and management with AI-powered chat assistance.',
    icon: ClipboardList,
    category: 'Operations',
    order: 5,
    enabled: true,
    development: true,
    tags: ['orders', 'management', 'processing', 'chat'],
    imageUrl: supplyChainNetworkImg,
    element: () => import('@/microservices/supply-chain/order-management/index'),
    metadata: {
      title: 'Order Management Agent - Order Processing',
      description: 'AI-powered order processing and management with intelligent chat assistance',
      keywords: ['order management', 'order processing', 'ai assistant', 'order automation']
    }
  },
  {
    id: 'logistics-order-processing',
    domain: 'supply-chain',
    slug: 'logistics-order-processing',
    name: 'Logistics Order Processing Agent',
    path: '/app/supply-chain/logistics-order-processing',
    description: 'An autonomous agent that monitors inbound orders, parses details, and seamlessly syncs them for operational visibility.',
    icon: Truck,
    category: 'Operations',
    order: 6,
    enabled: true,
    development: true,
    tags: ['logistics', 'orders', 'monitoring', 'autonomous'],
    imageUrl: supplyChainNetworkImg,
    element: () => import('@/microservices/supply-chain/logistics-order-processing/index'),
    metadata: {
      title: 'Logistics Order Processing Agent - Order Monitoring',
      description: 'Autonomous agent for monitoring inbound orders and operational visibility',
      keywords: ['logistics orders', 'order monitoring', 'autonomous agent', 'order processing']
    }
  },

  // PHARMA DOMAIN
  {
    id: 'batch-release',
    domain: 'pharma',
    slug: 'batch-release',
    name: 'Batch Release Assistant',
    path: '/app/pharma/batch-release',
    description: 'AI-powered batch release decision support with regulatory compliance validation.',
    icon: FlaskConical,
    category: 'Quality',
    order: 1,
    enabled: true,
    development: true,
    tags: ['batch', 'release', 'quality', 'compliance'],
    imageUrl: pharmaLabImg,
    element: () => import('@/microservices/pharma/batch-release/index'),
    metadata: {
      title: 'Batch Release Assistant - Pharmaceutical Quality',
      description: 'AI-powered batch release decisions with automated compliance validation',
      keywords: ['batch release', 'pharmaceutical quality', 'compliance validation', 'regulatory ai']
    }
  },
  {
    id: 'deviation-capa',
    domain: 'pharma',
    slug: 'deviation-capa',
    name: 'Deviation CAPA Summarizer',
    path: '/app/pharma/deviation-capa',
    description: 'Automated deviation analysis and CAPA recommendation generation for quality management.',
    icon: AlertTriangle,
    category: 'Quality',
    order: 2,
    enabled: true,
    development: true,
    tags: ['deviation', 'capa', 'quality', 'analysis'],
    imageUrl: pharmaLabImg,
    element: () => import('@/microservices/pharma/deviation-capa/index'),
    metadata: {
      title: 'Deviation CAPA Summarizer - Quality Management',
      description: 'Automated deviation analysis and CAPA recommendations for pharmaceutical quality',
      keywords: ['deviation analysis', 'capa recommendations', 'quality management', 'pharma quality']
    }
  },
  {
    id: 'regulatory-dossier',
    domain: 'pharma',
    slug: 'regulatory-dossier',
    name: 'Regulatory Dossier Helper',
    path: '/app/pharma/regulatory-dossier',
    description: 'Intelligent regulatory document preparation and compliance verification assistant.',
    icon: FileText,
    category: 'Regulatory',
    order: 3,
    enabled: true,
    development: true,
    tags: ['regulatory', 'dossier', 'compliance', 'documents'],
    imageUrl: pharmaLabImg,
    element: () => import('@/microservices/pharma/regulatory-dossier/index'),
    metadata: {
      title: 'Regulatory Dossier Helper - Regulatory Compliance',
      description: 'AI-powered regulatory document preparation and compliance verification',
      keywords: ['regulatory dossier', 'regulatory compliance', 'document preparation', 'pharma regulatory']
    }
  }
];

/**
 * Registry helper functions with type safety
 */

export const getMicroservice = (domain: string, slug: string): MicroserviceConfig | undefined => {
  return microserviceRegistry.find(ms => ms.domain === domain && ms.slug === slug && ms.enabled !== false);
};

export const getAllMicroservices = (): MicroserviceConfig[] => {
  return microserviceRegistry.filter(ms => ms.enabled !== false);
};

export const getMicroservicesByDomain = (domain: string): MicroserviceConfig[] => {
  return microserviceRegistry.filter(ms => ms.domain === domain && ms.enabled !== false);
};

export const getEnabledMicroservices = (): MicroserviceConfig[] => {
  return microserviceRegistry.filter(ms => ms.enabled === true);
};

export const getMicroserviceById = (id: string): MicroserviceConfig | undefined => {
  return microserviceRegistry.find(ms => ms.id === id && ms.enabled !== false);
};

export const searchMicroservices = (query: string, domain?: string): MicroserviceConfig[] => {
  const searchTerm = query.toLowerCase();
  let services = domain ? getMicroservicesByDomain(domain) : getAllMicroservices();
  
  return services.filter(ms => 
    ms.name.toLowerCase().includes(searchTerm) ||
    ms.description?.toLowerCase().includes(searchTerm) ||
    ms.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    ms.category?.toLowerCase().includes(searchTerm)
  );
};

/**
 * Get all unique domains
 */
export const getDomains = (): string[] => {
  return [...new Set(microserviceRegistry.map(ms => ms.domain))];
};

/**
 * Get all unique categories
 */
export const getCategories = (): string[] => {
  return [...new Set(microserviceRegistry.filter(ms => ms.category).map(ms => ms.category!))];
};