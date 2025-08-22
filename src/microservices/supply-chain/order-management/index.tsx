import React from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      layout={{ fullBleed: true, header: 'compact', padding: 'md' }}
      metadata={{
        title: 'Order Management Agent - Order Processing',
        description: 'AI-powered order processing and management with intelligent chat assistance'
      }}
    >
      <div className="space-y-6">
        <div className="flex gap-2">
          <Badge variant="secondary">AI-Powered</Badge>
          <Badge variant="secondary">Order Processing</Badge>
          <Badge variant="secondary">Chat Assistant</Badge>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Management Chat Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Interact with our AI-powered order management system to process orders, track shipments, and manage your supply chain operations efficiently.
                </p>
                
                {/* Chat iframe with same dimensions as RFQ upload box */}
                <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <iframe
                    src="https://geni-ai-supply-chain-decisioning.wonderfulbush-77ea8b18.centralindia.azurecontainerapps.io/"
                    className="w-full h-full border-0"
                    title="Order Management Chat"
                    allow="microphone; camera"
                  />
                </div>
                
                <div className="flex gap-3 justify-end">
                  <Button variant="outline">
                    Export Chat History
                  </Button>
                  <Button>
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MicroserviceShell>
  );
};

export default OrderManagement;