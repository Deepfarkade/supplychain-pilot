/**
 * Deviation CAPA Summarizer Microservice - Quality Management
 */

import React from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const DeviationCAPA: React.FC = () => {
  const breadcrumbs = [
    { label: 'Pharma' },
    { label: 'Deviation CAPA' }
  ];

  return (
    <MicroserviceShell
      title="Deviation CAPA Summarizer"
      description="Automated deviation analysis and CAPA recommendation generation for quality management"
      icon={AlertTriangle}
      breadcrumbs={breadcrumbs}
      layout={{ fullBleed: true, header: 'compact', padding: 'md' }}
      metadata={{
        title: 'Deviation CAPA Summarizer - Quality Management',
        description: 'Automated deviation analysis and CAPA recommendations for pharmaceutical quality'
      }}
    >
      <div className="w-full space-y-6">
        <div className="flex gap-2">
          <Badge variant="secondary">Quality</Badge>
          <Badge variant="secondary">Deviation Analysis</Badge>
          <Badge variant="secondary">CAPA</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Automated Deviation Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Streamline deviation handling with AI-powered analysis and CAPA recommendation generation.
                Improve quality management efficiency and ensure consistent corrective action processes.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🚀 <strong>Coming Soon:</strong> Deviation classification, root cause analysis,
                  CAPA recommendation engine, and quality trend analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MicroserviceShell>
  );
};

export default DeviationCAPA;