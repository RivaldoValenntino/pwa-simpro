import React from "react";

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const KwluaCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md w-full mx-auto mb-4">
      <SkeletonBox className="h-5 w-1/2 mx-auto mb-4" />

      <div className="grid grid-cols-4 gap-2 text-center mb-2 text-xs font-medium text-gray-700">
        <div></div>
        <SkeletonBox className="h-6" />
        <SkeletonBox className="h-6" />
        <div></div>
      </div>

      <div className="space-y-3 text-sm">
        {[1, 2, 3].map((_, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2 items-center">
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-8 w-full bg-greenCust/80" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default KwluaCardSkeleton;
