import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, MessageSquare, Clock, FileText, ChevronLeft } from 'lucide-react'

export function RightRail() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (isCollapsed) {
    return (
      <div className="w-12 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="mt-4 ml-2"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 flex-shrink-0 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Co-Pilot Panel</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Test Co-Pilot */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Test Co-Pilot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            See what steps the Co-Pilot is currently undertaking to develop a trusted AI framework.
          </p>
          <Button className="w-full">Start Testing</Button>
        </CardContent>
      </Card>

      {/* Chat History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Chat History
            <Badge variant="secondary" className="ml-auto">12</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Supply chain optimization", time: "2 hours ago" },
              { title: "Risk assessment workflow", time: "1 day ago" },
              { title: "Demand forecasting model", time: "2 days ago" }
            ].map((chat, index) => (
              <div key={index} className="flex flex-col gap-1 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <span className="text-sm font-medium">{chat.title}</span>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <Button variant="outline" size="sm" className="w-full">
            View All
          </Button>
        </CardContent>
      </Card>

      {/* Your Prompts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Your Prompts
            <Badge variant="secondary" className="ml-auto">8</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Inventory Analysis", category: "Supply Chain" },
              { title: "Quality Control", category: "Pharma" },
              { title: "Document Review", category: "General" }
            ].map((prompt, index) => (
              <div key={index} className="flex flex-col gap-1 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <span className="text-sm font-medium">{prompt.title}</span>
                <Badge variant="outline" className="text-xs w-fit">
                  {prompt.category}
                </Badge>
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <Button variant="outline" size="sm" className="w-full">
            Manage Prompts
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}