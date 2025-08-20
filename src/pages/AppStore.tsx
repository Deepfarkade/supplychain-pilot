import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppCard } from '@/components/AppCard';
import { AppHeader } from '@/components/AppHeader';
import { Loading } from '@/components/Loading';

// Import generated images
import conversationalAgentsImg from '@/assets/conversational-agents.jpg'
import supplyChainNetworkImg from '@/assets/supply-chain-network.jpg'
import pharmaLabImg from '@/assets/pharma-lab.jpg'
import documentAnalysisImg from '@/assets/document-analysis.jpg'
import directGptImg from '@/assets/direct-gpt.jpg'
import inventoryDashboardImg from '@/assets/inventory-dashboard.jpg'

// App data organized by domain
const appData = {
  general: [
    {
      title: 'Conversational Agents',
      description: 'Test the deployed models and its output to a simple chatbot. Customize with translation and personalised prompts.',
      imageUrl: conversationalAgentsImg,
      domain: 'general',
      slug: 'conversational-agents'
    },
    {
      title: 'Direct GPT',
      description: 'Azure ChatGPT, playground to explore different model\'s capabilities',
      imageUrl: directGptImg,
      domain: 'general',
      slug: 'direct-gpt'
    },
    {
      title: 'Document Comparer',
      description: 'Demonstrate the power of GenAI on knowledge base QnA.',
      imageUrl: documentAnalysisImg,
      domain: 'general',
      slug: 'document-comparer'
    }
  ],
  'supply-chain': [
    {
      title: 'RFQ-to-Award Co-Pilot',
      description: 'Streamline procurement processes with AI-powered RFQ analysis and supplier selection automation.',
      imageUrl: supplyChainNetworkImg,
      domain: 'supply-chain',
      slug: 'rfq-to-award'
    },
    {
      title: 'Demand Forecast Review',
      description: 'Advanced demand forecasting with machine learning models and supply chain optimization.',
      imageUrl: inventoryDashboardImg,
      domain: 'supply-chain',
      slug: 'demand-forecast'
    },
    {
      title: 'Supplier Risk Monitor',
      description: 'Real-time supplier risk assessment and monitoring with predictive analytics.',
      imageUrl: supplyChainNetworkImg,
      domain: 'supply-chain',
      slug: 'supplier-risk'
    },
    {
      title: 'Inventory Rebalancer',
      description: 'Intelligent inventory optimization and automated rebalancing across distribution networks.',
      imageUrl: inventoryDashboardImg,
      domain: 'supply-chain',
      slug: 'inventory-rebalancer'
    }
  ],
  pharma: [
    {
      title: 'Batch Release Assistant',
      description: 'AI-powered batch release decision support with regulatory compliance validation.',
      imageUrl: pharmaLabImg,
      domain: 'pharma',
      slug: 'batch-release'
    },
    {
      title: 'Deviation CAPA Summarizer',
      description: 'Automated deviation analysis and CAPA recommendation generation for quality management.',
      imageUrl: pharmaLabImg,
      domain: 'pharma',
      slug: 'deviation-capa'
    },
    {
      title: 'Regulatory Dossier Helper',
      description: 'Intelligent regulatory document preparation and compliance verification assistant.',
      imageUrl: documentAnalysisImg,
      domain: 'pharma',
      slug: 'regulatory-dossier'
    }
  ]
}

const AppStore = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)

  // Filter apps based on search query
  const filteredApps = useMemo(() => {
    if (!searchQuery) return appData[activeTab as keyof typeof appData]
    
    return appData[activeTab as keyof typeof appData].filter(app =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, activeTab])

  const handleExplore = (domain: string, slug: string) => {
    setIsLoading(true)
    console.log(`Exploring ${domain}/${slug}`)
    // Navigate to micro-frontend app
    setTimeout(() => {
      window.location.href = `/app/${domain}/${slug}`
    }, 300)
  }

  const handleTabChange = (value: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setActiveTab(value)
      setIsLoading(false)
    }, 200)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 network-pattern" />
        <div className="absolute inset-0 dotted-pattern opacity-30" />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Application Store
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover and deploy AI-powered applications for your supply chain operations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="relative mb-6 animate-fade-in">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search Applications"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base transition-all duration-200 hover:shadow-sm focus:shadow-md"
            />
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loading className="scale-150" />
            </div>
          )}

          {/* Domain Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12 animate-fade-in">
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
              <TabsContent value="general" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                  {filteredApps.map((app, index) => (
                    <div
                      key={`${app.domain}-${app.slug}`}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
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

              <TabsContent value="supply-chain" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                  {filteredApps.map((app, index) => (
                    <div
                      key={`${app.domain}-${app.slug}`}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
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

              <TabsContent value="pharma" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                  {filteredApps.map((app, index) => (
                    <div
                      key={`${app.domain}-${app.slug}`}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
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
      </div>
    </div>
  )
}

export default AppStore