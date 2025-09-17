"use client";

import { CryptoCardSkeleton, CryptoSpinner } from "@/components/ui/skeleton";
import { MotionDiv } from "@/components/motion";

export function DashboardLoading() {
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        <CryptoSpinner size="lg" className="mr-3" />
        <span className="text-lg font-medium">Loading Crypto Dashboard...</span>
      </MotionDiv>

      {/* Market Overview Cards Skeleton */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MotionDiv
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <CryptoCardSkeleton />
          </MotionDiv>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <CryptoSpinner size="sm" />
          <span className="text-base font-semibold">Loading Charts & Analysis...</span>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 crypto-card-glass p-6 rounded-lg border">
            <div className="h-80 flex items-center justify-center">
              <CryptoSpinner size="lg" />
            </div>
          </div>
          <div className="crypto-card-glass p-6 rounded-lg border">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-muted rounded animate-pulse w-12" />
                  <div className="h-4 bg-muted rounded animate-pulse w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionDiv>

      {/* Market Intelligence Section Skeleton */}
      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <CryptoSpinner size="sm" />
          <span className="text-base font-semibold">Loading Market Intelligence...</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="crypto-card-glass p-6 rounded-lg border">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-l-4 border-muted pl-4 py-3 bg-muted/20 rounded-r-lg">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          </div>
          <div className="crypto-card-glass p-6 rounded-lg border">
            <div className="text-center mb-4">
              <div className="h-8 bg-muted rounded animate-pulse w-16 mx-auto mb-2" />
              <div className="h-4 bg-muted rounded animate-pulse w-20 mx-auto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="h-6 bg-muted rounded animate-pulse w-12 mx-auto mb-1" />
                  <div className="h-3 bg-muted rounded animate-pulse w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}
