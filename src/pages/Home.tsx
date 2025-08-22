import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Home as HomeIcon, 
  Grid3X3, 
  Bot, 
  GraduationCap, 
  BarChart3, 
  User, 
  Shield, 
  FileText,
  MessageSquare,
  LogOut,
  Truck,
  Package,
  Search,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { PageHeader } from '@/components/PageHeader'
import { Loading } from '@/components/Loading'
import { useAuth } from '@/contexts/AuthContext'
import { getAllMicroservices, getCategories } from '@/microservices/registry'
import { AppCard } from '@/components/AppCard'
import { useDebounce } from '@/hooks/useDebounce'
import { useSessionState } from '@/hooks/useSessionState'

const Home = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useSessionState('home-search', '')
  const [activeCategory, setActiveCategory] = useSessionState('home-category', 'all')
  const { user, logout } = useAuth()
  
  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavigation = async (path: string) => {
    if (path) {
      setIsLoading(true)
      setTimeout(() => {
        navigate(path)
        setIsLoading(false)
      }, 300)
    }
  }

  // Get all microservices and categories
  const allMicroservices = getAllMicroservices()
  const categories = ['all', ...getCategories()]
  
  // Filter microservices based on search and category
  const filteredMicroservices = React.useMemo(() => {
    let filtered = allMicroservices
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(ms => ms.category === activeCategory)
    }
    
    if (debouncedSearch) {
      const searchTerm = debouncedSearch.toLowerCase()
      filtered = filtered.filter(ms => 
        ms.name.toLowerCase().includes(searchTerm) ||
        ms.description?.toLowerCase().includes(searchTerm) ||
        ms.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }
    
    return filtered.slice(0, 8) // Show top 8 for homepage
  }, [allMicroservices, activeCategory, debouncedSearch])

  const sidebarItems = [
    { icon: HomeIcon, label: 'Home', active: true, path: '/' },
    { icon: Grid3X3, label: 'App Store', active: false, path: '/appstore' },
    { icon: Bot, label: 'Build your own Agents', active: false, path: '/agents' },
    { icon: GraduationCap, label: 'AI Academy', active: false, path: '/academy' },
    { icon: BarChart3, label: 'Usage Insights', active: false, path: '/insights' },
    { icon: Shield, label: 'Responsible AI', active: false, path: '/responsible-ai' },
    { icon: FileText, label: 'Raise a ticket', active: false, path: '/support' },
    { icon: MessageSquare, label: 'Feedback', active: false, path: '/feedback' }
  ]

  const handleExplore = (domain: string, slug: string) => {
    setIsLoading(true)
    setTimeout(() => {
      navigate(`/app/${domain}/${slug}`)
      setIsLoading(false)
    }, 300)
  }


  if (!mounted) {
    return <Loading className="min-h-screen" />
  }

  return (
    <div className={`transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <AppShell 
        showPatterns={true}
        maxWidth="full"
        headerContent={
          <PageHeader 
            title="SupplyChain AI Studio"
            subtitle="Revolutionize your supply chain operations with intelligent AI-powered solutions"
            icon={Package}
            variant="compact"
          />
        }
      >
        <div className="flex min-h-[calc(100vh-120px)]">
          {/* Left Sidebar */}
          <div className="w-64 surface-1 border-r border-border/40 flex flex-col">
            {/* User Profile */}
            <div className="p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">SupplyChain</div>
                  <div className="text-xs text-muted-foreground">AI Studio</div>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="px-4 py-2 border-b border-border/30">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{user?.name || 'User'}</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
              {sidebarItems.slice(0, -3).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  disabled={isLoading}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-[1.02] ${
                    item.active 
                      ? 'bg-primary text-primary-foreground font-medium shadow-soft' 
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {isLoading && item.path && (
                    <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent ml-auto"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* Bottom Static Section */}
            <div className="p-3 border-t border-border/30 space-y-1">
              {/* Responsible AI, Raise Ticket, Feedback in same row */}
              <div className="grid grid-cols-1 gap-1">
                {sidebarItems.slice(-3).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.path)}
                    disabled={isLoading}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-xs transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-accent justify-start gap-2"
                onClick={logout}
              >
                <LogOut className="w-3 h-3" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="space-y-8">
              
              {/* Category Tabs Rail */}
              <div className="animate-fade-in">
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="grid grid-cols-4 w-fit h-10 surface-1 border border-border/40">
                    <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
                    <TabsTrigger value="AI Chat" className="text-sm">AI Chat</TabsTrigger>
                    <TabsTrigger value="Analytics" className="text-sm">Analytics</TabsTrigger>
                    <TabsTrigger value="Quality" className="text-sm">Quality</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Utility Row */}
              <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 surface-1 border-border/40"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/appstore')}
                  className="gap-2"
                >
                  View All Apps
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>

              {/* App Card Grid */}
              <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMicroservices.map((app, index) => (
                    <div
                      key={app.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${300 + index * 50}ms` }}
                    >
                      <AppCard
                        title={app.name}
                        description={app.description || ''}
                        imageUrl={app.imageUrl || ''}
                        domain={app.domain}
                        slug={app.slug}
                        onExplore={handleExplore}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI Strip */}
              <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Active Applications', value: allMicroservices.length.toString(), icon: Activity },
                    { label: 'User Sessions', value: '2,431', icon: Users },
                    { label: 'Efficiency Gain', value: '35%', icon: TrendingUp },
                    { label: 'Cost Savings', value: '$1.2M', icon: BarChart3 }
                  ].map((stat, index) => (
                    <Card key={index} className="card-elevated hover:card-hover cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </AppShell>
    </div>
  )
}

export default Home