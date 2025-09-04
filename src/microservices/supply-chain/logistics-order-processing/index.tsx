import React, { useState } from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Truck, ChevronDown, ExternalLink, Mail, AlertTriangle } from 'lucide-react';

const LogisticsOrderProcessing: React.FC = () => {
  const [isExampleOpen, setIsExampleOpen] = useState(false);

  const breadcrumbs = [
    { label: 'Supply Chain' },
    { label: 'Logistics Order Processing' }
  ];

  // Live data is displayed via the embedded Google Sheet below
  // All filtering and searching is handled directly in the sheet

  const googleSheetUrl = "https://docs.google.com/spreadsheets/d/1YusTkKbZESXfhF4XVV4_escOJZDWdicUoN7fsRqTj5A/edit?pli=1&gid=0#gid=0";

  return (
    <MicroserviceShell
      title="Logistics Order Processing Agent"
      description="An autonomous agent that monitors inbound orders, parses details, and seamlessly syncs them for operational visibility."
      icon={Truck}
      breadcrumbs={breadcrumbs}
      metadata={{
        title: 'Logistics Order Processing Agent - Order Monitoring',
        description: 'Autonomous agent for monitoring inbound orders and operational visibility'
      }}
    >
      <div className="space-y-6">
        {/* Status Badges */}
        <div className="flex gap-2">
          <Badge variant="secondary">Autonomous Agent</Badge>
          <Badge variant="secondary">Order Monitoring</Badge>
          <Badge variant="secondary">Real-time Sync</Badge>
        </div>

        {/* Alert Notice */}
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-medium text-orange-900 dark:text-orange-100">🚨 Please Note</h3>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  To test this workflow: Send an email to <strong>request.purchase.order1@gmail.com</strong> in the required format.
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  The AI Agent will extract PO details and push them into this dashboard.
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  You can deep dive into the raw sheet if needed.
                </p>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(googleSheetUrl, '_blank')}
                    className="bg-white/50 hover:bg-white/80 border-orange-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    👉 View Full Google Sheet
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Sheets Embed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Live Order Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border/20 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <iframe
                src={`${googleSheetUrl}&rm=minimal`}
                className="w-full h-full border-0"
                title="Live Order Processing Sheet"
                allow="fullscreen"
              />
            </div>
          </CardContent>
        </Card>

        {/* Example Email Section */}
        <Collapsible open={isExampleOpen} onOpenChange={setIsExampleOpen}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    📧 Example Email Format
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isExampleOpen ? 'rotate-180' : ''}`} />
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Subject:</h4>
                    <p className="text-sm bg-muted p-3 rounded-md font-mono">
                      Inbound Order PO45231 – Expected Delivery on 2025-03-27
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Body:</h4>
                    <div className="text-sm bg-muted p-4 rounded-md font-mono space-y-2">
                      <p>Dear Procurement Team,</p>
                      <p></p>
                      <p>Please find the purchase order details below:</p>
                      <p></p>
                      <p>PO Number: PO45231</p>
                      <p>Expected Delivery: 2025-03-27</p>
                      <p></p>
                      <p>Order Lines:</p>
                      <p>- SKU: SKU-001-XYZ, Quantity: 500</p>
                      <p>- SKU: SKU-002-ABC, Quantity: 250</p>
                      <p></p>
                      <p>Please confirm receipt and processing.</p>
                      <p></p>
                      <p>Best regards,</p>
                      <p>Supplier Team</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This will help anyone new to the system test it right away.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline">
            Refresh Data
          </Button>
          <Button>
            Export Report
          </Button>
        </div>
      </div>
    </MicroserviceShell>
  );
};

export default LogisticsOrderProcessing;