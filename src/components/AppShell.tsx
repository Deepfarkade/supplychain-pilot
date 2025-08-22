/**
 * AppShell - Content wrapper without header
 * Provides consistent structure for page content
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  /** Page content */
  children: React.ReactNode;
  /** Optional page header content */
  headerContent?: React.ReactNode;
  /** Show background patterns */
  showPatterns?: boolean;
  /** Container max width */
  maxWidth?: 'full' | '7xl' | '6xl';
  /** Additional CSS classes */
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  headerContent,
  showPatterns = true,
  maxWidth = '7xl',
  className
}) => {
  const maxWidthClasses = {
    'full': 'max-w-full',
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl'
  };

  return (
    <div className={cn('min-h-screen surface-0', className)}>      
      {/* Page Header Band (if content provided) */}
      {headerContent && (
        <div className="surface-2 border-b border-border/50">
          <div className={cn('mx-auto px-4 py-6', maxWidthClasses[maxWidth])}>
            {headerContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative flex-1">
        {/* Subtle Background Patterns */}
        {showPatterns && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 dotted-pattern" />
          </div>
        )}
        
        {/* Content Container */}
        <div className={cn(
          'relative z-10',
          maxWidth === 'full' ? 'w-full' : `mx-auto px-4 ${maxWidthClasses[maxWidth]}`
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};