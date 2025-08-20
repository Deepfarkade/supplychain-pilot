import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Shield, LogOut } from 'lucide-react';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  onExtendSession: () => void;
  onLogout: () => void;
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  remainingSeconds,
  onExtendSession,
  onLogout
}) => {
  const [timeLeft, setTimeLeft] = useState(remainingSeconds);
  
  useEffect(() => {
    setTimeLeft(remainingSeconds);
  }, [remainingSeconds]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogout]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressValue = (): number => {
    return ((120 - timeLeft) / 120) * 100;
  };

  const getProgressColor = (): string => {
    if (timeLeft > 60) return 'bg-yellow-500';
    if (timeLeft > 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">{/* Removed hideCloseButton prop */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <Clock className="h-5 w-5" />
            Session Timeout Warning
          </DialogTitle>
          <DialogDescription>
            Your session will expire soon due to inactivity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Notice:</strong> For your protection, we automatically log out inactive sessions.
            </AlertDescription>
          </Alert>

          <div className="text-center space-y-3">
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatTime(timeLeft)}
            </div>
            
            <Progress 
              value={getProgressValue()} 
              className="w-full h-3"
            />
            
            <div className="text-sm text-muted-foreground">
              Time remaining until automatic logout
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="text-sm font-medium">Session Details:</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Idle timeout: 20 minutes</div>
              <div>• Warning period: 2 minutes</div>
              <div>• Auto-logout: When timer reaches 0:00</div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4" />
            Logout Now
          </Button>
          <Button
            onClick={onExtendSession}
            className="flex items-center gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <Shield className="h-4 w-4" />
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTimeoutModal;