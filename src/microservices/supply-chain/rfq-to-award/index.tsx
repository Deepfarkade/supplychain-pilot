import React, { useState } from 'react';
import { MicroserviceShell } from '@/components/MicroserviceShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, TrendingUp, CheckCircle, ShoppingCart } from 'lucide-react';

const RFQToAward: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [rfqData, setRfqData] = useState({
    title: '',
    description: '',
    requirements: '',
    budget: '',
    deadline: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setRfqData(prev => ({ ...prev, [field]: value }));
  };

  const breadcrumbs = [
    { label: 'Supply Chain' },
    { label: 'RFQ-to-Award' }
  ];

  return (
    <MicroserviceShell
      title="RFQ-to-Award Co-Pilot"
      description="Streamline procurement with AI-powered RFQ analysis and automated supplier selection"
      icon={ShoppingCart}
      breadcrumbs={breadcrumbs}
      layout={{ fullBleed: true, header: 'compact', padding: 'md' }}
      metadata={{
        title: 'RFQ-to-Award Co-Pilot - Procurement Automation',
        description: 'AI-powered RFQ analysis, supplier evaluation, and automated award recommendations'
      }}
    >
      <div className="space-y-6">
        <div className="flex gap-2">
          <Badge variant="secondary">AI-Powered</Badge>
          <Badge variant="secondary">Procurement</Badge>
          <Badge variant="secondary">RFQ Analysis</Badge>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-12">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload RFQ
              </TabsTrigger>
              <TabsTrigger value="analysis" className="gap-2">
                <FileText className="h-4 w-4" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="award" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Award
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload RFQ Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">RFQ Title</label>
                      <Input
                        placeholder="Enter RFQ title"
                        value={rfqData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Budget Range</label>
                      <Input
                        placeholder="$0 - $100,000"
                        value={rfqData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Describe your procurement requirements"
                      className="min-h-24"
                      value={rfqData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>
                  
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-accent/50 transition-colors">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">Drop RFQ documents here</p>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                    <Button variant="outline" className="mt-4">
                      Browse Files
                    </Button>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab('analysis')}>
                      Analyze RFQ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Requirements Identified</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Technical specifications compliance</li>
                          <li>• Delivery timeline requirements</li>
                          <li>• Quality certifications needed</li>
                          <li>• Cost optimization targets</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Supply Risk</span>
                        <Badge variant="secondary">Low</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cost Risk</span>
                        <Badge variant="destructive">Medium</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Timeline Risk</span>
                        <Badge variant="secondary">Low</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((supplier) => (
                      <div key={supplier} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Supplier {supplier}</h4>
                          <Badge variant="outline">Match: {95 - supplier * 5}%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Specialized supplier with excellent track record in supply chain solutions
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Rating:</span> 4.{8 - supplier}/5
                          </div>
                          <div>
                            <span className="font-medium">Lead Time:</span> {supplier + 2} weeks
                          </div>
                          <div>
                            <span className="font-medium">Cost:</span> $${(supplier * 15000).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="award" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Award Recommendation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold text-lg mb-2">Recommended Award: Supplier 1</h4>
                          <p className="text-muted-foreground mb-4">
                            Based on comprehensive analysis of requirements, cost, timeline, and risk factors
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">Total Cost:</span>
                              <p className="text-lg font-semibold">$15,000</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Timeline:</span>
                              <p className="text-lg font-semibold">3 weeks</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Match Score:</span>
                              <p className="text-lg font-semibold">95%</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Risk Level:</span>
                              <p className="text-lg font-semibold text-green-600">Low</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="flex-1">
                        Generate Award Letter
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Export Analysis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MicroserviceShell>
  );
};

export default RFQToAward;