import React, { Suspense, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';
import { Loading } from '@/components/Loading';
import { AppHeader } from '@/components/AppHeader';
import { getMicroservice } from '@/microservices/registry';

// Error Boundary for Microservices
class MicroserviceErrorBoundary extends React.Component<
  { children: React.ReactNode; onRetry: () => void; microserviceName: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Microservice Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background">
          <AppHeader />
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="h-12 w-12 text-destructive" />
                </div>
                <CardTitle className="text-xl text-destructive">
                  Microservice Error
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  The {this.props.microserviceName} microservice encountered an error and couldn't load properly.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => window.history.back()}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </Button>
                  <Button 
                    onClick={this.props.onRetry}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Microservice Loader Component
const MicroserviceLoader: React.FC<{ domain: string; slug: string }> = ({ domain, slug }) => {
  const [MicroserviceComponent, setMicroserviceComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMicroservice = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Dynamic import based on domain and slug
      const microserviceModule = await import(`@/microservices/${domain}/${slug}/index.tsx`);
      setMicroserviceComponent(() => microserviceModule.default);
    } catch (err) {
      console.error(`Failed to load microservice ${domain}/${slug}:`, err);
      setError(`Failed to load ${domain}/${slug} microservice`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMicroservice();
  }, [domain, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loading className="scale-150" />
            <p className="text-lg text-muted-foreground">
              Loading {getMicroservice(domain, slug)?.name}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !MicroserviceComponent) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-xl text-destructive">
                Microservice Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                The requested microservice "{domain}/{slug}" is not available or hasn't been developed yet.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
                <Button 
                  onClick={loadMicroservice}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <MicroserviceComponent />;
};

// Main Microservice Container
export const MicroserviceContainer: React.FC = () => {
  const { domain, slug } = useParams<{ domain: string; slug: string }>();
  const navigate = useNavigate();

  if (!domain || !slug) {
    navigate('/appstore');
    return null;
  }

  const microservice = getMicroservice(domain, slug);
  
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <MicroserviceErrorBoundary 
      onRetry={handleRetry}
      microserviceName={microservice?.name || `${domain}/${slug}`}
    >
      <Suspense fallback={
        <div className="min-h-screen bg-background">
          <AppHeader />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <Loading className="scale-150" />
              <p className="text-lg text-muted-foreground">
                Initializing {microservice?.name}...
              </p>
            </div>
          </div>
        </div>
      }>
        <MicroserviceLoader domain={domain} slug={slug} />
      </Suspense>
    </MicroserviceErrorBoundary>
  );
};