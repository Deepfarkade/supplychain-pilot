import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Package
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/AppHeader'
import { Loading } from '@/components/Loading'
import { useAuth } from '@/contexts/AuthContext'

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
      // Small delay for smooth transition
      setTimeout(() => {
        navigate(path)
        setIsLoading(false)
      }, 300)
    }
  }

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

  const mainFeatures = [
    {
      title: 'Chatbots',
      description: 'Chatbots are AI-powered tools that can help humans (knowledge management, Q&A, Assisted Transaction).',
      image: '/src/assets/conversational-agents.jpg',
      className: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900'
    },
    {
      title: 'Agentic Workflow',
      description: 'AI Agents & human working collaboratively, human decides,(Task Specialization, Human in Loop, Process Automation with AI Assisted information processing.)',
      image: '/src/assets/supply-chain-network.jpg',
      className: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900'
    },
    {
      title: 'Transformative',
      description: 'Multiple AI Agents collaborating for outcome, Human in control (E2E Process Orchestration, Overarching business Application.)',
      image: '/src/assets/pharma-lab.jpg',
      className: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900'
    }
  ]


  if (!mounted) {
    return <Loading className="min-h-screen" />
  }

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <AppHeader />
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
          {/* User Profile */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sidebar-foreground text-sm">SupplyChain</div>
                <div className="text-xs text-sidebar-foreground/70">AI Studio</div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-4 py-2 border-b border-sidebar-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-sidebar-foreground/70" />
                  <span className="text-sm text-sidebar-foreground">{user?.name || 'User'}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={logout}
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Logout
                </Button>
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
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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
        </div>

        {/* Main Content */}
        <div className="flex-1 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 network-pattern" />
          <div className="absolute inset-0 dotted-pattern opacity-30" />
          
          {/* Content */}
          <div className="relative z-10 p-8">
            <div className="max-w-6xl mx-auto">
              {/* Welcome Section */}
              <div className="mb-12 text-center animate-fade-in">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Welcome to SupplyChain AI Studio
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Revolutionize your supply chain operations with intelligent AI-powered solutions
                </p>
              </div>

              {/* Main Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {mainFeatures.map((feature, index) => (
                  <Card 
                    key={index} 
                    className={`${feature.className} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer animate-fade-in`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-white/20 backdrop-blur-sm">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
                {[
                  { label: 'Supply Chain Networks', value: '50+', icon: Truck },
                  { label: 'AI Models Deployed', value: '120+', icon: Bot },
                  { label: 'Cost Reduction', value: '35%', icon: BarChart3 },
                  { label: 'Process Efficiency', value: '90%', icon: Shield }
                ].map((stat, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur border hover:bg-card/70 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home