import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotFoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

const NotFoundModal: React.FC<NotFoundModalProps> = ({
  isOpen,
  onClose,
  title = "Page Not Available",
  message = "The page you're looking for is not yet implemented or may be temporarily unavailable. Please try again later or contact support if the issue persists.",
  showHomeButton = true,
  showBackButton = true
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    onClose();
    navigate('/');
  };

  const handleGoBack = () => {
    onClose();
    navigate(-1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-3 mt-6">
          {showBackButton && (
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex-1 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          )}
          {showHomeButton && (
            <Button
              onClick={handleGoHome}
              className="flex-1 gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotFoundModal;