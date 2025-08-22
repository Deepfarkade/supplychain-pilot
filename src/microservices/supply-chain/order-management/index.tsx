import React from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { EmbeddedApp } from '@/components/EmbeddedApp';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList } from 'lucide-react';

const OrderManagement: React.FC = () => {
  const breadcrumbs = [
    { label: 'Supply Chain' },
    { label: 'Order Management' }
  ];

  return (
    <MicroserviceShell
      title="Order Management Agent"
      description="Intelligent order processing and management with AI-powered chat assistance"
      icon={ClipboardList}
      breadcrumbs={breadcrumbs}
      // Uses production defaults automatically
      metadata={{
        title: 'Order Management Agent - Order Processing',
        description: 'AI-powered order processing and management with intelligent chat assistance'
      }}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <Badge variant="secondary">AI-Powered</Badge>
          <Badge variant="secondary">Order Processing</Badge>
          <Badge variant="secondary">Chat Assistant</Badge>
        </div>

        <EmbeddedApp height="90vh">
          <iframe
            src="https://geni-ai-supply-chain-decisioning.wonderfulbush-77ea8b18.centralindia.azurecontainerapps.io/"
            className="w-full h-full border-0"
            title="Order Management Chat"
            allow="microphone; camera"
          />
        </EmbeddedApp>
        
        <div className="flex gap-3 justify-end">
          <Button variant="outline">
            Export Chat History
          </Button>
          <Button>
            Generate Report
          </Button>
        </div>
      </div>
    </MicroserviceShell>
  );
};

export default OrderManagement;