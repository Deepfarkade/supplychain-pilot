import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

/**
 * Enhanced skeleton components for microservice loading states
 */
export const MicroserviceCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3 animate-pulse">
    <Skeleton className="h-32 w-full rounded-md" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-8 w-16 rounded-full" />
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  </div>
);

export const MicroservicePageSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="border-b pb-4">
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    </div>
  </div>
);

export { Skeleton }
