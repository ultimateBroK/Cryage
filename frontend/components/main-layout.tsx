"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  () => import("@/components/assistant-ui/thread").then(m => ({ default: m.Thread })),
  { ssr: false, loading: ThreadLoadingSkeleton }
);

const CryptoDashboard = dynamic(
  () => import("@/components/crypto-dashboard").then(m => ({ default: m.CryptoDashboard })),
  { ssr: false, loading: DashboardLoadingSkeleton }
);

// Removed SettingsPanel for this layout

interface MainLayoutProps {
  onTabChange?: (tab: string) => void;
  unreadMessageCount?: number;
  systemNotificationCount?: number;
}

const MainLayoutComponent = ({ onTabChange, unreadMessageCount = 0, systemNotificationCount = 0 }: MainLayoutProps) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [preloadedTabs, setPreloadedTabs] = useState<Set<string>>(new Set(["chat"]));

  // Smart preloading strategy
  useEffect(() => {
    const t = setTimeout(() => {
      if (!preloadedTabs.has("dashboard")) {
        import("@/components/crypto-dashboard").then(() => {
          setPreloadedTabs(prev => new Set(prev).add("dashboard"));
        });
      }
    }, 2000);

    return () => clearTimeout(t);
  }, [preloadedTabs]);

  // Preload on hover
  const handleTabHover = (tab: string) => {
    if (!preloadedTabs.has(tab)) {
      if (tab === "dashboard") {
        import("@/components/crypto-dashboard").then(() => {
          setPreloadedTabs(prev => new Set(prev).add("dashboard"));
        });
      }
    }
  };

  const handleSetActiveTab = React.useCallback((tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  }, [onTabChange]);

  return (
    <div className="flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleSetActiveTab} className="h-full flex flex-col">
        <TabsList className="flex w-full max-w-md mx-auto px-2 sm:px-4 mt-2 sm:mt-3 mb-2 gap-1">
          <TabsTrigger
            value="chat"
            className="flex-1 w-full flex items-center justify-center gap-2 min-h-[40px] touch-manipulation relative"
          >
            <MessageSquare className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-sm">Chat</span>
            {unreadMessageCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            onMouseEnter={() => handleTabHover("dashboard")}
            className="flex-1 w-full flex items-center justify-center gap-2 min-h-[40px] touch-manipulation relative"
          >
            <BarChart3 className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-sm">Dashboard</span>
            {systemNotificationCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {systemNotificationCount > 9 ? '9+' : systemNotificationCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
          <Suspense fallback={<ThreadLoadingSkeleton />}>
            <Thread />
          </Suspense>
        </TabsContent>

        <TabsContent value="dashboard" className="flex-1 m-0 overflow-hidden">
          <Suspense fallback={<DashboardLoadingSkeleton />}>
            <CryptoDashboard />
          </Suspense>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export const MainLayout = React.memo(MainLayoutComponent);
MainLayout.displayName = 'MainLayout';
