import { Skeleton } from '@/components/ui/skeleton'

export const PageSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="w-full h-[150px]" />
    <Skeleton className="w-full h-[150px]" />
    <Skeleton className="w-full h-[150px]" />
  </div>
);
