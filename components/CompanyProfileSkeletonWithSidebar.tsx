import React from "react";

const SkeletonBox = ({ className }: any) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const CompanyProfileSkeletonWithSidebar = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Skeleton */}
      <aside className="w-64 bg-white p-4 space-y-4 border-r">
        {/* Logo */}
        <SkeletonBox className="w-32 h-6 mb-6" />

        {/* Menu items */}
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <SkeletonBox key={i} className="w-full h-4" />
        ))}
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 p-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <SkeletonBox className="w-32 h-6" />
          <div className="flex gap-4">
            <SkeletonBox className="w-6 h-6 rounded-full" />
            <SkeletonBox className="w-8 h-8 rounded-full" />
          </div>
        </div>

        {/* Company Overview */}
        <div className="bg-white p-6 rounded shadow-sm mb-6">
          <div className="flex items-center gap-6 mb-6">
            <SkeletonBox className="w-24 h-24 rounded-md" />
            <div className="flex flex-col gap-2">
              <SkeletonBox className="w-40 h-6" />
              <SkeletonBox className="w-48 h-4" />
              <div className="flex gap-4">
                <SkeletonBox className="w-24 h-4" />
                <SkeletonBox className="w-24 h-4" />
                <SkeletonBox className="w-24 h-4" />
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <SkeletonBox className="h-16" />
            <SkeletonBox className="h-16" />
            <SkeletonBox className="h-16" />
            <SkeletonBox className="h-16" />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b mb-4">
            {[1, 2, 2, 3, 4, 5, 6].map((_, i) => (
              <SkeletonBox key={i} className="w-24 h-6" />
            ))}
          </div>

          {/* Company Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SkeletonBox className="w-32 h-4 mb-2" />
              <SkeletonBox className="h-24 w-full" />
            </div>
            <div>
              <SkeletonBox className="w-32 h-4 mb-2" />
              <SkeletonBox className="h-24 w-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyProfileSkeletonWithSidebar;
