/**
 * Production-grade Microservice Type Definitions
 * Provides type safety and scalability for the microservice registry
 */

import { ReactNode, ComponentType } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Layout configuration for microservice pages
 */
export interface MicroserviceLayout {
  /** Full viewport utilization - removes container padding */
  fullBleed?: boolean;
  /** Header style variant */
  header?: 'compact' | 'standard' | 'minimal';
  /** Content padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Background variant */
  background?: 'default' | 'muted' | 'gradient';
}

/**
 * Enhanced microservice configuration with production features
 */
export interface MicroserviceConfig {
  /** Unique identifier */
  id: string;
  /** Domain category */
  domain: 'general' | 'supply-chain' | 'pharma';
  /** URL slug */
  slug: string;
  /** Display name */
  name: string;
  /** Route path */
  path: string;
  /** Short description for cards */
  description?: string;
  /** Icon component (Lucide icons) */
  icon?: LucideIcon;
  /** Category for grouping */
  category?: string;
  /** Display order within domain */
  order?: number;
  /** Feature availability */
  enabled?: boolean;
  /** Development/staging flag */
  development?: boolean;
  /** Tags for filtering */
  tags?: string[];
  /** Layout configuration */
  layout?: MicroserviceLayout;
  /** Lazy-loaded React component */
  element?: () => Promise<{ default: ComponentType }>;
  /** Image asset path */
  imageUrl?: string;
  /** Metadata for SEO and analytics */
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

/**
 * Registry domain grouping
 */
export type MicroserviceDomain = 'general' | 'supply-chain' | 'pharma';

/**
 * Microservice load states
 */
export type LoadState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Error types for microservice loading
 */
export interface MicroserviceError {
  code: 'NOT_FOUND' | 'LOAD_ERROR' | 'RUNTIME_ERROR';
  message: string;
  details?: string;
}

/**
 * Route guard configuration
 */
export interface RouteGuard {
  /** Authentication required */
  requireAuth?: boolean;
  /** Required permissions */
  permissions?: string[];
  /** Custom guard function */
  guard?: () => boolean | Promise<boolean>;
}