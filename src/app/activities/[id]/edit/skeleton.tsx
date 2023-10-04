import { Skeleton as SkeletonComponent } from "@/components/ui/skeleton";

export const Skeleton = () => (
  <div className="space-y-4">
    <SkeletonComponent className="h-[32px] w-[90px]" />
    <div className="space-y-3">
      <div className="space-y-2">
        <SkeletonComponent className="h-[16px] w-[40px]" />
        <SkeletonComponent className="h-[40px] w-full" />
      </div>
      <div className="space-y-2">
        <SkeletonComponent className="h-[16px] w-[110px]" />
        <SkeletonComponent className="h-[80px] w-full" />
      </div>
      <div className="space-y-2">
        <SkeletonComponent className="h-[16px] w-[80px]" />
        <SkeletonComponent className="h-[40px] w-full" />
      </div>
      <div className="space-y-2">
        <SkeletonComponent className="h-[16px] w-[80px]" />
        <SkeletonComponent className="h-[40px] w-full" />
      </div>
      <div className="flex items-start gap-2">
        <div className="space-y-2">
          <SkeletonComponent className="h-[16px] w-[80px]" />
          <SkeletonComponent className="h-[40px] w-full" />
        </div>
        <div className="space-y-2">
          <SkeletonComponent className="h-[16px] w-[80px]" />
          <SkeletonComponent className="h-[40px] w-full" />
        </div>
      </div>
    </div>
  </div>
);
