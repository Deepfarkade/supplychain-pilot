/**
 * Direct GPT Microservice - Azure OpenAI Playground
 */

import React from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';

const DirectGPT: React.FC = () => {
  const breadcrumbs = [
    { label: 'General' },
    { label: 'Direct GPT' }
  ];

  return (
    <MicroserviceShell
      title="Direct GPT"
      description="Azure ChatGPT playground to explore different model capabilities and configurations"
      icon={Bot}
      breadcrumbs={breadcrumbs}
      layout={{ fullBleed: true, header: 'compact', padding: 'md' }}
      metadata={{
        title: 'Direct GPT - Azure OpenAI Playground',
        description: 'Explore Azure OpenAI models with interactive playground interface'
      }}
    >
      <div className="space-y-6">
        <div className="flex gap-2">
          <Badge variant="secondary">AI Models</Badge>
          <Badge variant="secondary">Azure OpenAI</Badge>
          <Badge variant="secondary">Playground</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Azure OpenAI Playground</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This microservice provides direct access to Azure OpenAI models for testing and experimentation.
                Explore different model capabilities, adjust parameters, and test various prompts.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🚀 <strong>Coming Soon:</strong> Interactive GPT playground interface with model selection,
                  parameter tuning, and conversation history.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MicroserviceShell>
  );
};

export default DirectGPT;