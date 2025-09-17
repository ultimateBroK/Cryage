"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

// Improved loading component cho Thread
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

// Improved loading component cho CryptoDashboard
const DashboardLoadingSkeleton = () => (
  <div className="p-4 space-y-6">
    {/* Header skeleton */}
    <div className="flex justify-between items-center pb-2 border-b">
      <div className="h-6 bg-muted/30 rounded animate-pulse w-48" />
      <div className="h-8 bg-muted/30 rounded animate-pulse w-24" />
    </div>
    
    {/* Cards skeleton */}
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
    
    {/* Charts skeleton */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 p-6 border rounded-lg">
        <div className="h-80 bg-muted/20 rounded animate-pulse" />
      </div>
      <div className="p-6 border rounded-lg">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted/30 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Dynamic imports với tối ưu performance và preloading
const Thread = dynamic(
  () => import("@/components/assistant-ui/thread").then(m => ({ default: m.Thread })),
  { 
    ssr: false,
    loading: ThreadLoadingSkeleton
  }
);

const CryptoDashboard = dynamic(
  () => import("@/components/crypto-dashboard").then(m => ({ default: m.CryptoDashboard })),
  {
    ssr: false,
    loading: DashboardLoadingSkeleton,
  }
);



interface MainLayoutWithTabStateProps {
  onTabChange: (tab: string) => void;
  unreadMessageCount?: number;
  systemNotificationCount?: number;
}

const MainLayoutWithTabStateComponent: React.FC<MainLayoutWithTabStateProps> = ({
  onTabChange,
  unreadMessageCount = 0,
  systemNotificationCount = 0
}) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [preloadedTabs, setPreloadedTabs] = useState<Set<string>>(new Set(["chat"]));

  // Preload dashboard component sau 2 giây nếu user đang ở tab chat
  useEffect(() => {
    if (activeTab === "chat" && !preloadedTabs.has("dashboard")) {
      const timer = setTimeout(() => {
        // Preload dashboard component
        import("@/components/crypto-dashboard").then(() => {
          setPreloadedTabs(prev => new Set(prev).add("dashboard"));
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [activeTab, preloadedTabs]);

  // Preload component khi user hover vào tab
  const handleTabHover = (tab: string) => {
    if (!preloadedTabs.has(tab)) {
      if (tab === "dashboard") {
        import("@/components/crypto-dashboard").then(() => {
          setPreloadedTabs(prev => new Set(prev).add("dashboard"));
        });
      }
    }
  };

  const handleTabChange = React.useCallback((tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  }, [onTabChange]);

  return (
    <div className="flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
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

export const MainLayoutWithTabState = React.memo(MainLayoutWithTabStateComponent);
MainLayoutWithTabState.displayName = 'MainLayoutWithTabState';

