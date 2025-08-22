# 🧩 Components Directory

> Reusable UI components and design system implementation

## 📁 Structure

```
src/components/
├── ui/                     # shadcn/ui base components
│   ├── button.tsx         # Button variants and styles
│   ├── card.tsx          # Card layouts and containers
│   ├── dialog.tsx        # Modal and dialog components
│   └── ...               # Other UI primitives
├── AppCard.tsx           # Application tile component
├── AppHeader.tsx         # Main application header
├── AppShell.tsx          # Application layout wrapper
├── DatabaseConfig.tsx    # Database configuration UI
├── EmbeddedApp.tsx      # Iframe container for external apps
├── ErrorBoundary.tsx    # Error handling wrapper
├── Loading.tsx          # Loading states and skeletons
├── MicroserviceContainer.tsx  # Route container for services
├── MicroserviceShell.tsx     # Layout wrapper for microservices
├── NotificationDemo.tsx      # Notification system demo
├── NotificationPanel.tsx     # Notification display panel
├── PageHeader.tsx           # Page-level header component
├── ProtectedRoute.tsx       # Route protection wrapper
├── RightRail.tsx           # Sidebar component
├── RouteErrorModal.tsx     # Error modal for route failures
├── SessionTimeoutModal.tsx # Session management modal
├── ThemeProvider.tsx       # Theme context provider
└── ThemeToggle.tsx         # Dark/light theme switcher
```

## 🎨 Design System

### Core Principles

- **Consistency**: All components follow the same design tokens
- **Accessibility**: WCAG 2.1 AA compliant
- **Responsive**: Mobile-first approach
- **Themeable**: Support for dark/light modes
- **Semantic**: Use design tokens, not direct colors

### Design Tokens

Components use semantic tokens defined in `src/index.css`:

```css
/* Example semantic tokens */
--primary: 222.2 84% 4.9%;
--secondary: 210 40% 96%;
--muted: 210 40% 96%;
--accent: 210 40% 96%;
```

## 🧱 Core Components

### Layout Components

#### `AppShell.tsx`
Main application layout with navigation and routing.

```tsx
<AppShell>
  <Routes>
    {/* Your routes */}
  </Routes>
</AppShell>
```

#### `MicroserviceShell.tsx`
Layout wrapper for microservice pages with SEO and breadcrumbs.

```tsx
<MicroserviceShell
  title="Service Name"
  description="Service description"
  icon={IconComponent}
  breadcrumbs={breadcrumbArray}
  metadata={{ title: "SEO Title", description: "SEO Description" }}
>
  {/* Service content */}
</MicroserviceShell>
```

#### `EmbeddedApp.tsx`
Optimized container for embedded applications and iframes.

```tsx
<EmbeddedApp height="90vh">
  <iframe src="external-app-url" />
</EmbeddedApp>
```

### Navigation Components

#### `AppHeader.tsx`
Main navigation header with theme toggle and user menu.

#### `PageHeader.tsx`
Page-level header with breadcrumbs and actions.

```tsx
<PageHeader
  title="Page Title"
  description="Page description"
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Current Page" }
  ]}
/>
```

### Utility Components

#### `ErrorBoundary.tsx`
Catches and displays JavaScript errors gracefully.

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

#### `ProtectedRoute.tsx`
Ensures user authentication before rendering routes.

```tsx
<ProtectedRoute>
  <SecureComponent />
</ProtectedRoute>
```

#### `Loading.tsx`
Loading states and skeleton screens.

```tsx
<Loading type="spinner" size="lg" />
<Loading type="skeleton" count={3} />
```

## 🎯 UI Components (shadcn/ui)

### Base Components

Located in `src/components/ui/`, these are customizable primitives:

- **Button**: `button.tsx` - Various button styles and states
- **Card**: `card.tsx` - Container layouts
- **Dialog**: `dialog.tsx` - Modal dialogs
- **Input**: `input.tsx` - Form inputs
- **Select**: `select.tsx` - Dropdown selectors
- **Tabs**: `tabs.tsx` - Tab navigation
- **Toast**: `toast.tsx` - Notification toasts

### Component Variants

Use `class-variance-authority` for consistent variants:

```tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
        destructive: "destructive-styles"
      },
      size: {
        sm: "small-styles",
        md: "medium-styles", 
        lg: "large-styles"
      }
    }
  }
)
```

## 🔧 Development Guidelines

### Creating New Components

1. **Location**: Place in appropriate subdirectory
2. **TypeScript**: Use proper interfaces and props typing
3. **Styling**: Use semantic tokens from design system
4. **Accessibility**: Include ARIA attributes and keyboard navigation
5. **Documentation**: Add JSDoc comments for props

### Component Template

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  /** Component description */
  prop: string;
  /** Optional prop with default */
  optional?: boolean;
  /** Event handlers */
  onClick?: () => void;
}

/**
 * Component description
 * @param props - Component props
 * @returns JSX element
 */
export const Component: React.FC<ComponentProps> = ({
  prop,
  optional = false,
  onClick,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "base-styles",
        optional && "optional-styles"
      )}
      onClick={onClick}
      {...props}
    >
      {prop}
    </div>
  );
};
```

### Styling Best Practices

#### ✅ DO: Use Semantic Tokens
```tsx
<div className="bg-background text-foreground border-border">
```

#### ❌ DON'T: Use Direct Colors
```tsx
<div className="bg-white text-black border-gray-200">
```

#### ✅ DO: Use Design System Utilities
```tsx
<Button variant="secondary" size="lg">
```

#### ❌ DON'T: Custom Inline Styles
```tsx
<button style={{ backgroundColor: '#fff' }}>
```

## 📱 Responsive Design

All components should follow mobile-first responsive design:

```tsx
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Content</div>
  <div className="w-full md:w-1/2">Content</div>
</div>
```

## ♿ Accessibility

### Required Accessibility Features

- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Management**: Proper focus indicators and management
- **Color Contrast**: Meet WCAG 2.1 AA standards

### Example Accessible Component

```tsx
<button
  className="focus:outline-none focus:ring-2 focus:ring-primary"
  aria-label="Close dialog"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</button>
```

## 🧪 Testing Components

### Component Testing Pattern

```tsx
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component prop="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('handles interactions', () => {
    const mockClick = jest.fn();
    render(<Component onClick={mockClick} />);
    // Test interactions
  });
});
```

## 🔄 Component Lifecycle

### State Management
- Use `useState` for local component state
- Use `useContext` for shared state
- Use `useReducer` for complex state logic

### Performance Optimization
- Use `React.memo` for expensive renders
- Use `useCallback` for stable function references
- Use `useMemo` for expensive calculations

## 📚 Related Documentation

- [🎨 Design System](../index.css) - Color tokens and CSS variables
- [🛠️ Utils](../utils/README.md) - Utility functions for components
- [🔧 Config](../config/README.md) - Component configuration options
- [📄 Types](../types/README.md) - TypeScript interfaces for components

---

For component-specific questions or contributions, refer to the individual component files or create an issue in the repository.