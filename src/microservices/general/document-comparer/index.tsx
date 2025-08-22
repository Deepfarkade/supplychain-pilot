/**
 * Document Comparer Microservice - AI Document Analysis
 */

import React from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSearch } from 'lucide-react';

const DocumentComparer: React.FC = () => {
  const breadcrumbs = [
    { label: 'General' },
    { label: 'Document Comparer' }
  ];

  return (
    <MicroserviceShell
      title="Document Comparer"
      description="Demonstrate GenAI power for knowledge base Q&A and document analysis"
      icon={FileSearch}
      breadcrumbs={breadcrumbs}
      // Uses production defaults
      metadata={{
        title: 'Document Comparer - AI Document Analysis',
        description: 'AI-powered document comparison and knowledge base Q&A system'
      }}
    >
      <div className="w-full space-y-6">
        <div className="flex gap-2">
          <Badge variant="secondary">Document AI</Badge>
          <Badge variant="secondary">Analysis</Badge>
          <Badge variant="secondary">Comparison</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Document Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Advanced document comparison and analysis using GenAI. Upload documents to compare content,
                extract insights, and get answers to your questions about document contents.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🚀 <strong>Coming Soon:</strong> Document upload interface, AI-powered comparison,
                  knowledge base Q&A, and intelligent document insights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MicroserviceShell>
  );
};

export default DocumentComparer;