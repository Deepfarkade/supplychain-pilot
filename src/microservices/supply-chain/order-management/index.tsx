import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppHeader } from '@/components/AppHeader';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderManagement: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/appstore');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 network-pattern" />
        <div className="absolute inset-0 dotted-pattern opacity-30" />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 hover:bg-accent/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to App Store
            </Button>
          </div>
          
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Order Management Agent
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Intelligent order processing and management with AI-powered chat assistance for streamlined operations
            </p>
            <div className="flex gap-2 justify-center">
              <Badge variant="secondary">AI-Powered</Badge>
              <Badge variant="secondary">Supply Chain</Badge>
              <Badge variant="secondary">Order Management</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
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
                    src="http://localhost:5678/webhook/136ebda1-31fc-4444-868c-ca9fa34f3bc7/chat"
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
    </div>
  );
};

export default OrderManagement;