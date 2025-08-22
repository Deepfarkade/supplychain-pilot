# 📄 Pages Directory

> Route components and main application pages

## 📁 Structure

```
src/pages/
├── ApiSettings.tsx       # API configuration management
├── AppStore.tsx         # Microservice marketplace
├── Home.tsx            # Dashboard and main landing
├── Index.tsx           # Application entry point
├── Login.tsx           # Authentication interface
├── NotFound.tsx        # 404 error handling
└── Settings.tsx        # User and system settings
```

## 🏠 Core Pages

### `Home.tsx` - Dashboard

Main dashboard showing overview of available microservices and recent activity.

```tsx
// Key Features:
- Welcome message and user greeting
- Quick access to recent microservices
- System status indicators
- Performance metrics dashboard
- Navigation shortcuts
```

#### Features:
- **User Dashboard**: Personalized welcome and recent activity
- **Quick Access**: Recently used services and favorites
- **System Overview**: Health status and performance metrics
- **Navigation Hub**: Quick links to all major sections

```tsx
import { Home } from '@/pages/Home';

// Automatic features:
// - Responsive layout
// - Loading states
// - Error boundaries
// - SEO optimization
```

### `AppStore.tsx` - Service Marketplace

Discover and access all available microservices organized by business domain.

```tsx
// Key Features:
- Service discovery and browsing
- Domain-based organization (General, Supply Chain, Pharma)
- Service status indicators (Active, Development, Maintenance)
- Search and filtering capabilities
- Service cards with descriptions and tags
```

#### Features:
- **Service Cards**: Visual tiles for each microservice
- **Domain Categories**: Organized by business domains
- **Status Indicators**: Shows service availability
- **Search & Filter**: Find services quickly
- **Responsive Grid**: Adaptive layout for all screen sizes

```tsx
// Service card structure
<AppCard
  service={service}
  onClick={() => navigate(service.path)}
  disabled={service.status !== 'active'}
/>
```

### `Login.tsx` - Authentication

Secure authentication interface with JWT token management.

```tsx
// Key Features:
- JWT-based authentication
- Secure credential handling
- Session management
- Remember me functionality
- Password reset flow
```

#### Features:
- **Secure Authentication**: JWT token-based login
- **Form Validation**: Real-time input validation
- **Error Handling**: Clear error messages and recovery
- **Session Persistence**: Remember user sessions
- **Security**: Input sanitization and CSRF protection

```tsx
// Login form integration
const { login, loading, error } = useAuth();

const handleSubmit = async (credentials) => {
  try {
    await login(credentials);
    navigate('/');
  } catch (error) {
    // Error handling
  }
};
```

## ⚙️ Configuration Pages

### `Settings.tsx` - System Configuration

Comprehensive settings management for database, security, and user preferences.

```tsx
// Key Features:
- Database configuration (MongoDB)
- Security settings (JWT, session timeout)
- API configuration access
- User profile management
- Theme preferences
```

#### Settings Tabs:
1. **Database**: MongoDB connection configuration
2. **API Settings**: Backend API endpoints and security
3. **Security**: Authentication and session settings
4. **Profile**: User information and preferences

```tsx
// Settings tab structure
<Tabs defaultValue="database">
  <TabsList>
    <TabsTrigger value="database">Database</TabsTrigger>
    <TabsTrigger value="api">API Settings</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="profile">Profile</TabsTrigger>
  </TabsList>
  
  <TabsContent value="database">
    <DatabaseConfig />
  </TabsContent>
  {/* Other tabs */}
</Tabs>
```

### `ApiSettings.tsx` - API Management

Dedicated interface for managing all API configurations and endpoints.

```tsx
// Key Features:
- Centralized API endpoint management
- Security configuration (encryption, signing)
- Request timeout and retry settings
- Environment-specific configurations
- Real-time API testing
```

#### Features:
- **Endpoint Configuration**: Manage all API URLs
- **Security Settings**: Encryption keys, request signing
- **Performance Tuning**: Timeouts, retries, rate limiting
- **Testing Interface**: Test API connections
- **Environment Management**: Dev/staging/production configs

## 🚨 Error Pages

### `NotFound.tsx` - 404 Error Handling

Professional error handling with modal-based user experience.

```tsx
// Key Features:
- Modal-based error display (not basic 404 page)
- Professional error messages
- Navigation options (Home, Back)
- Consistent with application design
- Accessible error handling
```

#### Error Modal Features:
- **Professional Design**: Consistent with app theme
- **Clear Messaging**: User-friendly error explanations
- **Action Buttons**: Home, Go Back, Retry options
- **Keyboard Accessible**: Full keyboard navigation
- **Mobile Responsive**: Works on all screen sizes

```tsx
// Error modal implementation
<RouteErrorModal
  isOpen={true}
  onClose={() => navigate('/')}
  error={{
    title: 'Page Not Found',
    message: 'The requested page could not be found.',
    type: 'not-found'
  }}
/>
```

## 🏗️ Page Architecture

### Page Structure Pattern

All pages follow a consistent structure:

```tsx
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const PageComponent: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Page Title"
          description="Page description"
          breadcrumbs={breadcrumbs}
        />
        
        <main className="container mx-auto px-4 py-6">
          {/* Page content */}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default PageComponent;
```

### SEO Implementation

All pages include comprehensive SEO:

```tsx
// SEO metadata for each page
useEffect(() => {
  document.title = 'Page Title - Nexus AI Hub';
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Page description for SEO');
  }
  
  // Structured data for search engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Title",
    "description": "Page description",
    "url": window.location.href
  };
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
  
  return () => {
    document.head.removeChild(script);
  };
}, []);
```

## 🛡️ Route Protection

### Protected Route Implementation

Most pages use route protection:

```tsx
// In App.tsx
<Route 
  path="/settings" 
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  } 
/>

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Loading />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

### Route Error Handling

Pages handle route errors gracefully:

```tsx
// Route error handling
const PageComponent = () => {
  const { showRouteError } = useRouteError();
  
  useEffect(() => {
    // Check if page/service is available
    if (!isServiceAvailable) {
      showRouteError({
        title: 'Service Unavailable',
        message: 'This service is temporarily unavailable.',
        type: 'service-unavailable'
      });
    }
  }, []);
};
```

## 📱 Responsive Design

All pages implement mobile-first responsive design:

```tsx
// Responsive layout patterns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>

<div className="flex flex-col lg:flex-row gap-6">
  <aside className="lg:w-1/4">
    {/* Sidebar */}
  </aside>
  <main className="lg:w-3/4">
    {/* Main content */}
  </main>
</div>
```

## 🎨 Design System Integration

Pages use the centralized design system:

```tsx
// Design system usage
<Card className="border border-border bg-card">
  <CardHeader>
    <CardTitle className="text-card-foreground">Title</CardTitle>
  </CardHeader>
  <CardContent className="text-muted-foreground">
    Content
  </CardContent>
</Card>

// Theme-aware styling
<div className="bg-background text-foreground">
  <Button variant="default" size="lg">
    Action Button
  </Button>
</div>
```

## 🧪 Page Testing

### Testing Pattern

```tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import PageComponent from './PageComponent';

const renderPage = (props = {}) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <PageComponent {...props} />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('PageComponent', () => {
  it('renders page title', () => {
    renderPage();
    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });
  
  it('requires authentication', () => {
    // Test route protection
  });
  
  it('handles loading states', () => {
    // Test loading behavior
  });
  
  it('handles errors gracefully', () => {
    // Test error handling
  });
});
```

## ⚡ Performance Optimization

### Page Performance

```tsx
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Memoize expensive calculations
const processedData = useMemo(() => {
  return processLargeDataset(rawData);
}, [rawData]);

// Optimize re-renders
const PageComponent = memo(() => {
  // Component implementation
});
```

### Code Splitting

```tsx
// Route-level code splitting (automatic)
const LazyPage = lazy(() => import('@/pages/PageComponent'));

// Component-level splitting
const LazyComponent = lazy(() => 
  import('@/components/ExpensiveComponent')
);
```

## 📊 Analytics Integration

Pages include analytics tracking:

```tsx
// Page view tracking
useEffect(() => {
  trackPageView({
    page: 'settings',
    title: 'Settings Page',
    path: '/settings'
  });
}, []);

// User interaction tracking
const handleFeatureUse = (feature: string) => {
  trackEvent('page_interaction', {
    page: 'settings',
    feature,
    timestamp: Date.now()
  });
};
```

## 📚 Related Documentation

- [🧩 Components](../components/README.md) - PageHeader, routing components
- [🌐 Contexts](../contexts/README.md) - Authentication and state management  
- [🪝 Hooks](../hooks/README.md) - Page-specific custom hooks
- [🔒 Security](../security/README.md) - Route protection and authentication

---

For page-specific questions or adding new pages, refer to the existing page implementations or create an issue in the repository.
