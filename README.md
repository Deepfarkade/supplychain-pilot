# Nexus AI Hub - Production-Ready Microservice Platform

A production-grade React application built with TypeScript, Vite, and TailwindCSS for managing AI-powered microservices across General, Supply Chain, and Pharmaceutical domains.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📋 How to Add a Microservice

Adding a new microservice is incredibly simple - just **one entry** in the registry:

1. **Create your component** in `/src/microservices/{domain}/{slug}/index.tsx`
   ```tsx
   // Example: /src/microservices/general/my-service/index.tsx
   import React from 'react';
   import { MicroserviceShell } from '@/components/MicroserviceShell';
   
   const MyService: React.FC = () => (
     <MicroserviceShell title="My Service" description="Service description">
       {/* Your content here */}
     </MicroserviceShell>
   );
   
   export default MyService;
   ```

2. **Add one entry** to `/src/microservices/registry.ts`:
   ```ts
   {
     id: 'my-service',
     domain: 'general',
     slug: 'my-service',
     name: 'My Service',
     path: '/app/general/my-service',
     description: 'Brief description for the app store card',
     icon: YourIcon, // From lucide-react
     element: () => import('@/microservices/general/my-service'),
     // ... other optional config
   }
   ```

3. **Run the app** - Your tile appears in AppStore and the route works automatically! ✨

## 🏗️ Architecture

### Core Components
- **MicroserviceShell**: Consistent layout wrapper for all services
- **MicroserviceContainer**: Production-grade lazy loading with error boundaries
- **Registry System**: Single source of truth for tiles and routes
- **ErrorBoundary**: Global error handling with reporting
- **Security Utils**: Input sanitization and API client

### Performance Features
- ⚡ Route-based lazy loading
- 🎨 Memoized components
- 🔍 Debounced search
- 💀 Skeleton loaders
- 📦 Code splitting

## 🔒 Security & Production Checklist

### ✅ Security Baselines
- [x] Input sanitization (XSS protection)
- [x] Centralized API client with validation
- [x] Safe environment variable handling
- [x] Rate limiting utilities
- [x] Content Security Policy helpers

### ✅ Performance Optimizations
- [x] Lazy loading for all microservices
- [x] Memoized expensive components
- [x] Debounced search inputs
- [x] Skeleton loading states
- [x] Error boundaries with fallbacks

### ✅ Production Features
- [x] Global error reporting
- [x] Responsive design with accessibility
- [x] SEO metadata management
- [x] Theme persistence
- [x] Session management

## 🎨 Layout Conventions

All microservices use the **MicroserviceShell** component for consistency:

```tsx
<MicroserviceShell
  title="Service Name"
  description="Service description"
  icon={ServiceIcon}
  breadcrumbs={[{ label: 'Domain' }, { label: 'Service' }]}
  layout={{
    fullBleed: true,     // Full viewport usage
    header: 'compact',   // Compact header height
    padding: 'md'        // Content padding
  }}
  metadata={{
    title: 'SEO Title',
    description: 'SEO Description'
  }}
>
  {/* Your service content */}
</MicroserviceShell>
```

## 🛠️ Development

### Key Files
- `/src/microservices/registry.ts` - Microservice configuration
- `/src/components/MicroserviceShell.tsx` - Layout wrapper
- `/src/types/microservice.ts` - Type definitions
- `/src/utils/security.ts` - Security utilities
- `/src/services/api.ts` - Centralized API client

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run type-check` - TypeScript validation

## 📊 Domains

- **General**: AI chat, document analysis, GPT playground
- **Supply Chain**: RFQ processing, demand forecasting, risk monitoring
- **Pharma**: Batch release, deviation analysis, regulatory compliance

---

Built with ❤️ using React, TypeScript, Vite, and TailwindCSS.