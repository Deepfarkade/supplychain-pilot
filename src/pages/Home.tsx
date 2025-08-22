import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Home as HomeIcon, 
  Grid3X3, 
  Bot, 
  GraduationCap, 
  BarChart3, 
  User, 
  Settings as SettingsIcon, 
  FileText,
  MessageSquare,
  LogOut,
  Package,
  TrendingUp,
  Users,
  Activity,
  Zap,
  Target,
  Award
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { PageHeader } from '@/components/PageHeader'
import { Loading } from '@/components/Loading'
import { useAuth } from '@/contexts/AuthContext'
import { getAllMicroservices } from '@/microservices/registry'

const Home = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()
  
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

  // Get microservices data for stats
  const allMicroservices = getAllMicroservices()

  const sidebarItems = [
    { icon: HomeIcon, label: 'Home', active: true, path: '/' },
    { icon: Grid3X3, label: 'App Store', active: false, path: '/appstore' },
    { icon: Bot, label: 'Build your own Agents', active: false, path: '/agents' },
    { icon: GraduationCap, label: 'AI Academy', active: false, path: '/academy' },
    { icon: BarChart3, label: 'Usage Insights', active: false, path: '/insights' }
  ]

  const bottomSidebarItems = [
    { icon: FileText, label: 'Raise a ticket', active: false, path: '/support' },
    { icon: MessageSquare, label: 'Feedback', active: false, path: '/feedback' },
    { icon: SettingsIcon, label: 'Settings', active: false, path: '/settings' }
  ]

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
        <div className="flex h-[calc(100vh-80px)] overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 surface-1 border-r border-border/40 flex flex-col h-full">
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
              {sidebarItems.map((item, index) => (
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
            <div className="p-3 border-t border-border/30">
              {/* Bottom navigation items in a single column */}
              <div className="grid grid-cols-1 gap-1 mb-2">
                {bottomSidebarItems.map((item, index) => (
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
                variant="destructive"
                size="sm"
                className="w-full h-8 text-xs justify-start gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20"
                onClick={logout}
              >
                <LogOut className="w-3 h-3" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content - Full Width with Proper Spacing */}
          <div className="flex-1 px-8 py-3 flex flex-col h-full">
            <div className="max-w-6xl mx-auto flex flex-col h-full justify-between">
              
              {/* Hero Welcome Section */}
              <div className="animate-fade-in text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-medium">
                  <Zap className="w-3 h-3" />
                  Welcome to AI-Powered Supply Chain
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Transform Your Operations
                </h1>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                  Leverage cutting-edge AI applications to optimize your supply chain processes, 
                  reduce costs, and drive operational excellence.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button 
                    onClick={() => navigate('/appstore')} 
                    size="sm"
                    className="gap-2"
                  >
                    <Grid3X3 className="w-3 h-3" />
                    Explore Applications
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/academy')}
                    className="gap-2"
                  >
                    <GraduationCap className="w-3 h-3" />
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-4" style={{ animationDelay: '200ms' }}>
                <Card className="card-elevated hover:card-hover cursor-pointer text-center p-3">
                  <CardContent className="space-y-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Precision Analytics</h3>
                    <p className="text-xs text-muted-foreground">
                      Advanced analytics and forecasting to optimize inventory, demand planning, and supply chain operations.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="card-elevated hover:card-hover cursor-pointer text-center p-3">
                  <CardContent className="space-y-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">AI Automation</h3>
                    <p className="text-xs text-muted-foreground">
                      Intelligent automation for procurement, quality management, and regulatory compliance processes.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="card-elevated hover:card-hover cursor-pointer text-center p-3">
                  <CardContent className="space-y-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Award className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Quality Excellence</h3>
                    <p className="text-xs text-muted-foreground">
                      Ensure compliance and quality standards across pharmaceutical and supply chain operations.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* KPI Strip */}
              <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Active Applications', value: allMicroservices.length.toString(), icon: Activity },
                    { label: 'User Sessions', value: '2,431', icon: Users },
                    { label: 'Efficiency Gain', value: '35%', icon: TrendingUp },
                    { label: 'Cost Savings', value: '$1.2M', icon: BarChart3 }
                  ].map((stat, index) => (
                    <Card key={index} className="card-elevated hover:card-hover cursor-pointer">
                      <CardContent className="p-3 text-center">
                        <stat.icon className="w-4 h-4 mx-auto mb-1 text-primary" />
                        <div className="text-xl font-bold text-foreground">{stat.value}</div>
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