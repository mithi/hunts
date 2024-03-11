import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "../ui/card"

const SkeletonCard = () => {
  return (
    <Card className="w-full flex flex-col gap-2 p-8">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </Card>
  )
}

export default SkeletonCard
