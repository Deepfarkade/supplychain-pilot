import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { mongoService } from '@/services/database/mongodb';
import { dbConfig } from '@/services/database/config';
import { useToast } from '@/hooks/use-toast';
import { Database, CheckCircle, XCircle, Loader2, Info } from 'lucide-react';

const DatabaseConfig = () => {
  const [databaseName, setDatabaseName] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadConfig = () => {
      const config = dbConfig.getConfig();
      if (config) {
        setDatabaseName(config.databaseName || '');
        setCollectionName(config.collectionName || '');
        setIsConnected(dbConfig.isConfigured());
      }
    };
    
    loadConfig();
  }, []);

  const handleSaveConfig = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Validate input
      const validation = dbConfig.validateConfig(databaseName, collectionName);
      if (!validation.valid) {
        setError(validation.error || 'Invalid configuration');
        return;
      }

      // Save configuration
      dbConfig.setConfig(databaseName, collectionName);
      
      // Test connection
      const testResult = await mongoService.testConnection();
      setConnectionInfo(testResult);
      setIsConnected(testResult.success);

      if (testResult.success) {
        toast({
          title: "Configuration Saved",
          description: "Database configuration has been saved successfully.",
        });
        setError(null);
      } else {
        setError(testResult.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Configuration failed';
      setError(errorMessage);
      setIsConnected(false);
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!dbConfig.isConfigured()) {
        setError('Please save configuration first');
        return;
      }

      const testResult = await mongoService.testConnection();
      setConnectionInfo(testResult);
      setIsConnected(testResult.success);
      
      if (testResult.success) {
        toast({
          title: "Connection Test Successful",
          description: testResult.message,
        });
      } else {
        setError(testResult.message);
        toast({
          variant: "destructive",
          title: "Connection Test Failed",
          description: testResult.message,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMessage);
      setIsConnected(false);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConfig = () => {
    dbConfig.clearConfig();
    setDatabaseName('');
    setCollectionName('');
    setIsConnected(false);
    setConnectionInfo(null);
    setError(null);
    toast({
      title: "Configuration Cleared",
      description: "Database configuration has been reset.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          MongoDB Configuration
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? 'Configured' : 'Not Configured'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Production Setup:</strong> Only database name and collection name are required. 
            Connection details will be handled by your backend when deployed locally.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="database-name">Database Name *</Label>
            <Input
              id="database-name"
              type="text"
              placeholder="supplychain_ai"
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Name of your MongoDB database
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-name">Collection Name *</Label>
            <Input
              id="collection-name"
              type="text"
              placeholder="users"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Collection where user data is stored
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleSaveConfig} 
            disabled={isLoading || !databaseName.trim() || !collectionName.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isLoading || !dbConfig.isConfigured()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Configuration'
            )}
          </Button>

          <Button 
            variant="destructive" 
            onClick={handleClearConfig}
            disabled={isLoading}
          >
            Clear Configuration
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {connectionInfo && connectionInfo.success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{connectionInfo.message}</AlertDescription>
          </Alert>
        )}

        {dbConfig.isConfigured() && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="text-sm font-medium">Current Configuration:</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Database: <code className="bg-muted px-1 rounded">{dbConfig.getConfig()?.databaseName}</code></div>
              <div>• Collection: <code className="bg-muted px-1 rounded">{dbConfig.getConfig()?.collectionName}</code></div>
              <div>• Status: {isConnected ? '✅ Ready for production' : '⚠️ Not tested'}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseConfig;