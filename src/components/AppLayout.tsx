/**
 * AppLayout - Authenticated app layout with header and shell
 * Ensures Router context is available for all child components
 */

import React from 'react';
import { AppHeader } from '@/components/AppHeader';
import { AppShell } from '@/components/AppShell';

interface AppLayoutProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  showPatterns?: boolean;
  maxWidth?: 'full' | '7xl' | '6xl';
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  headerContent,
  showPatterns = true,
  maxWidth = '7xl',
  className
}) => {
  return (
    <>
      {/* Global App Header - Now inside Router context */}
      <AppHeader />
      
      {/* App Shell - Content wrapper only */}
      <AppShell 
        headerContent={headerContent}
        showPatterns={showPatterns}
        maxWidth={maxWidth}
        className={className}
      >
        {children}
      </AppShell>
    </>
  );
};