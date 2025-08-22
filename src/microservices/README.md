# 🚀 Microservices Directory

> Business domain services and microservice architecture implementation

## 📁 Structure

```
src/microservices/
├── registry.ts             # Service registry and configuration
├── general/                # AI and general-purpose services
│   ├── conversational-agents/
│   ├── direct-gpt/
│   └── document-comparer/
├── supply-chain/           # Supply chain domain services
│   ├── demand-forecast/
│   ├── inventory-rebalancer/
│   ├── order-management/
│   ├── rfq-to-award/
│   └── supplier-risk/
└── pharma/                 # Pharmaceutical domain services
    ├── batch-release/
    ├── deviation-capa/
    └── regulatory-dossier/
```

## 🏗️ Microservice Architecture

### Core Principles

- **Domain-Driven Design**: Services organized by business domains
- **Single Responsibility**: Each service handles one business capability
- **Loose Coupling**: Services communicate through well-defined APIs
- **Production-Ready**: All services follow enterprise standards
- **Scalable**: Easy to add, update, and deploy individual services

### Service Registry System

The `registry.ts` file serves as the single source of truth for all microservices:

```typescript
// Example registry entry
{
  id: 'order-management',
  domain: 'supply-chain',
  slug: 'order-management',
  name: 'Order Management Agent',
  path: '/app/supply-chain/order-management',
  description: 'AI-powered order processing and management',
  icon: ClipboardList,
  element: () => import('@/microservices/supply-chain/order-management/index'),
  status: 'active',
  tags: ['AI-Powered', 'Order Processing', 'Chat Assistant']
}
```

## 🎯 Business Domains

### 🤖 General Domain

**Purpose**: AI-powered general services and document processing

#### Services:

**Conversational Agents** (`/general/conversational-agents`)
- AI chat interface with custom prompts
- Multi-model support (GPT-4, Claude, Gemini)
- Conversation history and context management
- Custom prompt templates

**Direct GPT** (`/general/direct-gpt`) 
- Azure OpenAI playground interface
- Model parameter tuning
- Response analysis and comparison
- API key management

**Document Comparer** (`/general/document-comparer`)
- AI-powered document analysis
- Question-answering on documents
- Document similarity comparison
- Support for multiple file formats

### 🏭 Supply Chain Domain

**Purpose**: Supply chain optimization and management

#### Services:

**Order Management Agent** (`/supply-chain/order-management`) ✅ **LIVE**
- Full order processing system
- AI-powered chat assistance
- Real-time order tracking
- Integration with external systems

**RFQ-to-Award Co-Pilot** (`/supply-chain/rfq-to-award`)
- Procurement automation
- Supplier selection optimization
- Contract negotiation assistance
- Risk assessment integration

**Demand Forecast Review** (`/supply-chain/demand-forecast`)
- ML-powered demand forecasting
- Historical data analysis
- Seasonal trend identification
- Supply planning recommendations

**Supplier Risk Monitor** (`/supply-chain/supplier-risk`)
- Real-time risk assessment
- Supplier performance monitoring
- Alert system for risk events
- Risk mitigation recommendations

**Inventory Rebalancer** (`/supply-chain/inventory-rebalancer`)
- AI inventory optimization
- Cross-location balancing
- Demand-supply matching
- Cost optimization algorithms

### 💊 Pharmaceutical Domain

**Purpose**: Pharmaceutical compliance and quality management

#### Services:

**Batch Release Assistant** (`/pharma/batch-release`)
- AI batch release decision support
- Quality control data analysis
- Regulatory compliance checking
- Documentation automation

**Deviation CAPA Summarizer** (`/pharma/deviation-capa`)
- Quality management automation
- Deviation investigation assistance
- CAPA (Corrective and Preventive Action) tracking
- Regulatory reporting

**Regulatory Dossier Helper** (`/pharma/regulatory-dossier`)
- Regulatory compliance assistant
- Dossier document management
- Submission timeline tracking
- Compliance gap analysis

## 🛠️ Adding New Microservices

### Quick Setup (3 Steps)

#### 1. Create Service Component

```tsx
// /src/microservices/{domain}/{slug}/index.tsx
import React from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';

const MyService: React.FC = () => {
  const breadcrumbs = [
    { label: 'Domain Name' },
    { label: 'Service Name' }
  ];

  return (
    <MicroserviceShell
      title="My Service"
      description="Service description for users and SEO"
      icon={ServiceIcon}
      breadcrumbs={breadcrumbs}
      metadata={{
        title: 'My Service - SEO Title',
        description: 'SEO-optimized description for search engines'
      }}
    >
      {/* Your service content */}
      <div className="space-y-4">
        {/* Service implementation */}
      </div>
    </MicroserviceShell>
  );
};

export default MyService;
```

#### 2. Register Service

```typescript
// Add to /src/microservices/registry.ts
{
  id: 'my-service',
  domain: 'general', // or 'supply-chain', 'pharma'
  slug: 'my-service',
  name: 'My Service',
  path: '/app/general/my-service',
  description: 'Brief description for the app store tile',
  icon: ServiceIcon,
  element: () => import('@/microservices/general/my-service/index'),
  status: 'active', // 'active', 'development', 'maintenance'
  tags: ['AI-Powered', 'Custom Tag']
}
```

#### 3. Deploy ✅

Your service automatically:
- Appears in the App Store
- Has a working route with lazy loading
- Includes error boundaries and loading states
- Follows production optimization standards

### Advanced Configuration

#### Custom Layout Settings

```tsx
<MicroserviceShell
  title="Advanced Service"
  layout={{
    padding: 'lg',        // Override default 'none'
    background: 'muted',  // Override default 'default'
    header: 'normal'      // Override default 'compact'
  }}
>
```

#### Embedded Applications

```tsx
import { EmbeddedApp } from '@/components/EmbeddedApp';

<MicroserviceShell title="External Service">
  <EmbeddedApp height="85vh">
    <iframe
      src="https://external-service-url.com"
      className="w-full h-full border-0"
      title="External Service"
      allow="microphone; camera"
    />
  </EmbeddedApp>
</MicroserviceShell>
```

#### Service Status Management

```typescript
// In registry.ts
{
  id: 'service-id',
  status: 'development', // Shows "Coming Soon" in App Store
  // OR
  status: 'maintenance', // Shows maintenance message
  // OR  
  status: 'active'       // Fully available
}
```

## 🏗️ Service Architecture Patterns

### Standard Service Structure

```
microservices/{domain}/{service}/
├── index.tsx           # Main service component
├── components/         # Service-specific components
│   ├── ServiceHeader.tsx
│   ├── ServiceContent.tsx
│   └── ServiceActions.tsx
├── hooks/             # Service-specific hooks
│   └── useServiceData.ts
├── types/             # Service-specific types
│   └── service.types.ts
└── utils/             # Service utilities
    └── serviceHelpers.ts
```

### Service Component Pattern

```tsx
// Standard service implementation pattern
import React from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { ServiceContent } from './components/ServiceContent';
import { useServiceData } from './hooks/useServiceData';

const ServiceComponent: React.FC = () => {
  const { data, loading, error } = useServiceData();
  const breadcrumbs = [
    { label: 'Domain' },
    { label: 'Service Name' }
  ];

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <MicroserviceShell
      title="Service Name"
      description="Service description"
      breadcrumbs={breadcrumbs}
      metadata={{
        title: 'Service Name - SEO Title',
        description: 'SEO description'
      }}
    >
      <ServiceContent data={data} />
    </MicroserviceShell>
  );
};

export default ServiceComponent;
```

## 🔧 Service Configuration

### Default Configuration

All services inherit production-optimized defaults from `src/config/microservice-defaults.ts`:

```typescript
export const DEFAULT_LAYOUT = {
  fullBleed: true,        // Maximum space utilization
  header: 'compact',      // Optimized header height  
  padding: 'none',        // Minimal padding for embedded apps
  background: 'default'   // Theme-aware background
};

export const DEFAULT_SEO = {
  titleSuffix: ' - Nexus AI Hub',
  descriptionLength: 160,
  keywordDensity: 0.02
};
```

### Service-Specific Overrides

```tsx
// Override defaults for specific needs
<MicroserviceShell
  layout={{ 
    padding: 'md',          // More padding for form-heavy services
    background: 'muted'     // Different background for readability
  }}
  seo={{
    titleSuffix: ' - Custom Suffix',
    keywords: ['custom', 'keywords']
  }}
>
```

## 🔐 Service Security

### Input Sanitization

```tsx
import { sanitizeHtml } from '@/utils/security';

const ServiceComponent = () => {
  const handleUserInput = (input: string) => {
    const sanitized = sanitizeHtml(input);
    // Process sanitized input
  };
};
```

### API Security

```tsx
import { SecureApiClient } from '@/services/api';

const useServiceApi = () => {
  const apiClient = new SecureApiClient({
    encryption: true,
    signing: true,
    rateLimiting: true
  });
  
  return {
    fetchData: () => apiClient.get('/service-endpoint'),
    submitData: (data) => apiClient.post('/service-endpoint', data)
  };
};
```

## 📊 Service Performance

### Lazy Loading

All services are automatically lazy-loaded:

```typescript
// In registry.ts - automatic code splitting
element: () => import('@/microservices/domain/service/index')
```

### Service Optimization

```tsx
// Optimize service performance
import React, { memo, useMemo, useCallback } from 'react';

const ServiceComponent = memo(() => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return processLargeDataset(rawData);
  }, [rawData]);
  
  // Stable callback references
  const handleAction = useCallback((id: string) => {
    performAction(id);
  }, []);
  
  return <ServiceContent data={processedData} onAction={handleAction} />;
});
```

## 🧪 Service Testing

### Service Testing Pattern

```tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ServiceComponent from './index';

const renderService = (props = {}) => {
  return render(
    <BrowserRouter>
      <ServiceComponent {...props} />
    </BrowserRouter>
  );
};

describe('ServiceComponent', () => {
  it('renders service title', () => {
    renderService();
    expect(screen.getByText('Service Name')).toBeInTheDocument();
  });
  
  it('handles user interactions', async () => {
    renderService();
    // Test interactions
  });
});
```

## 📈 Service Analytics

### Usage Tracking

```tsx
import { trackEvent } from '@/services/analytics';

const ServiceComponent = () => {
  useEffect(() => {
    // Track service access
    trackEvent('service_accessed', {
      service_id: 'order-management',
      domain: 'supply-chain',
      timestamp: Date.now()
    });
  }, []);
  
  const handleFeatureUse = (feature: string) => {
    trackEvent('feature_used', {
      service_id: 'order-management',
      feature,
      user_id: user?.id
    });
  };
};
```

## 📚 Related Documentation

- [🧩 Components](../components/README.md) - MicroserviceShell and EmbeddedApp
- [🔧 Config](../config/README.md) - Microservice defaults and configuration
- [🌐 Services](../services/README.md) - API integration patterns
- [🔒 Security](../security/README.md) - Service security implementation

---

For microservice-specific questions or adding new services, refer to the registry configuration or create an issue in the repository.