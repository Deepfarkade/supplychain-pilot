import React, { useState, useMemo } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { AppCard } from '@/components/AppCard'
import { RightRail } from '@/components/RightRail'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

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

  // Filter apps based on search query
  const filteredApps = useMemo(() => {
    if (!searchQuery) return appData[activeTab as keyof typeof appData]
    
    return appData[activeTab as keyof typeof appData].filter(app =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, activeTab])

  const handleExplore = (domain: string, slug: string) => {
    console.log(`Exploring ${domain}/${slug}`)
    // Navigate to micro-frontend app
    window.location.href = `/app/${domain}/${slug}`
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      {/* Header Section */}
      <section className="bg-muted/30 py-12">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Application Store</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover and deploy AI-powered applications for your supply chain operations
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <div className="flex gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search Applications"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Domain Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 h-12">
                <TabsTrigger value="general" className="text-sm font-medium">
                  General
                  <Badge variant="secondary" className="ml-2">
                    {appData.general.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="supply-chain" className="text-sm font-medium">
                  Supply Chain
                  <Badge variant="secondary" className="ml-2">
                    {appData['supply-chain'].length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pharma" className="text-sm font-medium">
                  Pharma
                  <Badge variant="secondary" className="ml-2">
                    {appData.pharma.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* App Cards Grid */}
              <TabsContent value="general" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                  {filteredApps.map((app) => (
                    <AppCard
                      key={`${app.domain}-${app.slug}`}
                      title={app.title}
                      description={app.description}
                      imageUrl={app.imageUrl}
                      domain={app.domain}
                      slug={app.slug}
                      onExplore={handleExplore}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="supply-chain" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                  {filteredApps.map((app) => (
                    <AppCard
                      key={`${app.domain}-${app.slug}`}
                      title={app.title}
                      description={app.description}
                      imageUrl={app.imageUrl}
                      domain={app.domain}
                      slug={app.slug}
                      onExplore={handleExplore}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pharma" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                  {filteredApps.map((app) => (
                    <AppCard
                      key={`${app.domain}-${app.slug}`}
                      title={app.title}
                      description={app.description}
                      imageUrl={app.imageUrl}
                      domain={app.domain}
                      slug={app.slug}
                      onExplore={handleExplore}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* No Results */}
            {filteredApps.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No applications found matching "{searchQuery}"
                </p>
              </div>
            )}
          </div>

          {/* Right Rail */}
          <RightRail />
        </div>
      </section>
    </div>
  )
}

export default AppStore