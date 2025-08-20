import React from 'react'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Bot, Workflow, Brain, Network, Shield, Zap, MessageSquare, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: MessageSquare,
      title: "Chatbots",
      description: "AI-powered tools that can help humans (knowledge management, QA, Assisted Transaction).",
      image: "/api/placeholder/400/200"
    },
    {
      icon: Workflow,
      title: "Agentic Workflow", 
      description: "AI Agents & human working collaboratively, human decides (Task Specialization, Human in Loop, Process Automation with AI Assisted information processing.)",
      image: "/api/placeholder/400/200"
    },
    {
      icon: Brain,
      title: "Transformative",
      description: "Multiple AI Agents collaborating for outcome, Human in control (E2E Process Orchestration, Overarching business Application.)",
      image: "/api/placeholder/400/200"
    }
  ]

  const sidebarItems = [
    { icon: Bot, label: "App Store", active: true },
    { icon: Workflow, label: "Build your own Agents", active: false },
    { icon: TrendingUp, label: "AI Academy", active: false },
    { icon: Shield, label: "Usage Insights", active: false },
    { icon: Zap, label: "Responsible AI", active: false },
    { icon: MessageSquare, label: "Raise a ticket", active: false },
    { icon: Network, label: "Feedback", active: false }
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <AppHeader />
      
      {/* Left Sidebar */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-card border-r border-border p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SA</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">SupplyAI Studio</h2>
            <p className="text-xs text-muted-foreground">Deep Farkade</p>
          </div>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                item.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => item.active && navigate('/appstore')}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full text-sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 mr-80">
        <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
          {/* Globe Background Decoration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 opacity-10">
              <svg viewBox="0 0 400 400" className="w-full h-full text-foreground">
                <defs>
                  <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.3"/>
                  </pattern>
                </defs>
                <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                <rect width="400" height="400" fill="url(#dots)"/>
                <path d="M20 200 Q200 100 380 200 Q200 300 20 200" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <path d="M200 20 Q300 200 200 380 Q100 200 200 20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
              </svg>
            </div>
          </div>

          <div className="relative z-10 p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="max-w-4xl mx-auto">
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {features.map((feature, index) => (
                  <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed mb-4">
                        {feature.description}
                      </CardDescription>
                      {/* Feature Image Placeholder */}
                      <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <feature.icon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg font-medium"
                  onClick={() => navigate('/appstore')}
                >
                  Explore Applications
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-card border-l border-border p-4">
        <div className="space-y-6">
          {/* Test Capabilities */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Test SupplyAI Studios abilities
            </h3>
            <p className="text-xs text-muted-foreground">
              See what steps SupplyAI Studio is currently undertaking to develop a trusted AI framework.
            </p>
          </div>

          {/* Chat History */}
          <div>
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Chat History
              <Badge variant="secondary" className="ml-auto text-xs">0</Badge>
            </h3>
            <div className="text-sm text-muted-foreground">
              No recent conversations
            </div>
          </div>

          {/* Your Prompts */}
          <div>
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              Your Prompts
              <Badge variant="secondary" className="ml-auto text-xs">0</Badge>
            </h3>
            <div className="text-sm text-muted-foreground">
              No saved prompts
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home