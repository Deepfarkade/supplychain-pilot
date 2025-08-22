import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Grid3X3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppCard } from '@/components/AppCard';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { Loading } from '@/components/Loading';
import { getAllMicroservices, getMicroservicesByDomain, searchMicroservices } from '@/microservices/registry';
import { useDebounce } from '@/hooks/useDebounce';
import { useSessionState } from '@/hooks/useSessionState';

// Import generated images
import conversationalAgentsImg from '@/assets/conversational-agents.jpg'
import supplyChainNetworkImg from '@/assets/supply-chain-network.jpg'
import pharmaLabImg from '@/assets/pharma-lab.jpg'
import documentAnalysisImg from '@/assets/document-analysis.jpg'
import directGptImg from '@/assets/direct-gpt.jpg'
import inventoryDashboardImg from '@/assets/inventory-dashboard.jpg'

// Image mapping for microservices
const imageMapping = {
  'conversational-agents': conversationalAgentsImg,
  'direct-gpt': directGptImg,
  'document-comparer': documentAnalysisImg,
  'rfq-to-award': supplyChainNetworkImg,
  'demand-forecast': inventoryDashboardImg,
  'supplier-risk': supplyChainNetworkImg,
  'inventory-rebalancer': inventoryDashboardImg,
  'order-management': supplyChainNetworkImg,
  'batch-release': pharmaLabImg,
  'deviation-capa': pharmaLabImg,
  'regulatory-dossier': documentAnalysisImg,
};

// Default descriptions for microservices if not provided
const defaultDescriptions = {
  'conversational-agents': 'Test the deployed models and its output to a simple chatbot. Customize with translation and personalised prompts.',
  'direct-gpt': 'Azure ChatGPT, playground to explore different model\'s capabilities',
  'document-comparer': 'Demonstrate the power of GenAI on knowledge base QnA.',
  'rfq-to-award': 'Streamline procurement processes with AI-powered RFQ analysis and supplier selection automation.',
  'demand-forecast': 'Advanced demand forecasting with machine learning models and supply chain optimization.',
  'supplier-risk': 'Real-time supplier risk assessment and monitoring with predictive analytics.',
  'inventory-rebalancer': 'Intelligent inventory optimization and automated rebalancing across distribution networks.',
  'order-management': 'Intelligent order processing and management with AI-powered chat assistance for streamlined operations.',
  'batch-release': 'AI-powered batch release decision support with regulatory compliance validation.',
  'deviation-capa': 'Automated deviation analysis and CAPA recommendation generation for quality management.',
  'regulatory-dossier': 'Intelligent regulatory document preparation and compliance verification assistant.',
};

const AppStore = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useSessionState('appstore-search', '')
  const [activeTab, setActiveTab] = useSessionState('appstore-tab', 'general')
  const [isLoading, setIsLoading] = useState(false)
  
  // Debounce search to improve performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Get dynamic app data from registry with performance optimization
  const appData = useMemo(() => {
    const allMicroservices = getAllMicroservices();
    
    const groupedData = {
      general: [] as any[],
      'supply-chain': [] as any[],
      pharma: [] as any[]
    };

    allMicroservices.forEach(ms => {
      const appInfo = {
        title: ms.name,
        description: ms.description || defaultDescriptions[ms.slug as keyof typeof defaultDescriptions] || `AI-powered ${ms.name.toLowerCase()} solution`,
        imageUrl: ms.imageUrl || imageMapping[ms.slug as keyof typeof imageMapping] || supplyChainNetworkImg,
        domain: ms.domain,
        slug: ms.slug,
        tags: ms.tags || [],
        category: ms.category
      };

      if (ms.domain === 'general') {
        groupedData.general.push(appInfo);
      } else if (ms.domain === 'supply-chain') {
        groupedData['supply-chain'].push(appInfo);
      } else if (ms.domain === 'pharma') {
        groupedData.pharma.push(appInfo);
      }
    });

    // Sort by order if available
    Object.keys(groupedData).forEach(domain => {
      groupedData[domain as keyof typeof groupedData].sort((a, b) => {
        const msA = allMicroservices.find(ms => ms.slug === a.slug);
        const msB = allMicroservices.find(ms => ms.slug === b.slug);
        return (msA?.order || 999) - (msB?.order || 999);
      });
    });

    return groupedData;
  }, []);

  // Filter apps based on debounced search query with enhanced search
  const filteredApps = useMemo(() => {
    if (!debouncedSearchQuery) return appData[activeTab as keyof typeof appData]
    
    // Use the registry search function for better performance
    const searchResults = searchMicroservices(debouncedSearchQuery, activeTab);
    
    return searchResults.map(ms => ({
      title: ms.name,
      description: ms.description || defaultDescriptions[ms.slug as keyof typeof defaultDescriptions] || `AI-powered ${ms.name.toLowerCase()} solution`,
      imageUrl: ms.imageUrl || imageMapping[ms.slug as keyof typeof imageMapping] || supplyChainNetworkImg,
      domain: ms.domain,
      slug: ms.slug,
      tags: ms.tags || [],
      category: ms.category
    }));
  }, [debouncedSearchQuery, activeTab, appData])

  const handleExplore = (domain: string, slug: string) => {
    setIsLoading(true)
    console.log(`Exploring ${domain}/${slug}`)
    // Navigate to microservice using React Router (no page reload)
    setTimeout(() => {
      navigate(`/app/${domain}/${slug}`)
      setIsLoading(false)
    }, 500)
  }

  const handleTabChange = (value: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setActiveTab(value)
      setIsLoading(false)
    }, 200)
  }

  return (
    <AppShell 
      headerContent={
        <PageHeader 
          title="Application Store"
          subtitle="Discover and deploy AI-powered applications for your supply chain operations"
          icon={Grid3X3}
          variant="compact"
        />
      }
    >
      <div className="py-8 space-y-8">
        {/* Utility Row */}
        <div className="flex items-center justify-between animate-fade-in">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search Applications"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base surface-1 border-border/40 transition-all duration-200 hover:shadow-soft focus:shadow-elevated"
            />
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loading className="scale-150" />
          </div>
        )}

        {/* Domain Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <TabsList className="grid w-full grid-cols-3 h-12 surface-1 border border-border/40">
            <TabsTrigger value="general" className="text-sm font-medium transition-all duration-200">
              General
              <Badge variant="secondary" className="ml-2">
                {appData.general.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="supply-chain" className="text-sm font-medium transition-all duration-200">
              Supply Chain
              <Badge variant="secondary" className="ml-2">
                {appData['supply-chain'].length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pharma" className="text-sm font-medium transition-all duration-200">
              Pharma
              <Badge variant="secondary" className="ml-2">
                {appData.pharma.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* App Cards Grid */}
          <div className="min-h-[400px]">
            <TabsContent value="general" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                {filteredApps.map((app, index) => (
                  <div
                    key={`${app.domain}-${app.slug}`}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <AppCard
                      title={app.title}
                      description={app.description}
                      imageUrl={app.imageUrl}
                      domain={app.domain}
                      slug={app.slug}
                      onExplore={handleExplore}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="supply-chain" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                {filteredApps.map((app, index) => (
                  <div
                    key={`${app.domain}-${app.slug}`}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <AppCard
                      title={app.title}
                      description={app.description}
                      imageUrl={app.imageUrl}
                      domain={app.domain}
                      slug={app.slug}
                      onExplore={handleExplore}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pharma" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                {filteredApps.map((app, index) => (
                  <div
                    key={`${app.domain}-${app.slug}`}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <AppCard
                      title={app.title}
                      description={app.description}
                      imageUrl={app.imageUrl}
                      domain={app.domain}
                      slug={app.slug}
                      onExplore={handleExplore}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>

          {/* No Results */}
          {filteredApps.length === 0 && searchQuery && (
            <div className="text-center py-16 animate-fade-in">
              <div className="text-muted-foreground text-lg">
                No applications found matching "{searchQuery}"
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search terms or browse different categories
              </p>
            </div>
          )}
        </Tabs>
      </div>
    </AppShell>
  )
}

export default AppStore