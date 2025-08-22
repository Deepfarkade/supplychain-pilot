# Nexus AI Hub - Production-Ready Microservice Platform

A production-grade React application built with TypeScript, Vite, and TailwindCSS for managing AI-powered microservices across General, Supply Chain, and Pharmaceutical domains.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🏗️ Production Architecture

### Core Production Components
- **MicroserviceShell**: Production-optimized layout wrapper with automatic defaults
- **Production Defaults**: Centralized configuration system (`/src/config/microservice-defaults.ts`)
- **EmbeddedApp**: Reusable container optimized for maximum space utilization
- **Registry System**: Single source of truth for tiles and routes with lazy loading
- **ErrorBoundary**: Production error handling with reporting and recovery

## 📋 Adding New Microservices

Adding a microservice is **production-streamlined** - just one registry entry:

### 1. Create Your Component
```tsx
// /src/microservices/{domain}/{slug}/index.tsx
import React from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';

const MyService: React.FC = () => (
  <MicroserviceShell 
    title="My Service" 
    description="Service description"
    // Automatically uses production defaults for optimal layout
  >
    {/* Your content here */}
  </MicroserviceShell>
);

export default MyService;
```

### 2. Register Once
```ts
// Add to /src/microservices/registry.ts
{
  id: 'my-service',
  domain: 'general',
  slug: 'my-service',
  name: 'My Service',
  path: '/app/general/my-service',
  description: 'Brief description for the app store card',
  icon: YourIcon,
  element: () => import('@/microservices/general/my-service/index'),
  // Production defaults applied automatically
}
```

### 3. Deploy
Your tile appears in AppStore and the route works automatically with production optimization! ✨

## 🎛️ Production Configuration System

### Centralized Defaults
All microservices inherit optimal production settings automatically:

```tsx
// From /src/config/microservice-defaults.ts
DEFAULT_LAYOUT = {
  fullBleed: true,    // Maximum space utilization
  header: 'compact',  // Optimized header height
  padding: 'none',    // Minimal padding for embedded apps
  background: 'default'
}
```

### Override When Needed
```tsx
// Override specific settings per microservice
<MicroserviceShell
  layout={{ padding: 'md' }}  // Override only what you need
  // All other defaults applied automatically
>
```

### Embedded Applications
```tsx
// Use EmbeddedApp for consistent iframe containers
import { EmbeddedApp } from '@/components/EmbeddedApp';

<EmbeddedApp height="90vh"> {/* Override height if needed */}
  <iframe src="your-app-url" />
</EmbeddedApp>
```

## 🏢 Production Microservices

### **General Domain (3 Services)**
- **Conversational Agents** - AI chat interface with custom prompts
- **Direct GPT** - Azure OpenAI playground for model testing
- **Document Comparer** - AI-powered document analysis and Q&A

### **Supply Chain Domain (5 Services)**  
- **RFQ-to-Award Co-Pilot** - Procurement automation and supplier selection
- **Demand Forecast Review** - ML-powered supply chain analytics
- **Supplier Risk Monitor** - Real-time risk assessment and monitoring
- **Inventory Rebalancer** - AI inventory optimization across networks
- **Order Management Agent** - ✅ **LIVE** - Full order processing system

### **Pharma Domain (3 Services)**
- **Batch Release Assistant** - AI batch release decision support
- **Deviation CAPA Summarizer** - Quality management automation
- **Regulatory Dossier Helper** - Regulatory compliance assistant

## ✅ Production Checklist Status

### 🔒 Security & Performance
- [x] Input sanitization (XSS protection)
- [x] Centralized API client with validation  
- [x] JWT-based authentication & session management
- [x] Route-based lazy loading & code splitting
- [x] Error boundaries with graceful fallbacks

### 🎨 User Experience
- [x] Fully responsive design (mobile-first)
- [x] Dark/light theme with system detection
- [x] Accessibility (ARIA, keyboard nav, screen readers)
- [x] Loading states & skeleton screens
- [x] Toast notifications for user feedback

### 📊 SEO & Analytics  
- [x] Dynamic meta tags per microservice
- [x] Structured data (JSON-LD markup)
- [x] Clean, SEO-friendly URLs
- [x] Core Web Vitals optimization
- [x] Analytics event tracking ready

### 🚀 Production Deployment
- [x] Optimized Vite build configuration
- [x] Asset optimization & lazy loading
- [x] Source maps for production debugging
- [x] Health checks & monitoring ready
- [x] All 11 microservices following standards

## 🛠️ Development Workflow

### Key Production Files
```
/src/config/microservice-defaults.ts  # Production layout defaults
/src/components/MicroserviceShell.tsx # Layout wrapper
/src/components/EmbeddedApp.tsx       # Optimized iframe container
/src/microservices/registry.ts       # Service configuration
/src/utils/security.ts               # Security utilities
/docs/PRODUCTION_CHECKLIST.md        # Full production guide
```

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build  
npm run lint         # Code quality checks
npm run type-check   # TypeScript validation
```

## 📈 Performance Features

- ⚡ **Route-based lazy loading** - Each microservice loads on demand
- 🎨 **Memoized components** - Optimized re-rendering
- 🔍 **Debounced search** - Smooth user interactions  
- 💀 **Skeleton loaders** - Perceived performance boost
- 📦 **Code splitting** - Minimal initial bundle size
- 🖼️ **Image optimization** - Lazy loading with proper sizing

## 🔗 Documentation

- [Production Checklist](docs/PRODUCTION_CHECKLIST.md) - Complete production readiness guide
- [Architecture Overview](docs/ARCHITECTURE.md) - System design and patterns

---

**Status: ✅ PRODUCTION READY**

Built with ❤️ using React 18, TypeScript, Vite, and TailwindCSS for enterprise-grade performance and scalability.