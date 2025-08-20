import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mongoService, type MongoConfig } from '@/services/database/mongodb';
import { Database, TestTube, Save } from 'lucide-react';

interface DatabaseConfigProps {
  onConfigSaved?: () => void;
}

const DatabaseConfig: React.FC<DatabaseConfigProps> = ({ onConfigSaved }) => {
  const [config, setConfig] = useState<MongoConfig>({
    connectionString: '',
    databaseName: '',
    collectionName: 'users'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load existing configuration
    const existingConfig = mongoService.loadConfig();
    if (existingConfig) {
      setConfig(existingConfig);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    mongoService.setConfig(config);
    setIsSaved(true);
    setTestResult(null);
    onConfigSaved?.();
  };

  const handleTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      mongoService.setConfig(config);
      const success = await mongoService.testConnection();
      setTestResult(success ? 'Connection successful!' : 'Connection failed');
    } catch (error) {
      setTestResult('Connection failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          MongoDB Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            <strong>Security Note:</strong> In production, database credentials should be handled by backend services.
            This frontend configuration is for development purposes only.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="connectionString">MongoDB Connection String</Label>
            <Input
              id="connectionString"
              type="password"
              placeholder="mongodb+srv://username:password@cluster.mongodb.net/"
              value={config.connectionString}
              onChange={(e) => setConfig({ ...config, connectionString: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="databaseName">Database Name</Label>
            <Input
              id="databaseName"
              placeholder="supplychainai"
              value={config.databaseName}
              onChange={(e) => setConfig({ ...config, databaseName: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="collectionName">Collection Name</Label>
            <Input
              id="collectionName"
              placeholder="users"
              value={config.collectionName}
              onChange={(e) => setConfig({ ...config, collectionName: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            className="flex items-center gap-2"
            disabled={!config.connectionString || !config.databaseName}
          >
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
          
          <Button 
            onClick={handleTest} 
            variant="outline"
            className="flex items-center gap-2"
            disabled={!config.connectionString || !config.databaseName || isLoading}
          >
            <TestTube className="h-4 w-4" />
            {isLoading ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>

        {testResult && (
          <Alert>
            <AlertDescription>
              {testResult}
            </AlertDescription>
          </Alert>
        )}

        {isSaved && (
          <Alert>
            <AlertDescription className="text-green-600">
              Configuration saved successfully!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseConfig;