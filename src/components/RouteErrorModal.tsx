import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RouteErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  suggestion?: string;
  requestedPath?: string;
  onClose: () => void;
}

const RouteErrorModal: React.FC<RouteErrorModalProps> = ({
  isOpen,
  title,
  message,
  suggestion,
  requestedPath,
  onClose
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    onClose();
    navigate('/', { replace: true });
  };

  const handleGoBack = () => {
    onClose();
    navigate(-1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Route Error:</strong> The requested page or service is not available.
            </AlertDescription>
          </Alert>

          {requestedPath && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="text-sm font-medium">Request Details:</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Requested path: <code className="bg-muted px-1 rounded">{requestedPath}</code></div>
                <div>• Status: Page not found or service unavailable</div>
                {suggestion && <div>• Suggestion: {suggestion}</div>}
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            This could happen if:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>The page URL is incorrect or has changed</li>
              <li>The service is not deployed or enabled</li>
              <li>You don't have permission to access this resource</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={handleGoHome}
            className="flex items-center gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RouteErrorModal;