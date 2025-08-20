import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from './ThemeToggle'
import { ChevronDown, Bell, HelpCircle, Grid3X3, Settings, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const apps = [
  'Conversational Agents',
  'Conversational Agents V2',
  'Direct GPT',
  'Document Comparer',
  'Document Intelligence',
  'Document Summarizer',
  'Document Translator',
  'Document Writer',
  'Email Automation',
  'Gap Analyzer',
  'Golden Document Creator',
  'Graphical Intelligence',
  'Invoice Factoring'
]

const agentConfigs = [
  'Demand Forecast Review',
  'RFQ-to-Award Co-Pilot',
  'Supplier Risk Monitor',
  'Inventory Rebalancer',
  'Batch Release Assistant',
  'Deviation CAPA Summarizer',
  'Regulatory Dossier Helper'
]

export function AppHeader() {
  const navigate = useNavigate()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">SA</span>
            </div>
            <span className="font-semibold text-lg">SupplyAI Studio</span>
          </div>
          
          <nav className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2" onClick={() => navigate('/appstore')}>
                  <Grid3X3 className="h-4 w-4" />
                  App Store
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto scrollbar-thin">
                {apps.map((app) => (
                  <DropdownMenuItem key={app} className="cursor-pointer">
                    {app}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Agent Configuration
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto scrollbar-thin">
                {agentConfigs.map((config) => (
                  <DropdownMenuItem key={config} className="cursor-pointer">
                    {config}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Help & Documentation</SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <p className="text-muted-foreground">
                  Welcome to the Supply Chain Co-Pilot. Access documentation, 
                  tutorials, and support resources here.
                </p>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              3
            </Badge>
          </Button>
          
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>DF</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}