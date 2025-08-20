import React from 'react'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Bot, Workflow, MessageSquare, TrendingUp, Shield, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Agents",
      description: "Intelligent conversational agents that understand supply chain complexities"
    },
    {
      icon: Workflow,
      title: "Workflow Automation", 
      description: "Streamline processes with automated decision making and approvals"
    },
    {
      icon: MessageSquare,
      title: "Interactive Chat",
      description: "Natural language interface for complex supply chain queries"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Forecast demand, identify risks, and optimize inventory levels"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Proactive monitoring and assessment of supplier and operational risks"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant analysis and response to supply chain events"
    }
  ]

  const stats = [
    { label: "Active Apps", value: "12+", description: "Production-ready applications" },
    { label: "Domains", value: "3", description: "General, Supply Chain & Pharma" },
    { label: "Processing Time", value: "<2s", description: "Average response time" },
    { label: "Accuracy", value: "99.2%", description: "Decision accuracy rate" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="globe-decoration absolute inset-0" />
        <div className="container relative py-20 sm:py-28">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <Badge className="mb-6 px-4 py-2 text-sm font-medium" variant="secondary">
              Next-Generation Supply Chain Intelligence
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              SupplyAI Studio
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 leading-relaxed">
              Transform your supply chain with AI-powered agents, intelligent workflows, 
              and predictive analytics. Built for enterprises that demand excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-medium"
                onClick={() => navigate('/appstore')}
              >
                Explore Applications
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="font-medium text-foreground mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powered by Advanced AI Capabilities
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive suite of AI tools transforms how you manage, 
              optimize, and scale your supply chain operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join leading enterprises using SupplyAI Studio to optimize operations, 
              reduce costs, and accelerate growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/appstore')}
              >
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home