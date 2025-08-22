/**
 * Regulatory Dossier Helper Microservice - Regulatory Compliance
 */

import React from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

const RegulatoryDossier: React.FC = () => {
  const breadcrumbs = [
    { label: 'Pharma' },
    { label: 'Regulatory Dossier' }
  ];

  return (
    <MicroserviceShell
      title="Regulatory Dossier Helper"
      description="Intelligent regulatory document preparation and compliance verification assistant"
      icon={FileText}
      breadcrumbs={breadcrumbs}
      // Uses production defaults
      metadata={{
        title: 'Regulatory Dossier Helper - Regulatory Compliance',
        description: 'AI-powered regulatory document preparation and compliance verification'
      }}
    >
      <div className="w-full space-y-6">
        <div className="flex gap-2">
          <Badge variant="secondary">Regulatory</Badge>
          <Badge variant="secondary">Dossier</Badge>
          <Badge variant="secondary">Compliance</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Regulatory Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Streamline regulatory dossier preparation with intelligent document generation and
                compliance verification. Ensure regulatory submissions meet all requirements efficiently.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🚀 <strong>Coming Soon:</strong> Document templates, compliance checking,
                  regulatory intelligence, and submission preparation tools.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MicroserviceShell>
  );
};

export default RegulatoryDossier;