import React from "react";

/**
 * Reusable loading skeleton components for consistent loading states
 * across the application
 */

export const ThreadLoadingSkeleton = () => (
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-4 border-b">
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted/30 animate-pulse" />
      <div className="flex-1">
        <div className="h-3 sm:h-4 bg-muted/30 rounded animate-pulse mb-1 sm:mb-2" />
        <div className="h-2 sm:h-3 bg-muted/20 rounded animate-pulse w-2/3" />
      </div>
    </div>
    <div className="flex-1 p-2 sm:p-4 space-y-3 sm:space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-2 sm:gap-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-muted/30 animate-pulse" />
          <div className="flex-1 space-y-1 sm:space-y-2">
            <div className="h-2 sm:h-3 bg-muted/30 rounded animate-pulse" />
            <div className="h-2 sm:h-3 bg-muted/20 rounded animate-pulse w-3/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardLoadingSkeleton = () => (
  <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
    <div className="flex justify-between items-center pb-1 sm:pb-2 border-b">
      <div className="h-4 sm:h-6 bg-muted/30 rounded animate-pulse w-32 sm:w-48" />
      <div className="h-6 sm:h-8 bg-muted/30 rounded animate-pulse w-16 sm:w-24" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-2 sm:p-4 border rounded-lg">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted/30 rounded animate-pulse" />
            <div className="h-3 sm:h-4 bg-muted/30 rounded animate-pulse w-12 sm:w-16" />
          </div>
          <div className="h-6 sm:h-8 bg-muted/30 rounded animate-pulse mb-1 sm:mb-2" />
          <div className="h-2 sm:h-3 bg-muted/20 rounded animate-pulse w-16 sm:w-20" />
        </div>
      ))}
    </div>
  </div>
);

export const SidebarLoadingSkeleton = () => (
  <div className="flex flex-col gap-2 p-3">
    {/* New Thread Button Skeleton */}
    <div className="h-9 rounded-lg border border-dashed bg-muted/20 animate-pulse" />
    {/* Thread Items Skeleton */}
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-10 rounded-lg bg-muted/20 animate-pulse" />
    ))}
  </div>
);

export const ComponentLoadingSkeleton = ({ 
  width = "w-10", 
  height = "h-10", 
  className = "" 
}: {
  width?: string;
  height?: string;
  className?: string;
}) => (
  <div className={`${width} ${height} bg-muted rounded-md animate-pulse ${className}`} />
);

export const AuroraLoadingSkeleton = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/20" />
);

export const SidebarContainerLoadingSkeleton = () => (
  <div className="w-64 border-r bg-background/50 backdrop-blur-sm" />
);
