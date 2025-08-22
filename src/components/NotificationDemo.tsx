import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notificationAPI } from '@/services/notificationApi';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export const NotificationDemo = () => {
  const handleTestNotifications = () => {
    // Demo different types of notifications
    notificationAPI.info('This is an information message about system updates.');
    
    setTimeout(() => {
      notificationAPI.success('Task completed successfully! Your data has been saved.');
    }, 1000);
    
    setTimeout(() => {
      notificationAPI.warning('Warning: Scheduled maintenance will occur in 2 hours.');
    }, 2000);
    
    setTimeout(() => {
      notificationAPI.error('Error: Failed to connect to external service. Please try again.');
    }, 3000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="w-5 h-5" />
          Notification API Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Test the notification system with different message types.
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => notificationAPI.info('Info notification sent!')}
            className="flex items-center gap-2"
          >
            <Info className="w-3 h-3" />
            Info
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => notificationAPI.success('Success notification sent!')}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-3 h-3" />
            Success
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => notificationAPI.warning('Warning notification sent!')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-3 h-3" />
            Warning
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => notificationAPI.error('Error notification sent!')}
            className="flex items-center gap-2"
          >
            <XCircle className="w-3 h-3" />
            Error
          </Button>
        </div>
        
        <Button
          onClick={handleTestNotifications}
          className="w-full"
          size="sm"
        >
          Test All Notifications
        </Button>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>API Usage:</strong></p>
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            notificationAPI.success('Message')
          </code>
        </div>
      </CardContent>
    </Card>
  );
};