import React from 'react';

export const SkeletonBox = ({ className = '' }) => (
  <div
    className={`bg-gradient-to-r from-surface-alt/70 via-surface-alt to-surface-alt/70 bg-[length:200%_100%] animate-pulse rounded-lg ${className}`}
  />
);

export const RoomCardSkeleton = () => {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-border-custom shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0 animate-pulse">
      {/* Media skeleton */}
      <div className="lg:col-span-5 h-72 lg:h-auto min-h-[300px] bg-surface-alt/60 p-4 flex flex-col justify-between">
        <SkeletonBox className="w-28 h-6 rounded-md" />
        <SkeletonBox className="w-32 h-7 rounded-lg" />
      </div>

      {/* Details skeleton */}
      <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <SkeletonBox className="w-32 h-4" />
            <SkeletonBox className="w-24 h-4" />
          </div>
          <SkeletonBox className="w-3/4 h-8 mb-3" />
          <SkeletonBox className="w-full h-4 mb-2" />
          <SkeletonBox className="w-4/5 h-4 mb-6" />

          {/* Specs matrix skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-alt/40 mb-6">
            <SkeletonBox className="h-10 rounded-md" />
            <SkeletonBox className="h-10 rounded-md" />
            <SkeletonBox className="h-10 rounded-md" />
            <SkeletonBox className="h-10 rounded-md" />
          </div>

          {/* Tags */}
          <div className="flex gap-2">
            <SkeletonBox className="w-20 h-6 rounded" />
            <SkeletonBox className="w-28 h-6 rounded" />
            <SkeletonBox className="w-24 h-6 rounded" />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border-custom/60 flex items-center justify-between gap-4">
          <div>
            <SkeletonBox className="w-20 h-3 mb-1" />
            <SkeletonBox className="w-32 h-7" />
          </div>
          <div className="flex gap-2">
            <SkeletonBox className="w-24 h-10 rounded-lg" />
            <SkeletonBox className="w-32 h-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const RoomDetailSkeleton = () => {
  return (
    <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-8 animate-pulse">
      <SkeletonBox className="w-48 h-5 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <SkeletonBox className="w-full aspect-[16/10] rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            <SkeletonBox className="h-24 rounded-xl" />
            <SkeletonBox className="h-24 rounded-xl" />
            <SkeletonBox className="h-24 rounded-xl" />
            <SkeletonBox className="h-24 rounded-xl" />
          </div>
          <SkeletonBox className="w-2/3 h-10" />
          <SkeletonBox className="w-full h-24" />
        </div>
        <div className="lg:col-span-4">
          <SkeletonBox className="w-full h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
