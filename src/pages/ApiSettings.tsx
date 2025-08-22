/**
 * API Settings Page - Centralized API Configuration Management
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, AlertCircle, Settings, Shield, Database, Server } from 'lucide-react';
import { services } from '@/services';
import { environmentManager } from '@/config/environment';
import { useToast } from '@/hooks/use-toast';

export default function ApiSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // API Configuration State
  const [apiConfig, setApiConfig] = useState(services.config.getApiConfig());
  const [apiEndpoints, setApiEndpoints] = useState(services.config.getEndpoints());
  
  // Environment State
  const [currentEnvironment, setCurrentEnvironment] = useState(environmentManager.getCurrentEnvironment());
  const [environmentConfig, setEnvironmentConfig] = useState(environmentManager.getCurrentConfig());
  
  // Test Results State
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState(false);
  
  useEffect(() => {
    // Load current configurations
    setApiConfig(services.config.getApiConfig());
    setApiEndpoints(services.config.getEndpoints());
    setEnvironmentConfig(environmentManager.getCurrentConfig());
  }, []);

  const handleApiConfigUpdate = (key: string, value: unknown) => {
    const newConfig = { ...apiConfig, [key]: value };
    setApiConfig(newConfig);
    services.config.updateApiConfig({ [key]: value });
    toast({
      title: "API Configuration Updated",
      description: `${key} has been updated successfully.`,
    });
  };

  const handleEndpointUpdate = (category: string, endpoint: string, value: string) => {
    const newEndpoints = {
      ...apiEndpoints,
      [category]: {
        ...apiEndpoints[category as keyof typeof apiEndpoints],
        [endpoint]: value
      }
    };
    setApiEndpoints(newEndpoints);
    services.config.updateEndpoints({ [category]: newEndpoints[category as keyof typeof newEndpoints] });
    toast({
      title: "Endpoint Updated",
      description: `${category}.${endpoint} has been updated.`,
    });
  };

  const handleEnvironmentChange = (env: 'development' | 'staging' | 'production') => {
    environmentManager.setEnvironment(env);
    services.config.setEnvironment(env);
    setCurrentEnvironment(env);
    setEnvironmentConfig(environmentManager.getCurrentConfig());
    toast({
      title: "Environment Changed", 
      description: `Switched to ${env} environment.`,
    });
  };

  const testAllServices = async () => {
    setIsTesting(true);
    try {
      const results = await services.utils.testAllServices();
      setTestResults(results);
      
      const allPassed = Object.values(results).every(Boolean);
      toast({
        title: allPassed ? "All Tests Passed" : "Some Tests Failed",
        description: allPassed ? "All services are working correctly." : "Check the results for failed services.",
        variant: allPassed ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to run service tests.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const resetToDefaults = () => {
    services.config.resetToDefaults();
    environmentManager.resetToAutoDetect();
    setApiConfig(services.config.getApiConfig());
    setApiEndpoints(services.config.getEndpoints());
    setCurrentEnvironment(environmentManager.getCurrentEnvironment());
    toast({
      title: "Reset Complete",
      description: "All configurations have been reset to defaults.",
    });
  };

  const exportConfiguration = () => {
    const config = services.utils.exportConfiguration();
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `api-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Configuration Exported",
      description: "Configuration has been downloaded as JSON.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">API Settings</h1>
              <p className="text-muted-foreground">Manage all API configurations and endpoints</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={testAllServices} disabled={isTesting} variant="outline">
              {isTesting ? "Testing..." : "Test All Services"}
            </Button>
            <Button onClick={exportConfiguration} variant="outline">
              Export Config
            </Button>
            <Button onClick={resetToDefaults} variant="outline">
              Reset to Defaults
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="endpoints" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Endpoints
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="environment" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Environment
            </TabsTrigger>
          </TabsList>

          {/* General Configuration */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  General API settings and connection parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">Base URL</Label>
                    <Input
                      id="baseUrl"
                      value={apiConfig.baseUrl}
                      onChange={(e) => handleApiConfigUpdate('baseUrl', e.target.value)}
                      placeholder="http://localhost:3001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={apiConfig.timeout}
                      onChange={(e) => handleApiConfigUpdate('timeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retries">Retry Attempts</Label>
                    <Input
                      id="retries"
                      type="number"
                      value={apiConfig.retries}
                      onChange={(e) => handleApiConfigUpdate('retries', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rateLimit">Rate Limit (requests/min)</Label>
                    <Input
                      id="rateLimit"
                      type="number"
                      value={apiConfig.rateLimiting.requestsPerMinute}
                      onChange={(e) => handleApiConfigUpdate('rateLimiting', {
                        ...apiConfig.rateLimiting,
                        requestsPerMinute: parseInt(e.target.value)
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Status */}
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Current status of all services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(testResults).map(([service, status]) => (
                    <div key={service} className="flex items-center gap-2">
                      {status ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="capitalize font-medium">{service}</span>
                      <Badge variant={status ? "default" : "destructive"}>
                        {status ? "Active" : "Failed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Endpoints */}
          <TabsContent value="endpoints" className="space-y-6">
            {Object.entries(apiEndpoints).map(([category, endpoints]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category} Endpoints</CardTitle>
                  <CardDescription>Configure {category} service endpoints</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {Object.entries(endpoints as Record<string, string>).map(([endpoint, url]) => (
                      <div key={endpoint} className="flex items-center gap-4">
                        <Label className="w-32 capitalize">{endpoint}:</Label>
                        <Input
                          value={url}
                          onChange={(e) => handleEndpointUpdate(category, endpoint, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Configuration</CardTitle>
                <CardDescription>Configure security and encryption settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Encryption</Label>
                    <p className="text-sm text-muted-foreground">
                      Encrypt sensitive data in requests
                    </p>
                  </div>
                  <Switch
                    checked={apiConfig.enableEncryption}
                    onCheckedChange={(checked) => handleApiConfigUpdate('enableEncryption', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Request Signing</Label>
                    <p className="text-sm text-muted-foreground">
                      Sign requests with HMAC for integrity
                    </p>
                  </div>
                  <Switch
                    checked={apiConfig.enableRequestSigning}
                    onCheckedChange={(checked) => handleApiConfigUpdate('enableRequestSigning', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable client-side rate limiting
                    </p>
                  </div>
                  <Switch
                    checked={apiConfig.rateLimiting.enabled}
                    onCheckedChange={(checked) => handleApiConfigUpdate('rateLimiting', {
                      ...apiConfig.rateLimiting,
                      enabled: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging and error reporting
                    </p>
                  </div>
                  <Switch
                    checked={apiConfig.debug}
                    onCheckedChange={(checked) => handleApiConfigUpdate('debug', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environment Settings */}
          <TabsContent value="environment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environment Configuration</CardTitle>
                <CardDescription>Switch between different deployment environments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Current Environment</Label>
                  <div className="flex gap-2">
                    {environmentManager.getAvailableEnvironments().map((env) => (
                      <Button
                        key={env}
                        variant={currentEnvironment === env ? "default" : "outline"}
                        onClick={() => handleEnvironmentChange(env)}
                        className="capitalize"
                      >
                        {env}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Environment Details</Label>
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">API URL:</span>
                      <span className="text-muted-foreground">{environmentConfig.apiBaseUrl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Debug Mode:</span>
                      <Badge variant={environmentConfig.debug ? "default" : "secondary"}>
                        {environmentConfig.debug ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Logging:</span>
                      <Badge variant={environmentConfig.enableLogging ? "default" : "secondary"}>
                        {environmentConfig.enableLogging ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Security Level:</span>
                      <Badge variant={environmentConfig.security.enableEncryption ? "default" : "outline"}>
                        {environmentConfig.security.enableEncryption ? "High" : "Basic"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}