/**
 * EmbeddedApp - Reusable container for embedded microservice applications
 * Uses production defaults with override capability
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { DEFAULT_CONTENT_STYLES } from '@/config/microservice-defaults';

interface EmbeddedAppProps {
  /** Custom height override */
  height?: string;
  /** Custom width override */
  width?: string;
  /** Additional CSS classes */
  className?: string;
  /** Child content */
  children: React.ReactNode;
}

export const EmbeddedApp: React.FC<EmbeddedAppProps> = ({
  height = DEFAULT_CONTENT_STYLES.minHeight,
  width = DEFAULT_CONTENT_STYLES.width,
  className,
  children
}) => {
  return (
    <div 
      className={cn(
        DEFAULT_CONTENT_STYLES.className,
        className
      )}
      style={{ 
        minHeight: height,
        width: width
      }}
    >
      {children}
    </div>
  );
};