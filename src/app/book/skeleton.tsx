import { Skeleton as SkeletonComponent } from "@/components/ui/skeleton";

export const Skeleton = () => (
  <div className="space-y-2">
    <SkeletonComponent className="w-[100px] h-[20px]" />
    <SkeletonComponent className="w-[150px] h-[20px]" />
    <SkeletonComponent className="w-[70px] h-[20px]" />
  </div>
);
