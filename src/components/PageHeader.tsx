/**
 * PageHeader - Reusable header component for consistent page titles
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Page subtitle/description */
  subtitle?: string;
  /** Icon component */
  icon?: LucideIcon;
  /** Breadcrumb navigation */
  breadcrumbs?: BreadcrumbItem[];
  /** Custom actions */
  actions?: React.ReactNode;
  /** Back button destination */
  backTo?: string;
  /** Header variant */
  variant?: 'default' | 'compact' | 'minimal';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  breadcrumbs = [],
  actions,
  backTo,
  variant = 'default'
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const titleSizes = {
    default: 'text-3xl',
    compact: 'text-2xl',
    minimal: 'text-xl'
  };

  const paddings = {
    default: 'py-8',
    compact: 'py-6',
    minimal: 'py-4'
  };

  return (
    <div className={cn('animate-fade-in', paddings[variant])}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
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
          {backTo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 hover:surface-2 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}

          {/* Title Section */}
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className={cn(
                'font-semibold text-foreground leading-tight',
                titleSizes[variant]
              )}>
                {title}
              </h1>
              {subtitle && variant !== 'minimal' && (
                <p className="text-muted-foreground mt-1 max-w-2xl">
                  {subtitle}
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
  );
};