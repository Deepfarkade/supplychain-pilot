import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Grid3X3, 
  Bot, 
  Moon, 
  Sun, 
  HelpCircle, 
  Bell, 
  User,
  ChevronDown,
  Package
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AppHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const apps = [
    'Conversational Agents',
    'Direct GPT',
    'Document Comparer',
    'Inventory Dashboard',
    'Supply Chain Network',
    'Pharma Lab Analysis'
  ]

  const agentConfigs = [
    'Supply Chain Optimizer',
    'Risk Assessment Agent',
    'Demand Forecasting Agent',
    'Inventory Management Agent',
    'Quality Control Agent'
  ]

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid3X3, label: 'App Store', path: '/appstore' },
    { icon: Bot, label: 'Agent Configuration', path: '/agents' }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Left side - Brand and Navigation */}
        <div className="flex items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              <Package className="w-4 h-4" />
            </div>
            <div className="font-semibold text-foreground">SupplyChain AI Studio</div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
                  isActive(item.path) 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Right side - Controls */}
        <div className="ml-auto flex items-center gap-2">
          {/* Applications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                Applications
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto bg-popover border border-border">
              {apps.map((app) => (
                <DropdownMenuItem key={app} className="cursor-pointer">
                  {app}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Agent Configuration Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                Agent Config
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto bg-popover border border-border">
              {agentConfigs.map((config) => (
                <DropdownMenuItem key={config} className="cursor-pointer">
                  {config}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px]">
              3
            </Badge>
          </Button>

          {/* User Avatar */}
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
              DF
            </div>
            <span className="text-sm">DF</span>
          </Button>
        </div>
      </div>
    </header>
  )
}