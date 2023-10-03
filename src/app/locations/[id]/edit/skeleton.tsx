import { Skeleton } from "@/components/ui/skeleton";

export const PageSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-[32px] w-[90px]" />
    <div className="space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-[16px] w-[40px]" />
        <Skeleton className="h-[40px] w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-[16px] w-[80px]" />
        <Skeleton className="h-[40px] w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-[16px] w-[110px]" />
        <Skeleton className="h-[40px] w-full" />
      </div>
    </div>
  </div>
);
