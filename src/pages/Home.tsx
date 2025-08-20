import React from 'react'
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
  Workflow,
  Zap,
  ChevronRight,
  TestTube,
  Clock,
  Lightbulb
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const sidebarItems = [
    { icon: HomeIcon, label: 'Home', active: false },
    { icon: Grid3X3, label: 'App Store', active: true },
    { icon: Bot, label: 'Build your own Agents', active: false },
    { icon: GraduationCap, label: 'AI Academy', active: false },
    { icon: BarChart3, label: 'Usage Insights', active: false },
    { icon: Shield, label: 'Responsible AI', active: false },
    { icon: FileText, label: 'Raise a ticket', active: false },
    { icon: MessageSquare, label: 'Feedback', active: false }
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

  const rightPanelItems = [
    {
      title: 'Test Generative AI Studios abilities',
      icon: TestTube,
      items: []
    },
    {
      title: 'Chat History',
      icon: Clock,
      items: []
    },
    {
      title: 'Your Prompts',
      icon: Lightbulb,
      items: []
    }
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* User Profile */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
              SA
            </div>
            <div>
              <div className="font-medium text-sidebar-foreground text-sm">SupplyAI</div>
              <div className="text-xs text-sidebar-foreground/70">GenerativeAI</div>
              <div className="text-xs text-sidebar-foreground/70">STUDIO</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-sidebar-foreground/70" />
            <span className="text-sm text-sidebar-foreground">Deep Farkade</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => item.label === 'App Store' && navigate('/appstore')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <ChevronRight className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Center Content */}
        <div className="flex-1 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 network-pattern" />
          <div className="absolute inset-0 dotted-pattern opacity-30" />
          
          {/* Content */}
          <div className="relative z-10 p-8">
            <div className="max-w-4xl mx-auto">
              {/* Main Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
                {mainFeatures.map((feature, index) => (
                  <Card key={index} className={`${feature.className} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                    <CardContent className="p-6">
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-white/20 backdrop-blur-sm">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-full object-cover"
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
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-sidebar border-l border-sidebar-border p-4 space-y-4">
          {rightPanelItems.map((panel, index) => (
            <Card key={index} className="bg-sidebar-accent border-sidebar-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <panel.icon className="w-4 h-4 text-sidebar-primary" />
                  <h3 className="font-medium text-sm text-sidebar-foreground">
                    {panel.title}
                  </h3>
                </div>
                <div className="text-xs text-sidebar-foreground/70">
                  {panel.items.length === 0 ? 'No items yet' : `${panel.items.length} items`}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Bottom Panel */}
          <Card className="bg-sidebar-accent border-sidebar-border">
            <CardContent className="p-4">
              <div className="text-xs text-sidebar-foreground/70 leading-relaxed">
                See what steps EY Generative AI Studio is currently undertaking to develop a trusted AI framework.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Home