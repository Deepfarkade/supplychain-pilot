/**
 * MicroserviceShell - Consistent layout wrapper for all microservices
 * Ensures uniform spacing, responsive design, and full-bleed content areas
 */

import React, { memo } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MicroserviceLayout } from '@/types/microservice';

interface MicroserviceShellProps {
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** Icon component */
  icon?: LucideIcon;
  /** Breadcrumb path */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  /** Layout configuration */
  layout?: MicroserviceLayout;
  /** Children content */
  children: React.ReactNode;
  /** Custom actions for header */
  actions?: React.ReactNode;
  /** Back button destination */
  backTo?: string;
  /** SEO metadata */
  metadata?: {
    title?: string;
    description?: string;
  };
}

const MicroserviceShell: React.FC<MicroserviceShellProps> = memo(({
  title,
  description,
  icon: Icon,
  breadcrumbs = [],
  layout = {},
  children,
  actions,
  backTo = '/appstore',
  metadata
}) => {
  const navigate = useNavigate();
  
  const {
    fullBleed = true,
    header = 'compact',
    padding = 'md',
    background = 'default'
  } = layout;

  const handleBack = () => {
    navigate(backTo);
  };

  // Set page title for SEO
  React.useEffect(() => {
    if (metadata?.title) {
      document.title = metadata.title;
    }
    
    // Set meta description
    if (metadata?.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', metadata.description);
    }
    
    return () => {
      // Reset to default title
      document.title = 'Nexus AI Hub';
    };
  }, [metadata]);

  // Background classes
  const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted/20',
    gradient: 'bg-gradient-to-br from-background via-background to-muted/20'
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  // Header height classes
  const headerClasses = {
    minimal: 'py-2',
    compact: 'py-4',
    standard: 'py-6'
  };

  return (
    <div className={cn(
      'min-h-screen',
      backgroundClasses[background]
    )}>
      {/* App Header */}
      <AppHeader />
      
      {/* Page Header */}
      <div className={cn(
        'border-b border-border/50',
        headerClasses[header]
      )}>
        <div className={cn(
          'w-full px-2 sm:px-4', // Minimal side padding, full width
          paddingClasses[padding] !== 'none' && 'py-4'
        )}>
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/appstore">App Store</BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {/* Header Content */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2 hover:bg-accent/50 transition-colors"
                aria-label="Go back to App Store"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>

              {/* Title Section */}
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h1 className={cn(
                    'font-semibold text-foreground leading-tight',
                    header === 'minimal' ? 'text-lg' : 
                    header === 'compact' ? 'text-xl' : 'text-2xl'
                  )}>
                    {title}
                  </h1>
                  {description && header !== 'minimal' && (
                    <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Actions */}
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Full width with minimal side padding */}
      <main className={cn(
        'flex-1 w-full',
        paddingClasses[padding] === '' ? 'px-2 sm:px-4' : paddingClasses[padding], // Minimal side padding
        'max-w-none' // Remove max-width constraint
      )}>
        {children}
      </main>
    </div>
  );
});

MicroserviceShell.displayName = 'MicroserviceShell';

export { MicroserviceShell };