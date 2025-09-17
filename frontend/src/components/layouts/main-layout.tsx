"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";

// Reuse loading components từ main-layout-with-tab-state
const ThreadLoadingSkeleton = () => (
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-3 p-4 border-b">
      <div className="w-8 h-8 rounded-full bg-muted/30 animate-pulse" />
      <div className="flex-1">
        <div className="h-4 bg-muted/30 rounded animate-pulse mb-2" />
        <div className="h-3 bg-muted/20 rounded animate-pulse w-2/3" />
      </div>
    </div>
    <div className="flex-1 p-4 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-6 h-6 rounded bg-muted/30 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted/30 rounded animate-pulse" />
            <div className="h-3 bg-muted/20 rounded animate-pulse w-3/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardLoadingSkeleton = () => (
  <div className="p-4 space-y-6">
    <div className="flex justify-between items-center pb-2 border-b">
      <div className="h-6 bg-muted/30 rounded animate-pulse w-48" />
      <div className="h-8 bg-muted/30 rounded animate-pulse w-24" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 bg-muted/30 rounded animate-pulse" />
            <div className="h-4 bg-muted/30 rounded animate-pulse w-16" />
          </div>
          <div className="h-8 bg-muted/30 rounded animate-pulse mb-2" />
          <div className="h-3 bg-muted/20 rounded animate-pulse w-20" />
        </div>
      ))}
    </div>
  </div>
);

// Settings tab removed in this layout

// Optimized dynamic imports
const Thread = dynamic(
  () => import("@/components/features/assistant/thread").then(m => ({ default: m.Thread })),
  { ssr: false, loading: ThreadLoadingSkeleton }
);

const CryptoDashboard = dynamic(
  () => import("@/components/features/crypto/crypto-dashboard").then(m => ({ default: m.CryptoDashboard })),
  { ssr: false, loading: DashboardLoadingSkeleton }
);

// Removed SettingsPanel for this layout

interface MainLayoutProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  unreadMessageCount?: number;
  systemNotificationCount?: number;
}

const MainLayoutComponent = ({ activeTab = "chat", onTabChange, unreadMessageCount = 0, systemNotificationCount = 0 }: MainLayoutProps) => {
  const [preloadedTabs, setPreloadedTabs] = useState<Set<string>>(new Set(["chat"]));

  // Smart preloading strategy
  useEffect(() => {
    const t = setTimeout(() => {
      if (!preloadedTabs.has("dashboard")) {
        import("@/components/features/crypto/crypto-dashboard").then(() => {
          setPreloadedTabs(prev => new Set(prev).add("dashboard"));
        });
      }
    }, 2000);

    return () => clearTimeout(t);
  }, [preloadedTabs]);

  return (
    <div className="flex-1 overflow-hidden">
      {/* Optimized layout without redundant TabsList - now handled in header */}
      <div className="h-full flex flex-col">
        {activeTab === "chat" && (
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<ThreadLoadingSkeleton />}>
              <Thread />
            </Suspense>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<DashboardLoadingSkeleton />}>
              <CryptoDashboard />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export const MainLayout = React.memo(MainLayoutComponent);
MainLayout.displayName = 'MainLayout';
