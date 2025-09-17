"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, BarChart3, Settings } from "lucide-react";
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

const SettingsLoadingSkeleton = () => (
  <div className="p-4 space-y-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-6 border rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-muted/30 rounded animate-pulse" />
          <div className="h-5 bg-muted/30 rounded animate-pulse w-32" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-muted/20 rounded animate-pulse" />
          <div className="h-4 bg-muted/20 rounded animate-pulse w-3/4" />
          <div className="h-10 bg-muted/30 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// Optimized dynamic imports
const Thread = dynamic(
  () => import("@/components/assistant-ui/thread").then(m => ({ default: m.Thread })),
  { ssr: false, loading: ThreadLoadingSkeleton }
);

const CryptoDashboard = dynamic(
  () => import("@/components/crypto-dashboard").then(m => ({ default: m.CryptoDashboard })),
  { ssr: false, loading: DashboardLoadingSkeleton }
);

const SettingsPanel = dynamic(
  () => import("@/components/settings-panel").then(m => ({ default: m.SettingsPanel })),
  { ssr: false, loading: SettingsLoadingSkeleton }
);

const MainLayoutComponent = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [preloadedTabs, setPreloadedTabs] = useState<Set<string>>(new Set(["chat"]));

  // Smart preloading strategy
  useEffect(() => {
    const preloadOtherTabs = async () => {
      // Preload dashboard sau 3 giây
      setTimeout(() => {
        if (!preloadedTabs.has("dashboard")) {
          import("@/components/crypto-dashboard").then(() => {
            setPreloadedTabs(prev => new Set(prev).add("dashboard"));
          });
        }
      }, 3000);

      // Preload settings sau 5 giây (ít quan trọng hơn)
      setTimeout(() => {
        if (!preloadedTabs.has("settings")) {
          import("@/components/settings-panel").then(() => {
            setPreloadedTabs(prev => new Set(prev).add("settings"));
          });
        }
      }, 5000);
    };

    preloadOtherTabs();
  }, [preloadedTabs]);

  // Preload on hover
  const handleTabHover = (tab: string) => {
    if (!preloadedTabs.has(tab)) {
      const importMap = {
        dashboard: () => import("@/components/crypto-dashboard"),
        settings: () => import("@/components/settings-panel"),
      };

      const importFn = importMap[tab as keyof typeof importMap];
      if (importFn) {
        importFn().then(() => {
          setPreloadedTabs(prev => new Set(prev).add(tab));
        });
      }
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4 mb-2 bg-muted/50">
          <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-background">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger 
            value="dashboard" 
            onMouseEnter={() => handleTabHover("dashboard")}
            className="flex items-center gap-2 data-[state=active]:bg-background"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            onMouseEnter={() => handleTabHover("settings")}
            className="flex items-center gap-2 data-[state=active]:bg-background"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
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

        <TabsContent value="settings" className="flex-1 m-0 overflow-hidden">
          <Suspense fallback={<SettingsLoadingSkeleton />}>
            <SettingsPanel />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const MainLayout = React.memo(MainLayoutComponent);
MainLayout.displayName = 'MainLayout';
