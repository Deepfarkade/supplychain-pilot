import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'

interface AppCardProps {
  title: string
  description: string
  imageUrl: string
  domain: string
  slug: string
  onExplore?: (domain: string, slug: string) => void
}

export function AppCard({ title, description, imageUrl, domain, slug, onExplore }: AppCardProps) {
  const handleExplore = () => {
    if (onExplore) {
      onExplore(domain, slug)
    }
  }

  return (
    <Card className="group card-hover cursor-pointer transition-all duration-200 hover:shadow-elevation hover:border-accent/20">
      <CardHeader className="pb-3">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted mb-3">
          <img 
            src={imageUrl} 
            alt={title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <CardTitle className="text-lg font-semibold leading-tight">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-accent hover:text-accent-foreground hover:bg-accent"
            onClick={handleExplore}
          >
            EXPLORE
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}