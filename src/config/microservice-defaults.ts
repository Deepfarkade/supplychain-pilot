/**
 * Default configuration for all microservices
 * Individual microservices can override these defaults as needed
 */

import { MicroserviceLayout } from '@/types/microservice';

export const DEFAULT_MICROSERVICE_LAYOUT: MicroserviceLayout = {
  fullBleed: true,
  header: 'compact',
  padding: 'none', // No padding for maximum space utilization
  background: 'default'
};

/**
 * Default content container styles for embedded applications
 */
export const DEFAULT_CONTENT_STYLES = {
  minHeight: '85vh',
  width: '100%',
  className: 'w-full min-h-[85vh] border border-border/20 rounded-lg overflow-hidden'
};

/**
 * Merge user layout with defaults
 */
export function mergeWithDefaults(userLayout?: Partial<MicroserviceLayout>): MicroserviceLayout {
  return {
    ...DEFAULT_MICROSERVICE_LAYOUT,
    ...userLayout
  };
}